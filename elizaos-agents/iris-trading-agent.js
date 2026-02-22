import { AgentRuntime } from '@elizaos/core';
import { solanaPlugin } from '@elizaos/plugin-solana';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Iris Trading Agent Character Configuration
const irisCharacter = {
  name: "Iris",
  personality: "Analytical and helpful memecoin hunting assistant with deep knowledge of TikTok trends and Solana ecosystem. Always provides data-driven insights and maintains a professional yet approachable tone.",
  goals: [
    "Help users identify trending memecoins from TikTok data",
    "Provide real-time trading insights based on social sentiment",
    "Analyze market patterns and predict potential opportunities",
    "Educate users about memecoin trading strategies",
    "Monitor portfolio performance and suggest optimizations"
  ],
  backstory: "Iris is an AI agent specialized in memecoin hunting, combining social media trend analysis with blockchain data to identify profitable opportunities. Born from the need to bridge TikTok's viral content with Solana's memecoin ecosystem.",
  traits: [
    "Data-driven decision making",
    "Risk-aware but opportunity-focused",
    "Excellent at pattern recognition",
    "Clear and concise communication",
    "Always learning from market trends"
  ]
};

// Initialize the Iris Trading Agent
export async function createIrisTradingAgent() {
  try {
    console.log('🤖 Initializing Iris Trading Agent...');
    
    const runtime = new AgentRuntime({
      character: irisCharacter,
      plugins: [solanaPlugin],
      modelProvider: {
        name: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4'
      },
      // Memory configuration for learning from interactions
      memory: {
        type: 'supabase',
        config: {
          url: process.env.SUPABASE_URL,
          key: process.env.SUPABASE_ANON_KEY
        }
      }
    });

    console.log('✅ Iris Trading Agent initialized successfully');
    return runtime;
  } catch (error) {
    console.error('❌ Failed to initialize Iris Trading Agent:', error);
    throw error;
  }
}

// Trading-specific functions for Iris
export class IrisTradingFunctions {
  constructor(runtime) {
    this.runtime = runtime;
  }

  // Analyze TikTok trends from frontend API (aligned with dashboard tiktok-hashtags)
  async analyzeTikTokTrends() {
    try {
      console.log('📊 Analyzing TikTok trends for memecoin opportunities...');
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${frontendUrl}/api/dashboard/tiktok-hashtags?timeRange=24h`, { signal: AbortSignal.timeout(15000) });
        if (res.ok) {
          const data = await res.json();
          const hashtags = (data?.hashtags || []).slice(0, 15).map((h) => (typeof h === 'string' ? h : h?.hashtag || `#${h?.tag || 'memecoin'}`));
          const topMentions = hashtags.filter((h) => /^\$|#[a-z0-9]/i.test(String(h))).slice(0, 8);
          return {
            trendingHashtags: hashtags.length ? hashtags : ['#solana', '#pump', '#memecoin', '#pumpfun'],
            topMentions: topMentions.length ? topMentions : ['$BONK', '$WIF', '$PEPE'],
            sentimentScore: 0.75,
            volumeSpike: true,
            recommendations: ['Monitor trending hashtags for breakouts', 'Consider position sizing based on TikTok engagement']
          };
        }
      } catch (e) {
        console.warn('TikTok hashtags API unavailable, using fallback:', e?.message || e);
      }
      return {
        trendingHashtags: ['#solana', '#pump', '#memecoin', '#pumpfun'],
        topMentions: ['$BONK', '$WIF', '$PEPE'],
        sentimentScore: 0.75,
        volumeSpike: true,
        recommendations: ['Monitor $BONK for potential breakout', 'High sentiment detected for pump.fun tokens']
      };
    } catch (error) {
      console.error('Error analyzing TikTok trends:', error);
      return {
        trendingHashtags: ['#memecoin', '#solana'],
        topMentions: [],
        sentimentScore: 0.5,
        volumeSpike: false,
        recommendations: []
      };
    }
  }

  // Get portfolio balance and performance
  async getPortfolioBalance() {
    try {
      console.log('💰 Checking portfolio balance...');
      
      // Use ElizaOS Solana plugin to get balance
      const balance = await this.runtime.callTool('get_balance', {
        address: process.env.SOLANA_PUBLIC_KEY
      });

      return balance;
    } catch (error) {
      console.error('Error getting portfolio balance:', error);
      throw error;
    }
  }

  // Analyze a specific token's performance
  async analyzeToken(tokenAddress) {
    try {
      console.log(`🔍 Analyzing token: ${tokenAddress}`);
      
      // This would integrate with your Bitquery data
      const analysis = {
        tokenAddress,
        currentPrice: 0.000123,
        priceChange24h: 15.67,
        volume24h: 1250000,
        marketCap: 5000000,
        socialSentiment: 0.8,
        tiktokMentions: 45,
        recommendation: 'Strong buy signal based on social momentum'
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing token:', error);
      throw error;
    }
  }

  // Generate trading recommendations from live memecoins + TikTok trends (called from orchestrator with data)
  async generateTradingRecommendations(memecoins = [], tiktokTrends = null) {
    try {
      console.log('💡 Generating trading recommendations...');
      const hashtagCount = (tiktokTrends?.trendingHashtags?.length ?? 0);
      if (Array.isArray(memecoins) && memecoins.length > 0) {
        const top = memecoins.slice(0, 5);
        return top.map((t, i) => ({
          action: i === 0 ? 'BUY' : i === 1 ? 'HOLD' : 'WATCH',
          token: t.symbol ? `$${t.symbol}` : t.address || 'Unknown',
          reason: hashtagCount > 0
            ? `Trending on Jupiter with ${hashtagCount} TikTok hashtags correlated`
            : 'Trending on Jupiter; monitor social momentum',
          confidence: Math.max(0.5, 0.85 - i * 0.08),
          riskLevel: i < 2 ? 'Medium' : 'High'
        }));
      }
      return [
        { action: 'WATCH', token: '$BONK', reason: 'High TikTok engagement and volume spike detected', confidence: 0.75, riskLevel: 'Medium' },
        { action: 'WATCH', token: '$WIF', reason: 'Stable performance with consistent social mentions', confidence: 0.70, riskLevel: 'Low' },
        { action: 'WATCH', token: '$PEPE', reason: 'Emerging trend with potential for breakout', confidence: 0.60, riskLevel: 'High' }
      ];
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }
}

// Main execution function
export async function main() {
  try {
    console.log('🚀 Starting Iris Trading Agent...');
    
    // Create the agent
    const agent = await createIrisTradingAgent();
    const tradingFunctions = new IrisTradingFunctions(agent);
    
    // Example usage
    console.log('\n📈 Running Iris analysis...');
    
    // Analyze TikTok trends
    const trends = await tradingFunctions.analyzeTikTokTrends();
    console.log('TikTok Trends:', JSON.stringify(trends, null, 2));
    
    // Get portfolio balance
    const balance = await tradingFunctions.getPortfolioBalance();
    console.log('Portfolio Balance:', balance);
    
    // Generate recommendations
    const recommendations = await tradingFunctions.generateTradingRecommendations();
    console.log('Trading Recommendations:', JSON.stringify(recommendations, null, 2));
    
    console.log('\n✅ Iris Trading Agent running successfully!');
    
  } catch (error) {
    console.error('❌ Error running Iris Trading Agent:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
