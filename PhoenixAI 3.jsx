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

