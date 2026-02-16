'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AIChatInterface } from '@/components/ai-chat/ai-chat-interface';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  TrendingUp, 
  Bell, 
  Settings, 
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import { aiAgentService, ChatMessage } from '@/lib/services/ai-agent-service';
import { personalizationService, PersonalizedRecommendation } from '@/lib/services/personalization-service';
import { realtimeService, RealtimeUpdate } from '@/lib/services/realtime-service';

export default function AIChatPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeUpdate[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('🚀 Initializing AI Chat Page...');
        
        // Initialize AI agent service
        await aiAgentService.initialize();
        
        // Initialize personalization service
        await personalizationService.initializeUser('user_123');
        
        // Set up real-time updates
        realtimeService.subscribe('ai-chat', handleRealtimeUpdate);
        
        // Load user preferences
        const userProfile = personalizationService.getUserProfile();
        setUserPreferences(userProfile?.preferences || null);
        
        // Load recommendations
        const recs = personalizationService.getRecommendations();
        setRecommendations(recs);
        
        setIsInitialized(true);
        setIsLoading(false);
        
        console.log('✅ AI Chat Page initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing AI Chat Page:', error);
        setIsLoading(false);
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      realtimeService.unsubscribe('ai-chat');
    };
  }, []);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((update: RealtimeUpdate) => {
    setRealtimeUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
    
    // Show notification for high priority updates
    if (update.priority === 'urgent' || update.priority === 'high') {
      showNotification(update);
    }
  }, []);

  // Show notification
  const showNotification = (update: RealtimeUpdate) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Wojat Alert: ${update.type}`, {
        body: `New ${update.type} update available`,
        icon: '/wojat.png'
      });
    }
  };

  // Handle chat message
  const handleChatMessage = async (message: ChatMessage) => {
    try {
      // Send message to AI agent service
      const response = await aiAgentService.sendMessage(message.content);
      
      // Update personalization based on user interaction
      if (message.type === 'user') {
        // This would update user preferences based on the message
        console.log('📝 Updating user preferences based on message:', message.content);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error handling chat message:', error);
      return {
        id: Date.now().toString(),
        type: 'system' as const,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      };
    }
  };

  // Handle voice command
  const handleVoiceCommand = (command: string) => {
    console.log('🎤 Voice command received:', command);
    // Process voice command through AI agent
    aiAgentService.sendMessage(command);
  };

  // Mark recommendation as read
  const markRecommendationAsRead = (id: string) => {
    personalizationService.markRecommendationAsRead(id);
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  // Update user preferences
  const updatePreferences = async (newPreferences: any) => {
    await personalizationService.updatePreferences(newPreferences);
    setUserPreferences(newPreferences);
    
    // Regenerate recommendations
    const recs = personalizationService.getRecommendations();
    setRecommendations(recs);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <AIChatInterface
                onMessage={handleChatMessage}
                onVoiceCommand={handleVoiceCommand}
                personalization={userPreferences}
                className="h-full"
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* System Status */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Bot className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">System Status</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>AI Agent:</span>
                  <Badge variant={isInitialized ? "default" : "destructive"}>
                    {isInitialized ? "Online" : "Offline"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Real-time:</span>
                  <Badge variant={realtimeService.isWebSocketConnected() ? "default" : "secondary"}>
                    {realtimeService.isWebSocketConnected() ? "Connected" : "Simulated"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Updates:</span>
                  <span className="text-muted-foreground">{realtimeUpdates.length}</span>
                </div>
              </div>
            </Card>

            {/* Personalized Recommendations */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Recommendations</h3>
              </div>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                    onClick={() => markRecommendationAsRead(rec.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rec.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {rec.content.substring(0, 50)}...
                        </p>
                      </div>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recommendations yet
                  </p>
                )}
              </div>
            </Card>

            {/* Real-time Updates */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Live Updates</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {realtimeUpdates.slice(0, 5).map((update) => (
                  <div key={update.id} className="p-2 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={update.priority === 'urgent' ? 'destructive' : update.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {update.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {update.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">
                      {update.data?.message || update.data?.content || 'Update received'}
                    </p>
                  </div>
                ))}
                {realtimeUpdates.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No updates yet
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => aiAgentService.sendMessage('Show me trending memecoins')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => aiAgentService.sendMessage('Analyze the current market')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Market Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => aiAgentService.sendMessage('Show my portfolio')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => aiAgentService.sendMessage('Help me learn about trading')}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Learn Trading
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
