// AI Service for Phoenix AI Universal
// Handles real API integration with multiple AI providers

class AIService {
  constructor() {
    this.providers = {
      openai: {
        name: 'OpenAI',
        baseUrl: import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        models: {
          'gpt-4-turbo': 'gpt-4-turbo-preview',
          'gpt-4': 'gpt-4',
          'gpt-3.5-turbo': 'gpt-3.5-turbo'
        }
      },
      anthropic: {
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        models: {
          'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
          'claude-3-haiku-20240307': 'claude-3-haiku-20240307',
          'claude-3-opus-20240229': 'claude-3-opus-20240229'
        }
      }
    };
  }

  async sendMessage(provider, model, messages, config = {}) {
    try {
      switch (provider) {
        case 'openai':
          return await this.sendOpenAIMessage(model, messages, config);
        case 'anthropic':
          return await this.sendAnthropicMessage(model, messages, config);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async sendOpenAIMessage(model, messages, config) {
    const { temperature = 0.7, maxTokens = 4000, streamEnabled = false } = config;
    
    const requestBody = {
      model: this.providers.openai.models[model] || model,
      messages: messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      temperature,
      max_tokens: maxTokens,
      stream: streamEnabled
    };

    const response = await fetch(`${this.providers.openai.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.providers.openai.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    if (streamEnabled) {
      return this.handleStreamResponse(response);
    } else {
      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        metadata: {
          tokensUsed: data.usage?.total_tokens || 0,
          model: data.model,
          provider: 'openai'
        }
      };
    }
  }

  async sendAnthropicMessage(model, messages, config) {
    const { temperature = 0.7, maxTokens = 4000 } = config;
    
    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.type === 'system');
    const conversationMessages = messages.filter(m => m.type !== 'system');
    
    const requestBody = {
      model: this.providers.anthropic.models[model] || model,
      max_tokens: maxTokens,
      temperature,
      messages: conversationMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    };

    if (systemMessage) {
      requestBody.system = systemMessage.content;
    }

    const response = await fetch(`${this.providers.anthropic.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.providers.anthropic.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      metadata: {
        tokensUsed: data.usage?.output_tokens || 0,
        model: data.model,
        provider: 'anthropic'
      }
    };
  }

  async handleStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';

    return {
      async *stream() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') return;

                try {
                  const parsed = JSON.parse(data);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    content += delta;
                    yield { content, delta };
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      },
      content
    };
  }

  // Health check for providers
  async checkProviderHealth(provider) {
    try {
      const testMessage = [{ type: 'user', content: 'Hello' }];
      await this.sendMessage(provider, Object.keys(this.providers[provider].models)[0], testMessage);
      return { status: 'healthy', provider };
    } catch (error) {
      return { status: 'unhealthy', provider, error: error.message };
    }
  }

  // Get available providers
  getAvailableProviders() {
    return Object.keys(this.providers).filter(provider => {
      return this.providers[provider].apiKey;
    });
  }

  // Fallback logic
  async sendMessageWithFallback(primaryProvider, model, messages, config = {}) {
    const availableProviders = this.getAvailableProviders();
    
    // Try primary provider first
    if (availableProviders.includes(primaryProvider)) {
      try {
        return await this.sendMessage(primaryProvider, model, messages, config);
      } catch (error) {
        console.warn(`Primary provider ${primaryProvider} failed:`, error.message);
      }
    }

    // Try fallback providers
    for (const provider of availableProviders) {
      if (provider !== primaryProvider) {
        try {
          // Use default model for fallback provider
          const fallbackModel = Object.keys(this.providers[provider].models)[0];
          return await this.sendMessage(provider, fallbackModel, messages, config);
        } catch (error) {
          console.warn(`Fallback provider ${provider} failed:`, error.message);
        }
      }
    }

    throw new Error('All AI providers are currently unavailable');
  }
}

export default AIService;

