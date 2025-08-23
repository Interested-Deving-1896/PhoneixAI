import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Settings, 
  BarChart3, 
  Palette, 
  Code, 
  Zap, 
  ChevronDown, 
  Cpu, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Download, 
  Copy, 
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PhoenixAI = () => {
  // State Management
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      content: "Welcome to Phoenix AI - your elite Principal Development & Design Architect. I'm ready to transform your ideas into exceptional digital experiences through world-class engineering and sophisticated design thinking.",
      timestamp: new Date(),
      model: 'system'
    }
  ]);

  const [input, setInput] = useState('');
  const [activePhase, setActivePhase] = useState('discovery');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('anthropic');
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet-20241022');
  const [streamingContent, setStreamingContent] = useState('');
  const [sessionTitle, setSessionTitle] = useState('New Phoenix Project');
  const [error, setError] = useState(null);

  // AI Configuration
  const [aiConfig, setAiConfig] = useState({
    temperature: 0.7,
    maxTokens: 4000,
    fallbackEnabled: true,
    streamEnabled: true,
    systemPrompt: ''
  });

  // Provider Management
  const [providers, setProviders] = useState([]);
  const [providerStats, setProviderStats] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // AI Provider Configurations
  const aiProviders = {
    anthropic: {
      name: 'Anthropic',
      models: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', tier: 'premium', strengths: ['reasoning', 'code', 'analysis'] },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', tier: 'fast', strengths: ['speed', 'cost'] },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', tier: 'flagship', strengths: ['creativity', 'complex reasoning'] }
      ],
      color: 'from-orange-500 to-red-500',
      icon: '🟠'
    },
    openai: {
      name: 'OpenAI',
      models: [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', tier: 'premium', strengths: ['multimodal', 'speed', 'general'] },
        { id: 'gpt-4', name: 'GPT-4', tier: 'premium', strengths: ['reasoning', 'creativity'] },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', tier: 'fast', strengths: ['speed', 'cost'] }
      ],
      color: 'from-green-500 to-emerald-500',
      icon: '🟢'
    },
    google: {
      name: 'Google',
      models: [
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tier: 'premium', strengths: ['multimodal', 'reasoning'] },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tier: 'fast', strengths: ['speed', 'efficiency'] }
      ],
      color: 'from-blue-500 to-indigo-500',
      icon: '🔵'
    },
    cohere: {
      name: 'Cohere',
      models: [
        { id: 'command-r-plus', name: 'Command R+', tier: 'premium', strengths: ['reasoning', 'tools'] },
        { id: 'command-r', name: 'Command R', tier: 'standard', strengths: ['general', 'cost'] }
      ],
      color: 'from-purple-500 to-violet-500',
      icon: '🟣'
    },
    local: {
      name: 'Local Models',
      models: [
        { id: 'llama3.1', name: 'Llama 3.1', tier: 'opensource', strengths: ['privacy', 'cost'] },
        { id: 'mixtral', name: 'Mixtral 8x7B', tier: 'opensource', strengths: ['code', 'efficiency'] },
        { id: 'codellama', name: 'CodeLlama', tier: 'opensource', strengths: ['code', 'privacy'] }
      ],
      color: 'from-gray-500 to-gray-600',
      icon: '⚡'
    }
  };

  const phases = [
    { id: 'discovery', name: 'Discovery', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'concept', name: 'Conceptualization', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'implement', name: 'Implementation', icon: Code, color: 'from-green-500 to-emerald-500' },
    { id: 'integrate', name: 'Integration', icon: Zap, color: 'from-orange-500 to-yellow-500' }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Update system prompt when phase changes
  useEffect(() => {
    const phasePrompts = {
      discovery: 'Focus on gathering requirements, identifying gaps, and defining success metrics.',
      concept: 'Generate distinct approaches with detailed rationale and trade-offs.',
      implement: 'Build working features incrementally with complete, deployable code.',
      integrate: 'Focus on system integration, optimization, and deployment preparation.'
    };

    setAiConfig(prev => ({
      ...prev,
      systemPrompt: `You are Phoenix, an elite Principal Development & Design Architect. Current phase: ${activePhase}. ${phasePrompts[activePhase] || ''}`
    }));
  }, [activePhase]);

  // Mock API Functions (since we don't have backend)
  const sendMessage = useCallback(async (messageContent) => {
    setIsLoading(true);
    setError(null);

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Simulate AI response with streaming
      const mockResponse = `As Phoenix, your elite Principal Development & Design Architect, I understand you're in the ${activePhase} phase.

Based on your request: "${messageContent}"

Let me provide you with a comprehensive analysis:

## Current Phase: ${phases.find(p => p.id === activePhase)?.name}

This is a sophisticated approach that requires careful consideration of multiple factors:

1. **Technical Architecture**: We need to establish a robust foundation
2. **Design Principles**: User experience must be at the forefront
3. **Implementation Strategy**: Iterative development with continuous feedback
4. **Integration Planning**: Seamless connectivity between components

The selected provider (${aiProviders[selectedProvider]?.name}) with model ${selectedModel} is well-suited for this type of analysis.

Would you like me to dive deeper into any specific aspect of this solution?`;

      // Simulate streaming
      if (aiConfig.streamEnabled) {
        const words = mockResponse.split(' ');
        let currentContent = '';
        
        for (let i = 0; i < words.length; i++) {
          currentContent += words[i] + ' ';
          setStreamingContent(currentContent);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        setStreamingContent('');
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
        model: selectedModel,
        provider: selectedProvider,
        metadata: {
          tokensUsed: Math.floor(Math.random() * 1000) + 500,
          responseTime: Math.floor(Math.random() * 2000) + 1000,
          confidence: 0.95
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError('Failed to send message. This is a demo version.');
    } finally {
      setIsLoading(false);
    }
  }, [activePhase, selectedProvider, selectedModel, aiConfig.streamEnabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const exportChat = (format) => {
    const chatData = {
      title: sessionTitle,
      phase: activePhase,
      messages: messages.filter(m => m.type !== 'system'),
      exportedAt: new Date().toISOString()
    };

    let content, filename, mimeType;

    switch (format) {
      case 'json':
        content = JSON.stringify(chatData, null, 2);
        filename = `phoenix-chat-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
      case 'markdown':
        content = `# ${sessionTitle}\n\n**Phase:** ${activePhase}\n**Exported:** ${new Date().toLocaleString()}\n\n---\n\n`;
        content += messages.filter(m => m.type !== 'system').map(m => 
          `## ${m.type === 'user' ? 'User' : 'Phoenix AI'}\n*${m.timestamp.toLocaleString()}*\n\n${m.content}\n\n---\n`
        ).join('\n');
        filename = `phoenix-chat-${Date.now()}.md`;
        mimeType = 'text/markdown';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep system message
    setSessionTitle('New Phoenix Project');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Phoenix AI</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Elite Architecture Platform</p>
            </div>
          </div>

          {/* Session Title */}
          <Input
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            className="mb-4"
            placeholder="Project title..."
          />

          {/* Phase Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Workflow Phase</label>
            <div className="grid grid-cols-2 gap-2">
              {phases.map((phase) => {
                const Icon = phase.icon;
                return (
                  <Button
                    key={phase.id}
                    variant={activePhase === phase.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePhase(phase.id)}
                    className={`justify-start ${activePhase === phase.id ? `bg-gradient-to-r ${phase.color} text-white` : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {phase.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">AI Provider</label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(aiProviders).map(([key, provider]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <span>{provider.icon}</span>
                    <span>{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 mt-4 block">Model</label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiProviders[selectedProvider]?.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    <Badge variant="secondary" className="ml-2">{model.tier}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Settings */}
        <div className="p-6 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="w-full justify-between mb-4"
          >
            <span className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
          </Button>

          {showAdvancedSettings && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Temperature: {aiConfig.temperature}
                </label>
                <Slider
                  value={[aiConfig.temperature]}
                  onValueChange={([value]) => setAiConfig(prev => ({ ...prev, temperature: value }))}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Max Tokens: {aiConfig.maxTokens}
                </label>
                <Slider
                  value={[aiConfig.maxTokens]}
                  onValueChange={([value]) => setAiConfig(prev => ({ ...prev, maxTokens: value }))}
                  max={8000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Streaming</label>
                <Switch
                  checked={aiConfig.streamEnabled}
                  onCheckedChange={(checked) => setAiConfig(prev => ({ ...prev, streamEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fallback</label>
                <Switch
                  checked={aiConfig.fallbackEnabled}
                  onCheckedChange={(checked) => setAiConfig(prev => ({ ...prev, fallbackEnabled: checked }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => exportChat('markdown')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearChat}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${aiProviders[selectedProvider]?.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white text-sm">{aiProviders[selectedProvider]?.icon}</span>
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">{sessionTitle}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {aiProviders[selectedProvider]?.name} • {selectedModel}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`bg-gradient-to-r ${phases.find(p => p.id === activePhase)?.color} text-white border-0`}>
                {phases.find(p => p.id === activePhase)?.name}
              </Badge>
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'} rounded-lg p-4 shadow-sm`}>
                  {message.type === 'system' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-500">Phoenix AI System</span>
                    </div>
                  )}
                  {message.type === 'assistant' && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 bg-gradient-to-r ${aiProviders[message.provider]?.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white text-xs">{aiProviders[message.provider]?.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phoenix AI</span>
                        <Badge variant="outline" size="sm">{message.model}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        {message.metadata && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {message.metadata.tokensUsed} tokens • {message.metadata.responseTime}ms
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 bg-gradient-to-r ${aiProviders[selectedProvider]?.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs">{aiProviders[selectedProvider]?.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phoenix AI</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-500">Thinking...</span>
                    </div>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {streamingContent.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-3 h-3 text-white animate-spin" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Phoenix is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <div className="p-4">
            <Alert className="max-w-4xl mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask Phoenix about your ${phases.find(p => p.id === activePhase)?.name.toLowerCase()} phase...`}
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{input.length} characters</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhoenixAI;

