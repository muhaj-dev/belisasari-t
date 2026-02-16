'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  AlertCircle, 
  BarChart3,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  data?: any; // For charts, recommendations, etc.
  isTyping?: boolean;
}

interface AIChatInterfaceProps {
  onMessage?: (message: Message) => void;
  onVoiceCommand?: (command: string) => void;
  personalization?: any;
  className?: string;
}

export function AIChatInterface({ 
  onMessage, 
  onVoiceCommand, 
  personalization,
  className = '' 
}: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m Wojat, your AI memecoin hunting assistant. I can help you find trending memecoins, analyze market data, and provide trading insights. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Call onMessage callback
    onMessage?.(userMessage);

    try {
      // Simulate AI response (replace with actual API call)
      const response = await simulateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        data: response.data,
      };

      setMessages(prev => [...prev, aiMessage]);
      onMessage?.(aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Start voice recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        onVoiceCommand?.(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (input: string): Promise<{ content: string; data?: any }> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('trending') || lowerInput.includes('trend')) {
      return {
        content: 'Here are the current trending memecoins based on TikTok data:',
        data: {
          type: 'trending',
          tokens: [
            { symbol: 'BONK', price: 0.000012, change: 15.67, volume: '1.2M' },
            { symbol: 'WIF', price: 2.45, change: 8.23, volume: '850K' },
            { symbol: 'PEPE', price: 0.000001, change: -3.45, volume: '650K' }
          ]
        }
      };
    }

    if (lowerInput.includes('analysis') || lowerInput.includes('analyze')) {
      return {
        content: 'Based on current market data and social sentiment, here\'s my analysis:',
        data: {
          type: 'analysis',
          summary: 'Strong bullish momentum detected across multiple memecoins with high TikTok engagement',
          recommendation: 'Consider small positions in trending tokens with proper risk management',
          confidence: 0.75
        }
      };
    }

    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return {
        content: 'I can help you with:\n\n• Finding trending memecoins from TikTok\n• Analyzing market data and sentiment\n• Providing trading recommendations\n• Explaining trading strategies\n• Tracking your portfolio performance\n\nJust ask me anything about memecoin trading!',
        data: { type: 'help' }
      };
    }

    return {
      content: 'I understand you\'re asking about memecoins. Could you be more specific about what you\'d like to know? I can help with trending analysis, market insights, or trading recommendations.',
      data: { type: 'general' }
    };
  };

  // Render message content
  const renderMessageContent = (message: Message) => {
    if (message.data?.type === 'trending') {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <div className="space-y-2">
            {message.data.tokens.map((token: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{token.symbol}</Badge>
                    <span className="text-sm font-medium">${token.price.toFixed(6)}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${token.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change > 0 ? '+' : ''}{token.change}%
                    </div>
                    <div className="text-xs text-muted-foreground">Vol: {token.volume}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (message.data?.type === 'analysis') {
      return (
        <div className="space-y-3">
          <p>{message.content}</p>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Analysis Summary</span>
              </div>
              <p className="text-sm text-muted-foreground">{message.data.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Recommendation:</span>
                <Badge variant="outline">{message.data.recommendation}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence:</span>
                <span className="text-sm font-medium">{Math.round(message.data.confidence * 100)}%</span>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap">{message.content}</p>;
  };

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Wojat AI Assistant</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'ai'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : message.type === 'ai' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.type === 'ai'
                      ? 'bg-muted'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex items-center space-x-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Wojat is typing...</span>
                    </div>
                  ) : (
                    renderMessageContent(message)
                  )}
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Wojat is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Wojat about memecoins..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={isListening ? 'bg-red-500 text-white' : ''}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, or use voice input with the microphone button
        </div>
      </div>
    </div>
  );
}
