// Supabase Integration for Iris Trading Agent (aligned with frontend/dashboard)
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseKey = process.env.SUPABASE_ANON_SECRET || process.env.SUPABASE_ANON_KEY;

export class SupabaseIntegration {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      supabaseKey
    );
  }

  // Store agent analysis results (optional table - no-op if missing)
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
      console.warn('Could not store analysis result (table may not exist):', error?.message || error);
      return null;
    }
  }

  // Get trending tokens from database (aligned with tokens table: market_cap, created_at)
  async getTrendingTokens(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('tokens')
        .select('id, symbol, name, address, uri, market_cap, created_at')
        .not('address', 'is', null)
        .order('market_cap', { ascending: false, nullsFirst: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      return [];
    }
  }

  // Get recent TikTok data (table: tiktoks, newest first - aligned with frontend)
  async getRecentTikTokData(hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const { data, error } = await this.supabase
        .from('tiktoks')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .order('fetched_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching TikTok data:', error);
      return [];
    }
  }

  // Get price data for a token (by token_uri or token_id - aligned with frontend prices schema)
  async getTokenPriceData(tokenUriOrId, hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const isId = typeof tokenUriOrId === 'number' || /^\d+$/.test(String(tokenUriOrId));
      const query = this.supabase
        .from('prices')
        .select('*')
        .gte('trade_at', since)
        .order('trade_at', { ascending: true });
      if (isId) query.eq('token_id', parseInt(tokenUriOrId, 10));
      else query.eq('token_uri', tokenUriOrId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching price data:', error);
      return [];
    }
  }

  // Store trading recommendations (optional table - no-op if missing)
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
      console.warn('Could not store trading recommendation (table may not exist):', error?.message || error);
      return null;
    }
  }

  // Get user portfolio data (optional table)
  async getUserPortfolio(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_portfolios')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Could not fetch user portfolio:', error?.message || error);
      return [];
    }
  }

  // Update token sentiment (optional - columns may not exist)
  async updateTokenSentiment(addressOrUri, sentiment) {
    try {
      const col = typeof addressOrUri === 'string' && addressOrUri.startsWith('http') ? 'uri' : 'address';
      const { data, error } = await this.supabase
        .from('tokens')
        .update({
          sentiment_score: sentiment.score,
          sentiment_analysis: sentiment.analysis,
          last_sentiment_update: new Date().toISOString()
        })
        .eq(col, addressOrUri);
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Could not update token sentiment:', error?.message || error);
      return null;
    }
  }

  // Get agent performance metrics (optional table)
  async getAgentPerformanceMetrics(days = 7) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await this.supabase
        .from('agent_analysis')
        .select('*')
        .gte('timestamp', since)
        .order('timestamp', { ascending: false });
      if (error) throw error;
      const list = data || [];
      return {
        totalAnalyses: list.length,
        averageConfidence: list.length ? list.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / list.length : 0,
        successfulPredictions: list.filter(item => item.confidence_score > 0.7).length,
        accuracy: 0
      };
    } catch (error) {
      console.warn('Could not fetch agent performance:', error?.message || error);
      return { totalAnalyses: 0, averageConfidence: 0, successfulPredictions: 0, accuracy: 0 };
    }
  }
}

export default SupabaseIntegration;
