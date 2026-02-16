// Personalization Service - User preferences and recommendation engine
export interface UserProfile {
  id: string;
  preferences: UserPreferences;
  tradingHistory: TradingRecord[];
  interests: string[];
  riskProfile: RiskProfile;
  learningProgress: LearningProgress;
  createdAt: Date;
  updatedAt: Date;
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
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  tradingExperience: 'beginner' | 'intermediate' | 'advanced';
  preferredAnalysisDepth: 'basic' | 'detailed' | 'expert';
  language: string;
  timezone: string;
}

export interface TradingRecord {
  id: string;
  token: string;
  action: 'buy' | 'sell' | 'hold';
  amount: number;
  price: number;
  timestamp: Date;
  profitLoss?: number;
  recommendationSource: 'ai' | 'manual' | 'social';
}

export interface RiskProfile {
  score: number; // 0-100
  maxPositionSize: number; // percentage of portfolio
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxDailyLoss: number;
  diversificationTarget: number;
}

export interface LearningProgress {
  completedTopics: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  totalSessions: number;
  averageSessionTime: number;
  favoriteContentTypes: string[];
  improvementAreas: string[];
}

export interface PersonalizedRecommendation {
  id: string;
  type: 'trending' | 'analysis' | 'education' | 'alert';
  priority: 'low' | 'medium' | 'high';
  title: string;
  content: string;
  data?: any;
  reason: string;
  confidence: number;
  expiresAt: Date;
  createdAt: Date;
}

export class PersonalizationService {
  private userProfile: UserProfile | null = null;
  private recommendations: PersonalizedRecommendation[] = [];
  private learningData: Map<string, number> = new Map();

  constructor() {
    this.loadUserProfile();
  }

  // Initialize user profile
  async initializeUser(userId: string): Promise<UserProfile> {
    try {
      // Load existing profile or create new one
      const existingProfile = await this.loadUserProfileFromStorage(userId);
      
      if (existingProfile) {
        this.userProfile = existingProfile;
      } else {
        this.userProfile = await this.createDefaultProfile(userId);
      }

      // Generate initial recommendations
      await this.generateRecommendations();
      
      return this.userProfile;
    } catch (error) {
      console.error('❌ Error initializing user profile:', error);
      throw error;
    }
  }

  // Create default user profile
  private async createDefaultProfile(userId: string): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      id: userId,
      preferences: {
        riskTolerance: 'medium',
        investmentGoals: ['learn', 'profit'],
        favoriteTokens: [],
        notificationSettings: {
          trendingAlerts: true,
          priceAlerts: true,
          analysisUpdates: true,
          voiceEnabled: true,
          emailNotifications: false,
          pushNotifications: true
        },
        tradingExperience: 'beginner',
        preferredAnalysisDepth: 'basic',
        language: 'en',
        timezone: 'UTC'
      },
      tradingHistory: [],
      interests: ['memecoins', 'trading', 'education'],
      riskProfile: {
        score: 50,
        maxPositionSize: 10,
        stopLossPercentage: 15,
        takeProfitPercentage: 50,
        maxDailyLoss: 5,
        diversificationTarget: 80
      },
      learningProgress: {
        completedTopics: [],
        currentLevel: 'beginner',
        totalSessions: 0,
        averageSessionTime: 0,
        favoriteContentTypes: ['trending', 'education'],
        improvementAreas: ['risk-management', 'technical-analysis']
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.saveUserProfileToStorage(defaultProfile);
    return defaultProfile;
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.userProfile) return;

    this.userProfile.preferences = {
      ...this.userProfile.preferences,
      ...preferences
    };
    this.userProfile.updatedAt = new Date();

