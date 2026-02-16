// Real-time Service - Live data updates and notifications
export interface RealtimeUpdate {
  id: string;
  type: 'price' | 'trending' | 'analysis' | 'alert' | 'news' | 'social';
  data: any;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface PriceUpdate {
  token: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

export interface TrendingUpdate {
  token: string;
  tiktokMentions: number;
  socialSentiment: number;
  volumeSpike: boolean;
  priceSpike: boolean;
  confidence: number;
}

export interface AlertUpdate {
  type: 'price' | 'volume' | 'sentiment' | 'trend';
  token: string;
  message: string;
  value: number;
  threshold: number;
  action: 'buy' | 'sell' | 'hold' | 'watch';
}

export interface NewsUpdate {
  title: string;
  content: string;
  source: string;
  impact: 'low' | 'medium' | 'high';
  tokens: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface SocialUpdate {
  platform: 'tiktok' | 'twitter' | 'telegram' | 'discord';
  content: string;
  author: string;
  engagement: number;
  sentiment: number;
  tokens: string[];
}

export class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private subscribers: Map<string, (update: RealtimeUpdate) => void> = new Map();
  private priceCache: Map<string, PriceUpdate> = new Map();
  private trendingCache: Map<string, TrendingUpdate> = new Map();
  private alertCache: Map<string, AlertUpdate> = new Map();

  constructor() {
    this.initializeService();
  }

  // Initialize the real-time service
  private initializeService(): void {
    console.log('🔄 Initializing Real-time Service...');
    
    // Start WebSocket connection (or simulated connection)
    this.connect();
    
    // Set up periodic data updates
    this.setupPeriodicUpdates();
    
    // Set up notification permissions
    this.setupNotifications();
    
    console.log('✅ Real-time Service initialized successfully');
  }

  // Connect to WebSocket
  private connect(): void {
    // Only connect in browser environment
    if (typeof window === 'undefined') return;
    
    // Check if WebSocket server is available
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
    
    // For now, skip WebSocket connection and use simulated data
    console.log('⚠️ WebSocket server not available, using simulated real-time data');
    this.isConnected = false;
    this.setupSimulatedConnection();
    return;
    
    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.authenticate();
      };

      ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      ws.onclose = () => {
        console.log('❌ WebSocket disconnected');
        this.isConnected = false;
        this.scheduleReconnect();
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnected = false;
        this.setupSimulatedConnection();
      };
    } catch (error) {
      console.error('❌ Error connecting to WebSocket:', error);
      this.setupSimulatedConnection();
    }
  }

  // Authenticate with WebSocket server
  private authenticate(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const authMessage = {
      type: 'auth',
      token: this.getAuthToken(),
      userId: this.getUserId()
    };

    this.ws.send(JSON.stringify(authMessage));
  }

