// Twitter Integration for Iris ElizaOS Trading Agent
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

export class TwitterIntegration {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    
    // Initialize Twitter client if credentials are available
    if (this.hasValidCredentials()) {
      this.initializeClient();
    }
  }

  // Check if Twitter credentials are properly configured (supports CONSUMER_* / ZORO_* or TWITTER_*)
  hasValidCredentials() {
    const appKey = process.env.CONSUMER_KEY || process.env.TWITTER_API_KEY;
    const appSecret = process.env.CONSUMER_SECRET || process.env.TWITTER_API_SECRET;
    const accessToken = process.env.ZORO_ACCESS_TOKEN || process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.ZORO_ACCESS_TOKEN_SECRET || process.env.TWITTER_ACCESS_TOKEN_SECRET;
    return !!(appKey && appSecret && accessToken && accessSecret) &&
      [appKey, appSecret, accessToken, accessSecret].every((v) => !String(v).includes('your_twitter') && !String(v).includes('your_'));
  }

  // Initialize Twitter API client (same env as frontend: TWITTER_* or CONSUMER_* / ZORO_*)
  initializeClient() {
    try {
      const appKey = process.env.CONSUMER_KEY || process.env.TWITTER_API_KEY;
      const appSecret = process.env.CONSUMER_SECRET || process.env.TWITTER_API_SECRET;
      const accessToken = process.env.ZORO_ACCESS_TOKEN || process.env.TWITTER_ACCESS_TOKEN;
      const accessSecret = process.env.ZORO_ACCESS_TOKEN_SECRET || process.env.TWITTER_ACCESS_TOKEN_SECRET;
      this.client = new TwitterApi({
        appKey,
        appSecret,
        accessToken,
        accessSecret,
      });
      
      this.isConfigured = true;
      console.log('✅ Twitter integration configured successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twitter client:', error);
      this.isConfigured = false;
    }
  }

  // Post a tweet about trending memecoins
  async postTrendingAlert(trendingData) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, skipping tweet');
      return null;
    }

    try {
      const tweet = this.generateTrendingTweet(trendingData);
      const response = await this.client.v2.tweet(tweet);
      
      console.log('🐦 Tweet posted:', response.data.text);
      return response.data;
    } catch (error) {
      console.error('❌ Error posting tweet:', error);
      throw error;
    }
  }

  // Post a trading recommendation
  async postTradingRecommendation(recommendation) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, skipping recommendation tweet');
      return null;
    }

    try {
      const tweet = this.generateRecommendationTweet(recommendation);
      const response = await this.client.v2.tweet(tweet);
      
      console.log('🐦 Trading recommendation posted:', response.data.text);
      return response.data;
    } catch (error) {
      console.error('❌ Error posting trading recommendation:', error);
      throw error;
    }
  }

  // Post a volume spike alert
  async postVolumeAlert(tokenData) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, skipping volume alert');
      return null;
    }

    try {
      const tweet = this.generateVolumeAlertTweet(tokenData);
      const response = await this.client.v2.tweet(tweet);
      
      console.log('🐦 Volume alert posted:', response.data.text);
      return response.data;
    } catch (error) {
      console.error('❌ Error posting volume alert:', error);
      throw error;
    }
  }

  // Generate trending memecoin tweet (supports Jupiter-style memecoins: { symbol, name, address } or full price/volume)
  generateTrendingTweet(trendingData) {
    const { memecoins = [], tiktokTrends = { trendingHashtags: [] } } = trendingData;
    const topToken = memecoins[0];
    const hashtags = (tiktokTrends.trendingHashtags || []).slice(0, 3).join(' ') || '#Memecoin';

    let tweet = `🔥 TRENDING ALERT! 🔥\n\n`;
    tweet += `📈 Top: ${topToken?.symbol || 'N/A'}\n`;
    if (topToken?.price != null) tweet += `💰 Price: $${Number(topToken.price).toFixed(6)}\n`;
    if (topToken?.volume_24h != null) tweet += `📊 Vol: $${(Number(topToken.volume_24h) / 1000).toFixed(0)}K\n`;
    tweet += `🎬 ${hashtags}\n\n`;
    tweet += `#Solana #Memecoin #Pump #TikTok #Crypto`;
    return tweet;
  }

  // Post a custom tweet (for pipeline summaries, shares, etc.)
  async postCustomTweet(text) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, skipping tweet');
      return null;
    }
    try {
      const safe = String(text).slice(0, 280);
      const response = await this.client.v2.tweet(safe);
      console.log('🐦 Custom tweet posted');
      return response.data;
    } catch (error) {
      console.error('❌ Error posting custom tweet:', error);
      throw error;
    }
  }

  // Generate trading recommendation tweet
  generateRecommendationTweet(recommendation) {
    const { action, token, reason, confidence, riskLevel } = recommendation;
    
    let tweet = `💡 TRADING RECOMMENDATION 💡\n\n`;
    tweet += `🎯 Action: ${action} ${token}\n`;
    tweet += `📝 Reason: ${reason}\n`;
    tweet += `🎲 Confidence: ${(confidence * 100).toFixed(0)}%\n`;
    tweet += `⚠️ Risk: ${riskLevel}\n\n`;
    tweet += `#Trading #Memecoin #Solana #Crypto`;
    
    return tweet;
  }

  // Generate volume spike alert tweet
  generateVolumeAlertTweet(tokenData) {
    const { symbol, price, volume24h, priceChange24h } = tokenData;
    
    let tweet = `🚨 VOLUME SPIKE ALERT! 🚨\n\n`;
    tweet += `📈 Token: ${symbol}\n`;
    tweet += `💰 Price: $${price?.toFixed(6) || 'N/A'}\n`;
    tweet += `📊 24h Volume: $${(volume24h / 1000).toFixed(0)}K\n`;
    tweet += `📈 Change: ${priceChange24h > 0 ? '+' : ''}${priceChange24h?.toFixed(2) || 'N/A'}%\n\n`;
    tweet += `#VolumeAlert #Memecoin #Solana #Pump`;
    
    return tweet;
  }

  // Post a general market update
  async postMarketUpdate(updateData) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, skipping market update');
      return null;
    }

    try {
      const tweet = this.generateMarketUpdateTweet(updateData);
      const response = await this.client.v2.tweet(tweet);
      
      console.log('🐦 Market update posted:', response.data.text);
      return response.data;
    } catch (error) {
      console.error('❌ Error posting market update:', error);
      throw error;
    }
  }

  // Generate market update tweet
  generateMarketUpdateTweet(updateData) {
    const { totalTokens, totalVolume, topPerformer } = updateData;
    
    let tweet = `📊 MARKET UPDATE 📊\n\n`;
    tweet += `🔢 Tokens Tracked: ${totalTokens}\n`;
    tweet += `💰 Total Volume: $${(totalVolume / 1000000).toFixed(1)}M\n`;
    tweet += `🏆 Top Performer: ${topPerformer?.symbol || 'N/A'}\n\n`;
    tweet += `#MarketUpdate #Memecoin #Solana #Crypto`;
    
    return tweet;
  }

  // Get recent tweets from the account
  async getRecentTweets(count = 10) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, cannot fetch tweets');
      return [];
    }

    try {
      const tweets = await this.client.v2.userTimeline(process.env.ZORO_ACCESS_TOKEN, {
        max_results: count,
        'tweet.fields': ['created_at', 'public_metrics']
      });
      
      return tweets.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching recent tweets:', error);
      return [];
    }
  }

  // Post a scheduled tweet (for future implementation)
  async scheduleTweet(tweetText, scheduledTime) {
    if (!this.isConfigured) {
      console.log('⚠️ Twitter not configured, cannot schedule tweet');
      return null;
    }

    // Note: This would require Twitter API v2 with scheduling permissions
    // For now, we'll just post immediately
    try {
      const response = await this.client.v2.tweet(tweetText);
      console.log('🐦 Tweet posted (scheduled for immediate):', response.data.text);
      return response.data;
    } catch (error) {
      console.error('❌ Error posting scheduled tweet:', error);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo() {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const user = await this.client.v2.me();
      return user.data;
    } catch (error) {
      if (error.code === 429) {
        console.error('❌ Twitter API rate limit exceeded. Please wait before making more requests.');
        console.error(`Rate limit resets at: ${new Date(error.rateLimit?.reset * 1000).toLocaleString()}`);
      } else {
        console.error('❌ Error fetching account info:', error);
      }
      return null;
    }
  }

  // Check if Twitter integration is working (without API call to avoid rate limits)
  async testConnection() {
    if (!this.isConfigured) {
      return { success: false, message: 'Twitter not configured' };
    }

    // Just check if credentials are configured, don't make API call during initialization
    // This avoids hitting rate limits during startup
    if (this.hasValidCredentials()) {
      return { 
        success: true, 
        message: 'Twitter credentials configured (connection not tested to avoid rate limits)',
        account: null
      };
    } else {
      return { success: false, message: 'Twitter credentials not properly configured' };
    }
  }

  // Test actual API connection (use this sparingly due to rate limits)
  async testAPIConnection() {
    if (!this.isConfigured) {
      return { success: false, message: 'Twitter not configured' };
    }

    try {
      const accountInfo = await this.getAccountInfo();
      if (accountInfo) {
        return { 
          success: true, 
          message: `Connected as @${accountInfo.username}`,
          account: accountInfo
        };
      } else {
        return { success: false, message: 'Failed to fetch account info' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default TwitterIntegration;
