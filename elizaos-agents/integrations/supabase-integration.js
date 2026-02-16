// Supabase Integration for Iris Trading Agent
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export class SupabaseIntegration {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  // Store agent analysis results
  async storeAnalysisResult(analysis) {
    try {
      const { data, error } = await this.supabase
        .from('agent_analysis')
        .insert({
          timestamp: new Date().toISOString(),
          analysis_type: analysis.type,
          data: analysis.data,
          confidence_score: analysis.confidence,
          recommendations: analysis.recommendations
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing analysis result:', error);
      throw error;
    }
  }

  // Get trending tokens from database
  async getTrendingTokens(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('tokens')
        .select('*')
        .order('market_cap', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  }

  // Get recent TikTok data
  async getRecentTikTokData(hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('tiktok_videos')
        .select('*')
        .gte('created_at', since)
        .order('view_count', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching TikTok data:', error);
      throw error;
    }
  }

  // Get price data for a specific token
  async getTokenPriceData(mintAddress, hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('prices')
        .select('*')
        .eq('token_mint_address', mintAddress)
        .gte('timestamp', since)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  }

  // Store trading recommendations
  async storeTradingRecommendation(recommendation) {
    try {
      const { data, error } = await this.supabase
        .from('trading_recommendations')
        .insert({
          token_address: recommendation.tokenAddress,
          action: recommendation.action,
          confidence: recommendation.confidence,
          reason: recommendation.reason,
          risk_level: recommendation.riskLevel,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing trading recommendation:', error);
      throw error;
    }
  }

  // Get user portfolio data
  async getUserPortfolio(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_portfolios')
        .select(`
          *,
          tokens:token_address(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user portfolio:', error);
      throw error;
    }
  }

  // Update token sentiment analysis
  async updateTokenSentiment(mintAddress, sentiment) {
    try {
      const { data, error } = await this.supabase
        .from('tokens')
        .update({
          sentiment_score: sentiment.score,
          sentiment_analysis: sentiment.analysis,
          last_sentiment_update: new Date().toISOString()
        })
        .eq('mint_address', mintAddress);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating token sentiment:', error);
      throw error;
    }
  }

  // Get agent performance metrics
  async getAgentPerformanceMetrics(days = 7) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('agent_analysis')
        .select('*')
        .gte('timestamp', since)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      // Calculate performance metrics
      const metrics = {
        totalAnalyses: data.length,
        averageConfidence: data.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / data.length,
        successfulPredictions: data.filter(item => item.confidence_score > 0.7).length,
        accuracy: 0 // This would be calculated based on actual vs predicted outcomes
      };

      return metrics;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      throw error;
    }
  }
}

export default SupabaseIntegration;