    await this.saveUserProfileToStorage(this.userProfile);
    await this.generateRecommendations();
  }

  // Record trading activity
  async recordTradingActivity(record: Omit<TradingRecord, 'id' | 'timestamp'>): Promise<void> {
    if (!this.userProfile) return;

    const tradingRecord: TradingRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    this.userProfile.tradingHistory.push(tradingRecord);
    this.userProfile.updatedAt = new Date();

    // Update risk profile based on trading activity
    await this.updateRiskProfile();
    await this.saveUserProfileToStorage(this.userProfile);
  }

  // Update risk profile based on trading behavior
  private async updateRiskProfile(): Promise<void> {
    if (!this.userProfile) return;

    const recentTrades = this.userProfile.tradingHistory.slice(-10);
    const totalTrades = recentTrades.length;
    
    if (totalTrades === 0) return;

    // Calculate risk score based on trading behavior
    const avgPositionSize = recentTrades.reduce((sum, trade) => sum + trade.amount, 0) / totalTrades;
    const winRate = recentTrades.filter(trade => (trade.profitLoss || 0) > 0).length / totalTrades;
    const avgHoldTime = this.calculateAverageHoldTime(recentTrades);

    // Adjust risk profile based on behavior
    let riskScore = this.userProfile.riskProfile.score;
    
    if (avgPositionSize > 20) riskScore += 10; // Higher position sizes = higher risk
    if (winRate > 0.7) riskScore += 5; // Good win rate = can handle more risk
    if (avgHoldTime < 24) riskScore += 15; // Short holds = higher risk

    // Clamp risk score between 0 and 100
    riskScore = Math.max(0, Math.min(100, riskScore));

    this.userProfile.riskProfile = {
      ...this.userProfile.riskProfile,
      score: riskScore,
      maxPositionSize: Math.min(20, riskScore / 5), // Max 20% position size
      stopLossPercentage: Math.max(5, 20 - riskScore / 5), // More risk = tighter stops
      takeProfitPercentage: Math.min(100, 30 + riskScore / 2) // More risk = higher targets
    };
  }

  // Calculate average hold time in hours
  private calculateAverageHoldTime(trades: TradingRecord[]): number {
    const buyTrades = trades.filter(trade => trade.action === 'buy');
    const sellTrades = trades.filter(trade => trade.action === 'sell');
    
    if (buyTrades.length === 0 || sellTrades.length === 0) return 48; // Default 48 hours
    
    // Simple calculation - in real implementation, you'd match buy/sell pairs
    return 24; // Placeholder
  }

  // Generate personalized recommendations
  async generateRecommendations(): Promise<PersonalizedRecommendation[]> {
    if (!this.userProfile) return [];

    const recommendations: PersonalizedRecommendation[] = [];

    // Generate recommendations based on user profile
    if (this.userProfile.preferences.notificationSettings.trendingAlerts) {
      recommendations.push(...await this.generateTrendingRecommendations());
    }

    if (this.userProfile.preferences.notificationSettings.analysisUpdates) {
      recommendations.push(...await this.generateAnalysisRecommendations());
    }

    if (this.userProfile.learningProgress.currentLevel === 'beginner') {
      recommendations.push(...await this.generateEducationalRecommendations());
    }

    // Filter and prioritize recommendations
    this.recommendations = this.prioritizeRecommendations(recommendations);
    
    return this.recommendations;
  }

  // Generate trending recommendations
  private async generateTrendingRecommendations(): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];

    // Check if user is interested in specific tokens
    if (this.userProfile?.preferences.favoriteTokens.includes('BONK')) {
      recommendations.push({
        id: `trending-${Date.now()}`,
        type: 'trending',
        priority: 'high',
        title: 'BONK Trending Alert',
        content: 'BONK is showing strong momentum with high TikTok engagement!',
        reason: 'You follow BONK and it\'s trending',
        confidence: 0.85,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });
    }

    return recommendations;
  }

  // Generate analysis recommendations
  private async generateAnalysisRecommendations(): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];

    // Generate analysis based on user's risk tolerance
    const riskLevel = this.userProfile?.preferences.riskTolerance || 'medium';
    
    recommendations.push({
      id: `analysis-${Date.now()}`,
      type: 'analysis',
      priority: 'medium',
      title: 'Personalized Market Analysis',
      content: `Based on your ${riskLevel} risk tolerance, here's what I recommend...`,
      reason: 'Regular analysis update based on your preferences',
      confidence: 0.75,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      createdAt: new Date()
    });

    return recommendations;
  }

  // Generate educational recommendations
  private async generateEducationalRecommendations(): Promise<PersonalizedRecommendation[]> {
    const recommendations: PersonalizedRecommendation[] = [];

    const improvementAreas = this.userProfile?.learningProgress.improvementAreas || [];
    
    for (const area of improvementAreas) {
      recommendations.push({
        id: `education-${area}-${Date.now()}`,
        type: 'education',
        priority: 'low',
        title: `Learn about ${area.replace('-', ' ')}`,
        content: `I noticed you want to improve your ${area} skills. Here's a helpful guide...`,
        reason: 'Based on your learning goals',
        confidence: 0.9,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });
    }

    return recommendations;
  }

  // Prioritize recommendations based on user profile
  private prioritizeRecommendations(recommendations: PersonalizedRecommendation[]): PersonalizedRecommendation[] {
    return recommendations.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by confidence
      return b.confidence - a.confidence;
    });
  }

  // Get personalized content based on user profile
  getPersonalizedContent(type: string, data: any): any {
    if (!this.userProfile) return data;

    // Customize content based on user preferences
    switch (type) {
      case 'trending':
        return this.personalizeTrendingContent(data);
      case 'analysis':
        return this.personalizeAnalysisContent(data);
      case 'recommendation':
        return this.personalizeRecommendationContent(data);
      default:
        return data;
    }
  }

  // Personalize trending content
  private personalizeTrendingContent(data: any): any {
    const riskTolerance = this.userProfile?.preferences.riskTolerance || 'medium';
    const favoriteTokens = this.userProfile?.preferences.favoriteTokens || [];

    // Filter and sort tokens based on user preferences
    if (data.tokens) {
      data.tokens = data.tokens.map((token: any) => ({
        ...token,
        isFavorite: favoriteTokens.includes(token.symbol),
        riskLevel: this.calculateTokenRiskLevel(token, riskTolerance)
      })).sort((a: any, b: any) => {
        // Prioritize favorite tokens
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return b.confidence - a.confidence;
      });
    }

    return data;
  }

  // Calculate token risk level based on user's risk tolerance
  private calculateTokenRiskLevel(token: any, riskTolerance: string): string {
    const volatility = Math.abs(token.change24h || 0);
    
    if (riskTolerance === 'low') {
      return volatility < 10 ? 'low' : volatility < 20 ? 'medium' : 'high';
    } else if (riskTolerance === 'medium') {
      return volatility < 15 ? 'low' : volatility < 30 ? 'medium' : 'high';
    } else {
      return volatility < 25 ? 'low' : volatility < 50 ? 'medium' : 'high';
    }
  }

  // Personalize analysis content
  private personalizeAnalysisContent(data: any): any {
    const experience = this.userProfile?.preferences.tradingExperience || 'beginner';
    const analysisDepth = this.userProfile?.preferences.preferredAnalysisDepth || 'basic';

    // Adjust analysis depth based on user experience
    if (experience === 'beginner' || analysisDepth === 'basic') {
      data.summary = this.simplifyAnalysis(data.summary);
      data.keyFactors = data.keyFactors?.slice(0, 3); // Limit to 3 key factors
    }

    return data;
  }

  // Simplify analysis for beginners
  private simplifyAnalysis(summary: string): string {
    // Replace technical terms with simpler language
    return summary
      .replace(/bullish momentum/g, 'positive trend')
      .replace(/bearish sentiment/g, 'negative sentiment')
      .replace(/technical indicators/g, 'chart patterns')
      .replace(/liquidity/g, 'trading volume');
  }

  // Personalize recommendation content
  private personalizeRecommendationContent(data: any): any {
    const riskProfile = this.userProfile?.riskProfile;
    
    if (data.recommendations) {
      data.recommendations = data.recommendations.map((rec: any) => ({
        ...rec,
        personalizedRisk: this.calculatePersonalizedRisk(rec, riskProfile),
        positionSize: this.calculatePositionSize(rec, riskProfile)
      }));
    }

    return data;
  }

  // Calculate personalized risk for recommendation
  private calculatePersonalizedRisk(rec: any, riskProfile: any): string {
    if (!riskProfile) return 'medium';
    
    const baseRisk = rec.riskLevel || 'medium';
    const userRiskScore = riskProfile.score;
    
    if (userRiskScore < 30) return 'low';
    if (userRiskScore > 70) return 'high';
    return baseRisk;
  }

  // Calculate position size based on risk profile
  private calculatePositionSize(rec: any, riskProfile: any): number {
    if (!riskProfile) return 5; // Default 5%
    
    const baseSize = riskProfile.maxPositionSize;
    const confidence = rec.confidence || 0.5;
    
    // Adjust position size based on confidence
    return Math.round(baseSize * confidence);
  }

  // Load user profile from storage
  private async loadUserProfileFromStorage(userId: string): Promise<UserProfile | null> {
    try {
      const stored = localStorage.getItem(`userProfile_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Save user profile to storage
  private async saveUserProfileToStorage(profile: UserProfile): Promise<void> {
    try {
      localStorage.setItem(`userProfile_${profile.id}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Load user profile (fallback)
  private loadUserProfile(): void {
    // This would load from localStorage or API
    console.log('👤 Loading user profile...');
  }

  // Get current user profile
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  // Get recommendations
  getRecommendations(): PersonalizedRecommendation[] {
    return this.recommendations;
  }

  // Mark recommendation as read
  markRecommendationAsRead(id: string): void {
    this.recommendations = this.recommendations.filter(rec => rec.id !== id);
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
