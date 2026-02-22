// AI Agent Integration Service - Client-side compatible version
// Note: This is a client-side mock that would connect to a backend API in production

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  data?: any;
}

export interface UserPreferences {
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoals: string[];
  favoriteTokens: string[];
  notificationSettings: {
    trendingAlerts: boolean;
    priceAlerts: boolean;
    analysisUpdates: boolean;
    voiceEnabled: boolean;
  };
  tradingExperience: 'beginner' | 'intermediate' | 'advanced';
}

export interface TrendingData {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  tiktokMentions: number;
  socialSentiment: number;
  recommendation: 'buy' | 'hold' | 'sell' | 'watch';
  confidence: number;
}

export interface MarketAnalysis {
  summary: string;
  recommendation: string;
  confidence: number;
  keyFactors: string[];
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
}

export class AIAgentService {
  private userPreferences: UserPreferences | null = null;
  private isInitialized = false;
  private conversationHistory: ChatMessage[] = [];
  private lastResponseType: string = '';

  constructor() {
    // Client-side constructor - no server-side imports
  }

  // Initialize the AI agent service
  async initialize(): Promise<boolean> {
    try {
      console.log('🤖 Initializing AI Agent Service...');
      
      // Client-side initialization - would connect to backend API in production
      this.isInitialized = true;
      console.log('✅ AI Agent Service initialized successfully (client-side mode)');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI Agent Service:', error);
      return false;
    }
  }

  // Send message to AI agent and get response
  async sendMessage(message: string, userId?: string): Promise<ChatMessage> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('💬 Sending message to AI agent:', message);