  // Handle incoming WebSocket messages
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'price_update':
          this.handlePriceUpdate(message.data);
          break;
        case 'trending_update':
          this.handleTrendingUpdate(message.data);
          break;
        case 'alert':
          this.handleAlert(message.data);
          break;
        case 'news':
          this.handleNewsUpdate(message.data);
          break;
        case 'social':
          this.handleSocialUpdate(message.data);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error handling WebSocket message:', error);
    }
  }

  // Handle price updates
  private handlePriceUpdate(data: PriceUpdate): void {
    this.priceCache.set(data.token, data);
    
    const update: RealtimeUpdate = {
      id: `price_${data.token}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'price',
      data: data,
      timestamp: new Date(),
      priority: this.calculatePricePriority(data)
    };

    this.notifySubscribers(update);
  }

  // Handle trending updates
  private handleTrendingUpdate(data: TrendingUpdate): void {
    this.trendingCache.set(data.token, data);
    
    const update: RealtimeUpdate = {
      id: `trending_${data.token}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'trending',
      data: data,
      timestamp: new Date(),
      priority: this.calculateTrendingPriority(data)
    };

    this.notifySubscribers(update);
  }

  // Handle alerts
  private handleAlert(data: AlertUpdate): void {
    this.alertCache.set(`${data.type}_${data.token}`, data);
    
    const update: RealtimeUpdate = {
      id: `alert_${data.type}_${data.token}_${Date.now()}`,
      type: 'alert',
      data: data,
      timestamp: new Date(),
      priority: 'high'
    };

    this.notifySubscribers(update);
    this.showNotification(data);
  }

  // Handle news updates
  private handleNewsUpdate(data: NewsUpdate): void {
    const update: RealtimeUpdate = {
      id: `news_${Date.now()}`,
      type: 'news',
      data: data,
      timestamp: new Date(),
      priority: data.impact === 'high' ? 'high' : 'medium'
    };

    this.notifySubscribers(update);
  }

  // Handle social updates
  private handleSocialUpdate(data: SocialUpdate): void {
    const update: RealtimeUpdate = {
      id: `social_${data.platform}_${Date.now()}`,
      type: 'social',
      data: data,
      timestamp: new Date(),
      priority: 'low'
    };

    this.notifySubscribers(update);
  }

  // Calculate price update priority
  private calculatePricePriority(data: PriceUpdate): 'low' | 'medium' | 'high' | 'urgent' {
    const change = Math.abs(data.change24h);
    
    if (change > 50) return 'urgent';
    if (change > 25) return 'high';
    if (change > 10) return 'medium';
    return 'low';
  }

  // Calculate trending update priority
  private calculateTrendingPriority(data: TrendingUpdate): 'low' | 'medium' | 'high' | 'urgent' {
    if (data.volumeSpike && data.priceSpike) return 'urgent';
    if (data.volumeSpike || data.priceSpike) return 'high';
    if (data.confidence > 0.8) return 'medium';
    return 'low';
  }

  // Notify all subscribers
  private notifySubscribers(update: RealtimeUpdate): void {
    this.subscribers.forEach((callback, id) => {
      try {
        callback(update);
      } catch (error) {
        console.error(`❌ Error notifying subscriber ${id}:`, error);
      }
    });
  }

  // Show browser notification
  private showNotification(alert: AlertUpdate): void {
    if (Notification.permission === 'granted') {
      new Notification(`Alert: ${alert.token}`, {
        body: alert.message,
        icon: '/wojat.png',
        tag: `alert_${alert.token}`
      });
    }
  }

  // Subscribe to real-time updates
  subscribe(id: string, callback: (update: RealtimeUpdate) => void): void {
    this.subscribers.set(id, callback);
    console.log(`📡 Subscribed to real-time updates: ${id}`);
  }

  // Unsubscribe from real-time updates
  unsubscribe(id: string): void {
    this.subscribers.delete(id);
    console.log(`📡 Unsubscribed from real-time updates: ${id}`);
  }

  // Get cached price data
  getPriceData(token: string): PriceUpdate | null {
    return this.priceCache.get(token) || null;
  }

  // Get cached trending data
  getTrendingData(token: string): TrendingUpdate | null {
    return this.trendingCache.get(token) || null;
  }

  // Get cached alert data
  getAlertData(type: string, token: string): AlertUpdate | null {
    return this.alertCache.get(`${type}_${token}`) || null;
  }

  // Set up periodic updates (fallback if WebSocket fails)
  private setupPeriodicUpdates(): void {
    // Update every 30 seconds
    setInterval(() => {
      if (!this.isConnected) {
        this.simulateUpdates();
      }
    }, 30000);
  }

  // Set up simulated connection for demo purposes
  private setupSimulatedConnection(): void {
    console.log('🎭 Setting up simulated real-time connection...');
    
    // Start simulated updates immediately
    this.simulateUpdates();
    
    // Set up periodic simulated updates
    setInterval(() => {
      this.simulateUpdates();
    }, 15000); // Every 15 seconds
    
    // Simulate some alerts occasionally
    setInterval(() => {
      this.simulateAlert();
    }, 45000); // Every 45 seconds
  }

  // Simulate updates when WebSocket is not available
  private simulateUpdates(): void {
    const tokens = ['BONK', 'WIF', 'PEPE', 'SOL'];
    
    tokens.forEach(token => {
      // Simulate price updates
      const priceUpdate: PriceUpdate = {
        token: token,
        price: Math.random() * 0.0001 + 0.00001,
        change24h: (Math.random() - 0.5) * 40,
        volume24h: Math.random() * 2000000,
        marketCap: Math.random() * 10000000,
        high24h: Math.random() * 0.0002,
        low24h: Math.random() * 0.00005
      };

      this.handlePriceUpdate(priceUpdate);
      
      // Simulate trending updates occasionally
      if (Math.random() > 0.7) {
        const trendingUpdate: TrendingUpdate = {
          token: token,
          tiktokMentions: Math.floor(Math.random() * 1000),
          socialSentiment: Math.random() * 2 - 1, // -1 to 1
          volumeSpike: Math.random() > 0.8,
          priceSpike: Math.random() > 0.8,
          confidence: Math.random()
        };
        
        this.handleTrendingUpdate(trendingUpdate);
      }
    });
  }

  // Simulate an alert
  private simulateAlert(): void {
    const tokens = ['BONK', 'WIF', 'PEPE', 'SOL'];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    const priceChange = (Math.random() - 0.5) * 30;
    
    const alert: AlertUpdate = {
      type: 'price',
      token: token,
      message: `${token} price ${priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceChange).toFixed(1)}%`,
      value: Math.abs(priceChange),
      threshold: 20,
      action: priceChange > 0 ? 'buy' : 'sell'
    };
    
    this.handleAlert(alert);
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Set up browser notifications
  private setupNotifications(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
        } else {
          console.log('❌ Notification permission denied');
        }
      });
    }
  }

  // Get authentication token
  private getAuthToken(): string {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('authToken') || '';
  }

  // Get user ID
  private getUserId(): string {
    // Only access localStorage in browser environment
    if (typeof window === 'undefined') return 'anonymous';
    return localStorage.getItem('userId') || 'anonymous';
  }

  // Send message to WebSocket
  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
    }
  }

  // Get connection status
  isWebSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  // Disconnect
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
    console.log('📡 Real-time service disconnected');
  }

  // Get service status
  getStatus(): any {
    return {
      connected: this.isConnected,
      subscribers: this.subscribers.size,
      priceCache: this.priceCache.size,
      trendingCache: this.trendingCache.size,
      alertCache: this.alertCache.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
