import { useState, useCallback, useRef } from 'react';
import AIService from '../lib/aiService';

const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamingContent, setStreamingContent] = useState('');
  const aiServiceRef = useRef(new AIService());

  const sendMessage = useCallback(async (provider, model, messages, config = {}) => {
    setIsLoading(true);
    setError(null);
    setStreamingContent('');

    try {
      const aiService = aiServiceRef.current;
      
      if (config.fallbackEnabled) {
        const result = await aiService.sendMessageWithFallback(provider, model, messages, config);
        return result;
      } else {
        const result = await aiService.sendMessage(provider, model, messages, config);
        
        if (config.streamEnabled && result.stream) {
          // Handle streaming response
          let fullContent = '';
          for await (const chunk of result.stream()) {
            fullContent = chunk.content;
            setStreamingContent(chunk.content);
          }
          setStreamingContent('');
          return {
            content: fullContent,
            metadata: {
              tokensUsed: Math.floor(fullContent.length / 4), // Rough estimate
              model,
              provider,
              responseTime: Date.now()
            }
          };
        }
        
        return result;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkProviderHealth = useCallback(async (provider) => {
    try {
      const aiService = aiServiceRef.current;
      return await aiService.checkProviderHealth(provider);
    } catch (err) {
      return { status: 'unhealthy', provider, error: err.message };
    }
  }, []);

  const getAvailableProviders = useCallback(() => {
    const aiService = aiServiceRef.current;
    return aiService.getAvailableProviders();
  }, []);

  return {
    sendMessage,
    checkProviderHealth,
    getAvailableProviders,
    isLoading,
    error,
    streamingContent,
    setError
  };
};

export default useAI;