      // Process the message and get AI response
      const response = await this.processUserMessage(message, userId);
      
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error sending message to AI agent:', error);
      return {
        id: Date.now().toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date()
      };
    }
  }

  /** Call OpenAI via our API with optional context (trending, portfolio, etc.). */
  private async fetchOpenAICompletion(context: string, userMessage: string): Promise<string | null> {
    try {
      const res = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user' as const, content: userMessage }],
          context: context || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return null;
      return typeof data.content === 'string' ? data.content : null;
    } catch {
      return null;
    }
  }

  // Process user message and generate AI response
  private async processUserMessage(message: string, userId?: string): Promise<{ content: string; data?: any }> {
    const lowerMessage = message.toLowerCase();

    // Add user message to conversation history
    this.conversationHistory.push({
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    });

    // Handle greetings and casual conversation
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return this.handleGreeting();
    }

    // Handle different types of queries
    if (lowerMessage.includes('trending') || lowerMessage.includes('trend')) {
      this.lastResponseType = 'trending';
      return await this.handleTrendingQuery();
    }

    if (lowerMessage.includes('analysis') || lowerMessage.includes('analyze') || lowerMessage.includes('market insights')) {
      this.lastResponseType = 'analysis';
      return await this.handleAnalysisQuery();
    }

    if (lowerMessage.includes('recommendation') || lowerMessage.includes('recommend') || lowerMessage.includes('trading recommendations')) {
      this.lastResponseType = 'recommendation';
      return await this.handleRecommendationQuery();
    }

    if (lowerMessage.includes('portfolio') || lowerMessage.includes('my tokens')) {
      this.lastResponseType = 'portfolio';
      return await this.handlePortfolioQuery();
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      this.lastResponseType = 'help';
      return this.handleHelpQuery();
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('$')) {
      this.lastResponseType = 'price';
      return await this.handlePriceQuery(message);
    }

    // Handle follow-up questions based on conversation context
    if (this.lastResponseType === 'trending' && (lowerMessage.includes('more') || lowerMessage.includes('details'))) {
      return await this.handleDetailedTrendingQuery();
    }

    if (this.lastResponseType === 'recommendation' && (lowerMessage.includes('why') || lowerMessage.includes('reason'))) {
      return await this.handleRecommendationExplanation();
    }

    // Default response with more personality
    const responses = [
      "Hey there! I'm Belisasari, your memecoin trading assistant. I can help you discover trending tokens, analyze market data, and make smarter trading decisions. What would you like to explore today?",
      "I'm here to help you navigate the exciting world of memecoins! Whether you're looking for the next big trend or want to understand market dynamics, just ask me anything.",
      "Ready to dive into memecoin trading? I can help you find trending tokens, analyze market sentiment, and provide trading insights. What's on your mind?",
      "Let's talk memecoins! I can help you with market analysis, trending discoveries, and trading strategies. What interests you most?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: randomResponse,
      data: { type: 'general' }
    };
  }

  // Handle greetings
  private handleGreeting(): { content: string; data?: any } {
    const greetings = [
      "Hey there! 👋 I'm Belisasari, your memecoin trading assistant. Ready to discover some amazing opportunities?",
      "Hello! I'm Belisasari, here to help you navigate the exciting world of memecoins. What can I help you with today?",
      "Hi! Welcome to Belisasari! I'm your AI assistant for memecoin trading. Let's find some trending gems together!",
      "Hey! I'm Belisasari, your personal memecoin analyst. Ready to explore the market and find some great opportunities?"
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return {
      content: randomGreeting,
      data: { type: 'greeting' }
    };
  }

  // Handle detailed trending query
  private async handleDetailedTrendingQuery(): Promise<{ content: string; data?: any }> {
    return {
      content: "Here's more detailed trending analysis:\n\n🔥 **Hot Tokens Right Now:**\n• BONK: +15.67% (High TikTok activity)\n• WIF: +8.23% (Growing community)\n• PEPE: +12.45% (Social sentiment spike)\n\n📊 **Key Metrics:**\n• Total TikTok mentions: 1,247\n• Average sentiment: 0.73 (Positive)\n• Volume spike detected: 3 tokens\n\n💡 **Insight:** The market is showing strong social momentum with TikTok driving significant attention to these tokens.",
      data: { type: 'detailed_trending' }
    };
  }

  // Handle recommendation explanation
  private async handleRecommendationExplanation(): Promise<{ content: string; data?: any }> {
    return {
      content: "Here's why I'm recommending these tokens:\n\n🎯 **BONK - BUY**\n• Strong TikTok presence (45 mentions)\n• Positive sentiment (0.8)\n• Volume increasing (+15.67%)\n• Community engagement high\n\n⚠️ **Risk Factors:**\n• High volatility expected\n• Market cap still growing\n• Social dependency\n\n📈 **Strategy:** Consider dollar-cost averaging and set stop-losses at 10% below entry.",
      data: { type: 'recommendation_explanation' }
    };
  }

  // Handle trending memecoin queries (wired to Jupiter + dashboard data)
  private async handleTrendingQuery(): Promise<{ content: string; data?: any }> {
    try {
      let context = '';
      const trendingData: TrendingData[] = [];
      try {
        const [jupiterRes, dashboardRes] = await Promise.all([
          fetch('/api/jupiter/tokens/list?list=trending'),
          fetch('/api/dashboard/trending-coins?limit=10'),
        ]);
        if (jupiterRes.ok) {
          const list = await jupiterRes.json();
          const items = Array.isArray(list) ? list.slice(0, 10) : [];
          context += `Jupiter trending tokens: ${items.map((t: { symbol?: string; name?: string }) => `${t.symbol ?? '?'} (${t.name ?? ''})`).join(', ')}. `;
          items.forEach((t: { symbol?: string; name?: string; price?: number; market_cap?: number }) => {
            trendingData.push({
              token: t.symbol ?? '?',
              price: typeof t.price === 'number' ? t.price : 0,
              change24h: 0,
              volume24h: 0,
              marketCap: typeof t.market_cap === 'number' ? t.market_cap : 0,
              tiktokMentions: 0,
              socialSentiment: 0.5,
              recommendation: 'watch',
              confidence: 0.6,
            });
          });
        }
        if (dashboardRes.ok) {
          const dash = await dashboardRes.json();
          const coins = dash?.coins ?? [];
          context += `Dashboard trending (volume/correlation): ${coins.map((c: { symbol?: string }) => c.symbol).join(', ')}. `;
        }
      } catch {
        // keep context empty, use fallback
      }
      const aiContent = context
        ? await this.fetchOpenAICompletion(
            context,
            'Summarize the current trending memecoins for the user in 2-3 short paragraphs. Mention specific tokens and what makes them interesting.'
          )
        : null;
      if (aiContent) {
        return {
          content: aiContent,
          data: { type: 'trending', tokens: trendingData, timestamp: new Date().toISOString() },
        };
      }
      return {
        content: trendingData.length > 0
          ? `Current trending tokens (Jupiter): ${trendingData.map((t) => t.token).join(', ')}. Check the dashboard for full analytics.`
          : 'Here are the current trending memecoins based on TikTok data and social sentiment. Check the Trending Coins page for live data.',
        data: { type: 'trending', tokens: trendingData, timestamp: new Date().toISOString() },
      };
    } catch (error) {
      console.error('Error handling trending query:', error);
      return {
        content: 'I\'m having trouble fetching trending data right now. Please try again in a moment.',
        data: { type: 'error' },
      };
    }
  }

  // Handle market analysis queries (wired to dashboard/trending + OpenAI)
  private async handleAnalysisQuery(): Promise<{ content: string; data?: any }> {
    try {
      let context = '';
      try {
        const [trendRes, coinsRes] = await Promise.all([
          fetch('/api/jupiter/tokens/list?list=trending'),
          fetch('/api/dashboard/trending-coins?limit=15'),
        ]);
        if (trendRes.ok) {
          const list = await trendRes.json();
          context += `Trending tokens: ${JSON.stringify(Array.isArray(list) ? list.slice(0, 8) : []).slice(0, 500)}. `;
        }
        if (coinsRes.ok) {
          const data = await coinsRes.json();
          context += `Dashboard: ${JSON.stringify(data?.coins?.slice(0, 5) ?? []).slice(0, 400)}.`;
        }
      } catch {
        // continue with empty context
      }
      const analysis: MarketAnalysis = {
        summary: 'Strong bullish momentum detected across multiple memecoins with high TikTok engagement. Volume spikes indicate increased retail interest.',
        recommendation: 'Consider small positions in trending tokens with proper risk management. Focus on tokens with strong social sentiment and volume.',
        confidence: 0.75,
        keyFactors: [
          'High TikTok engagement for memecoin content',
          'Increased trading volume across multiple tokens',
          'Positive social sentiment on Twitter and Discord',
          'Strong technical indicators on key tokens'
        ],
        riskLevel: 'medium',
        timeHorizon: 'short'
      };
      const aiContent = context
        ? await this.fetchOpenAICompletion(
            context,
            'Give a short market analysis and trading recommendation for Solana memecoins based on the data. Be concise (2-3 paragraphs), mention risk.'
          )
        : null;

      return {
        content: aiContent ?? 'Based on current market data and social sentiment, here\'s my analysis:',
        data: {
          type: 'analysis',
          analysis: analysis,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error handling analysis query:', error);
      return {
        content: 'I\'m having trouble analyzing the market right now. Please try again in a moment.',
        data: { type: 'error' }
      };
    }
  }

  // Handle recommendation queries
  private async handleRecommendationQuery(): Promise<{ content: string; data?: any }> {
    try {
      const recommendations = [
        {
          token: 'BONK',
          action: 'BUY',
          reason: 'High TikTok engagement and volume spike detected',
          confidence: 0.85,
          riskLevel: 'Medium',
          targetPrice: 0.000015,
          stopLoss: 0.000008
        },
        {
          token: 'WIF',
          action: 'HOLD',
          reason: 'Stable performance with consistent social mentions',
          confidence: 0.70,
          riskLevel: 'Low',
          targetPrice: 2.50,
          stopLoss: 1.80
        }
      ];

      const responseTexts = [
        "Here are my current trading recommendations based on market analysis and social sentiment:",
        "Based on the latest data, here's what I'm seeing in the market:",
        "I've analyzed the current trends and here are my recommendations:",
        "Here's my take on the current market opportunities:"
      ];

      const randomResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)];

      return {
        content: randomResponse,
        data: {
          type: 'recommendations',
          recommendations: recommendations,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error handling recommendation query:', error);
      return {
        content: 'I\'m having trouble generating recommendations right now. Please try again in a moment.',
        data: { type: 'error' }
      };
    }
  }

  // Handle portfolio queries (OpenAI can give general advice; Zerion data is on Portfolio page)
  private async handlePortfolioQuery(): Promise<{ content: string; data?: any }> {
    try {
      const context = 'User is asking about their portfolio. Belisasari has a Portfolio page (Zerion) for wallet value, token balances, and DeFi positions.';
      const aiContent = await this.fetchOpenAICompletion(
        context,
        'The user asked about their portfolio. Give brief advice on tracking Solana portfolios: suggest checking the Portfolio page for Zerion data, diversifying, and risk management. Keep it to 2 short paragraphs.'
      );
      const portfolioData = {
        totalValue: 1162.00,
        totalChange: 8.45,
        tokens: [
          { symbol: 'BONK', amount: 1000000, value: 12.00, change: 15.67 },
          { symbol: 'WIF', amount: 50, value: 100.00, change: 8.23 },
          { symbol: 'SOL', amount: 10.5, value: 1050.00, change: 5.12 }
        ]
      };
      return {
        content: aiContent ?? 'Check the Portfolio page (Zerion) for your wallet value, token balances, and DeFi positions. I can give general diversification and risk management tips—just ask.',
        data: { type: 'portfolio', portfolio: portfolioData, timestamp: new Date().toISOString() },
      };
    } catch (error) {
      console.error('Error handling portfolio query:', error);
      return {
        content: 'I\'m having trouble accessing your portfolio data right now. Please try again in a moment.',
        data: { type: 'error' }
      };
    }
  }

  // Handle help queries
  private handleHelpQuery(): { content: string; data?: any } {
    return {
      content: 'I\'m Belisasari, your AI memecoin hunting assistant! I can help you with:\n\n' +
        '🔍 **Finding Trending Memecoins**\n' +
        '• "Show me trending memecoins"\n' +
        '• "What\'s hot on TikTok right now?"\n\n' +
        '📊 **Market Analysis**\n' +
        '• "Analyze the current market"\n' +
        '• "What\'s the market sentiment?"\n\n' +
        '💡 **Trading Recommendations**\n' +
        '• "Give me trading recommendations"\n' +
        '• "Should I buy BONK?"\n\n' +
        '📈 **Portfolio Tracking**\n' +
        '• "Show my portfolio"\n' +
        '• "How are my tokens performing?"\n\n' +
        '🎓 **Education**\n' +
        '• "Explain risk management"\n' +
        '• "How do I read charts?"\n\n' +
        'Just ask me anything about memecoin trading!',
      data: { type: 'help' }
    };
  }

  // Handle price queries
  private async handlePriceQuery(message: string): Promise<{ content: string; data?: any }> {
    try {
      // Extract token symbol from message
      const tokenMatch = message.match(/\$?([A-Z]{2,5})/i);
      const token = tokenMatch ? tokenMatch[1].toUpperCase() : 'UNKNOWN';

      // This would integrate with real price data
      const priceData = {
        token: token,
        price: 0.000012,
        change24h: 15.67,
        volume24h: 1250000,
        marketCap: 5000000,
        high24h: 0.000015,
        low24h: 0.000008
      };

      return {
        content: `Here's the current price information for ${token}:`,
        data: {
          type: 'price',
          price: priceData,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error handling price query:', error);
      return {
        content: 'I\'m having trouble fetching price data right now. Please try again in a moment.',
        data: { type: 'error' }
      };
    }
  }

  // Set user preferences
  setUserPreferences(preferences: UserPreferences): void {
    this.userPreferences = preferences;
    console.log('👤 User preferences updated:', preferences);
  }

  // Get user preferences
  getUserPreferences(): UserPreferences | null {
    return this.userPreferences;
  }

  // Get system status
  getSystemStatus(): any {
    return {
      status: 'client-side',
      message: 'Running in client-side mode - connect to backend API for full functionality'
    };
  }

  // Start real-time updates
  async startRealTimeUpdates(callback: (update: any) => void): Promise<void> {
    try {
      // This would implement WebSocket connection for real-time updates
      console.log('🔄 Starting real-time updates...');
      
      // Simulate real-time updates for now
      setInterval(() => {
        callback({
          type: 'market_update',
          data: {
            timestamp: new Date().toISOString(),
            message: 'Market data updated'
          }
        });
      }, 30000); // Update every 30 seconds
      
    } catch (error) {
      console.error('❌ Error starting real-time updates:', error);
    }
  }

  // Stop real-time updates
  stopRealTimeUpdates(): void {
    console.log('⏹️ Stopping real-time updates...');
    // Implementation would stop WebSocket connection
  }
}

// Export singleton instance
export const aiAgentService = new AIAgentService();
