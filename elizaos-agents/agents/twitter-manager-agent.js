// Twitter Manager Agent - Advanced Twitter automation and strategy
import TwitterIntegration from '../integrations/twitter-integration.js';
import ContentGeneratorAgent from './content-generator-agent.js';
import dotenv from 'dotenv';

dotenv.config();

export class TwitterManagerAgent {
  constructor() {
    this.name = 'Twitter Manager Agent';
    this.personality = 'Strategic social media manager focused on building engaged communities and maximizing reach';
    this.goals = [
      'Maximize engagement and reach on Twitter',
      'Build a strong community around memecoin trading',
      'Create viral content that drives traffic',
      'Maintain consistent posting schedule',
      'Monitor and respond to community interactions'
    ];

    this.twitter = new TwitterIntegration();
    this.contentGenerator = new ContentGeneratorAgent();
    this.postingSchedule = [];
    this.engagementMetrics = {
      likes: 0,
      retweets: 0,
      replies: 0,
      followers: 0,
      impressions: 0
    };
    
    this.optimalPostingTimes = [
      { hour: 9, minute: 0, weight: 0.8 },
      { hour: 12, minute: 0, weight: 1.0 },
      { hour: 15, minute: 0, weight: 0.9 },
      { hour: 18, minute: 0, weight: 0.7 },
      { hour: 21, minute: 0, weight: 0.6 }
    ];
  }

  // Initialize the Twitter manager
  async initialize() {
    try {
      console.log('🐦 Initializing Twitter Manager Agent...');
      
      // Test Twitter connection
      const connectionTest = await this.twitter.testConnection();
      if (!connectionTest.success) {
        console.log('⚠️ Twitter not configured, running in simulation mode');
        return false;
      }

      console.log('✅ Twitter Manager Agent initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Twitter Manager Agent:', error);
      return false;
    }
  }

  // Create and post a thread
  async createThread(topic, data) {
    try {
      console.log(`🧵 Creating thread: ${topic}`);
      
      const threadTweets = this.contentGenerator.generateThread(topic, data);
      let threadId = null;
      
      for (let i = 0; i < threadTweets.length; i++) {
        const tweet = threadTweets[i];
        
        // Add thread continuation if not first tweet
        const finalTweet = i === 0 ? tweet : `${tweet}\n\n${i + 1}/${threadTweets.length}`;
        
        const response = await this.twitter.client.v2.tweet({
          text: finalTweet,
          reply: i > 0 ? { in_reply_to_tweet_id: threadId } : undefined
        });
        
        if (i === 0) {
          threadId = response.data.id;
        }
        
        console.log(`   ✅ Tweet ${i + 1}/${threadTweets.length} posted`);
        
        // Wait between tweets to avoid rate limits
        if (i < threadTweets.length - 1) {
          await this.delay(2000);
        }
      }
      
      return { success: true, threadId, tweetCount: threadTweets.length };
    } catch (error) {
      console.error('❌ Error creating thread:', error);
      return { success: false, error: error.message };
    }
  }

  // Post trending alert with enhanced formatting
  async postTrendingAlert(trendingData) {
    try {
      console.log('🔥 Posting enhanced trending alert...');
      
      if (!this.twitter.isConfigured) {
        console.log('⚠️ Twitter not configured, simulating post');
        return { success: true, simulated: true };
      }
      
      const content = this.contentGenerator.generateTrendingAlert(trendingData, 'twitter');
      
      // Add engagement hooks
      const enhancedContent = `${content}\n\n💬 What do you think? Drop your predictions below! 👇`;
      
      const response = await this.twitter.client.v2.tweet(enhancedContent);
      
      // Schedule follow-up engagement
      this.scheduleFollowUp(response.data.id, 'trending', trendingData);
      
      console.log('✅ Enhanced trending alert posted');
      return response.data;
    } catch (error) {
      console.error('❌ Error posting trending alert:', error);
      throw error;
    }
  }

  // Post educational content
  async postEducationalContent(topic) {
    try {
      console.log(`📚 Posting educational content: ${topic}`);
      
      if (!this.twitter.isConfigured) {
        console.log('⚠️ Twitter not configured, simulating post');
        return { success: true, simulated: true };
      }
      
      const content = this.contentGenerator.generateEducationalContent(topic, 'twitter');
      
      // Add call-to-action
      const enhancedContent = `${content}\n\n🔄 Retweet if this helped you!\n💬 Questions? Ask below!`;
      
      const response = await this.twitter.client.v2.tweet(enhancedContent);
      
      console.log('✅ Educational content posted');
      return response.data;
    } catch (error) {
      console.error('❌ Error posting educational content:', error);
      throw error;
    }
  }

  // Post market analysis
  async postMarketAnalysis(analysis) {
    try {
      console.log('📊 Posting market analysis...');
      
      if (!this.twitter.isConfigured) {
        console.log('⚠️ Twitter not configured, simulating post');
        return { success: true, simulated: true };
      }
      
      const content = this.contentGenerator.generateMarketAnalysis(analysis, 'twitter');
      
      // Add engagement elements
      const enhancedContent = `${content}\n\n🤔 Agree or disagree? Let's discuss!`;
      
      const response = await this.twitter.client.v2.tweet(enhancedContent);
      
      console.log('✅ Market analysis posted');
      return response.data;
    } catch (error) {
      console.error('❌ Error posting market analysis:', error);
      throw error;
    }
  }

  // Post community poll
  async postPoll(question, options) {
    try {
      console.log('📊 Posting community poll...');
      
      const content = this.contentGenerator.generatePoll(question, options, 'twitter');
      
      const response = await this.twitter.client.v2.tweet(content);
      
      // Schedule poll reminder
      this.schedulePollReminder(response.data.id, question);
      
      console.log('✅ Community poll posted');
      return response.data;
    } catch (error) {
      console.error('❌ Error posting poll:', error);
      throw error;
    }
  }

  // Engage with mentions and replies
  async handleMentions() {
    try {
      console.log('💬 Checking for mentions...');
      
      const mentions = await this.twitter.client.v2.userMentionTimeline(process.env.ZORO_ACCESS_TOKEN, {
        max_results: 10,
        'tweet.fields': ['created_at', 'author_id', 'conversation_id']
      });

      for (const mention of mentions.data.data || []) {
        await this.processMention(mention);
      }
      
      console.log(`✅ Processed ${mentions.data.data?.length || 0} mentions`);
    } catch (error) {
      console.error('❌ Error handling mentions:', error);
    }
  }

  // Process individual mention
  async processMention(mention) {
    try {
      const text = mention.text.toLowerCase();
      
      // Generate appropriate response based on mention content
      let response = '';
      
      if (text.includes('trending') || text.includes('pump')) {
        response = '🔥 Check out our latest trending analysis! What coins are you watching?';
      } else if (text.includes('help') || text.includes('how')) {
        response = '💡 I\'m here to help! What specific question do you have about memecoin trading?';
      } else if (text.includes('thanks') || text.includes('thank you')) {
        response = '🙏 You\'re welcome! Happy to help the community!';
      } else if (text.includes('prediction') || text.includes('forecast')) {
        response = '🔮 I analyze trends and data, but remember: DYOR! What\'s your take on the current market?';
      } else {
        response = '👋 Thanks for the mention! How can I help you with memecoin trading today?';
      }
      
      // Reply to the mention
      await this.twitter.client.v2.tweet({
        text: response,
        reply: { in_reply_to_tweet_id: mention.id }
      });
      
      console.log(`   ✅ Replied to mention: ${mention.id}`);
    } catch (error) {
      console.error(`❌ Error processing mention ${mention.id}:`, error);
    }
  }

  // Schedule follow-up content
  scheduleFollowUp(tweetId, type, data) {
    const followUps = {
      trending: {
        delay: 30 * 60 * 1000, // 30 minutes
        content: '📈 Update: How\'s the trend looking now? Any new developments?'
      },
      analysis: {
        delay: 60 * 60 * 1000, // 1 hour
        content: '🤔 What are your thoughts on this analysis? Agree or disagree?'
      },
      poll: {
        delay: 24 * 60 * 60 * 1000, // 24 hours
        content: '📊 Poll results are in! Check out what the community thinks.'
      }
    };

    const followUp = followUps[type];
    if (followUp) {
      setTimeout(async () => {
        try {
          await this.twitter.client.v2.tweet({
            text: followUp.content,
            reply: { in_reply_to_tweet_id: tweetId }
          });
          console.log(`✅ Follow-up posted for ${type}`);
        } catch (error) {
          console.error(`❌ Error posting follow-up for ${type}:`, error);
        }
      }, followUp.delay);
    }
  }

  // Schedule poll reminder
  schedulePollReminder(tweetId, question) {
    setTimeout(async () => {
      try {
        const reminder = `⏰ Poll reminder: ${question}\n\nDon't forget to vote! Your opinion matters! 👇`;
        await this.twitter.client.v2.tweet({
          text: reminder,
          reply: { in_reply_to_tweet_id: tweetId }
        });
        console.log('✅ Poll reminder posted');
      } catch (error) {
        console.error('❌ Error posting poll reminder:', error);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours
  }

  // Create daily content schedule
  createDailySchedule() {
    const schedule = [];
    const today = new Date();
    
    // Morning educational content
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      type: 'educational',
      content: 'risk-management'
    });
    
    // Midday trending update
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      type: 'trending',
      content: 'daily-trends'
    });
    
    // Afternoon market analysis
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
      type: 'analysis',
      content: 'market-analysis'
    });
    
    // Evening community engagement
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      type: 'community',
      content: 'community-spotlight'
    });
    
    // Night thread
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0),
      type: 'thread',
      content: 'memecoin-guide'
    });
    
    return schedule;
  }

  // Execute scheduled posts
  async executeScheduledPosts() {
    const schedule = this.createDailySchedule();
    const now = new Date();
    
    for (const post of schedule) {
      if (post.time <= now) {
        try {
          switch (post.type) {
            case 'educational':
              await this.postEducationalContent(post.content);
              break;
            case 'trending':
              // This would use real trending data
              console.log('📈 Would post trending update');
              break;
            case 'analysis':
              // This would use real analysis data
              console.log('📊 Would post market analysis');
              break;
            case 'community':
              console.log('👥 Would post community content');
              break;
            case 'thread':
              await this.createThread(post.content, {});
              break;
          }
        } catch (error) {
          console.error(`❌ Error executing scheduled post ${post.type}:`, error);
        }
      }
    }
  }

  // Get engagement metrics
  async getEngagementMetrics() {
    try {
      const tweets = await this.twitter.getRecentTweets(20);
      
      let totalLikes = 0;
      let totalRetweets = 0;
      let totalReplies = 0;
      let totalImpressions = 0;
      
      for (const tweet of tweets) {
        totalLikes += tweet.public_metrics?.like_count || 0;
        totalRetweets += tweet.public_metrics?.retweet_count || 0;
        totalReplies += tweet.public_metrics?.reply_count || 0;
        totalImpressions += tweet.public_metrics?.impression_count || 0;
      }
      
      this.engagementMetrics = {
        likes: totalLikes,
        retweets: totalRetweets,
        replies: totalReplies,
        impressions: totalImpressions,
        engagementRate: ((totalLikes + totalRetweets + totalReplies) / totalImpressions) * 100 || 0
      };
      
      return this.engagementMetrics;
    } catch (error) {
      console.error('❌ Error getting engagement metrics:', error);
      return this.engagementMetrics;
    }
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get agent status
  getStatus() {
    return {
      name: this.name,
      personality: this.personality,
      goals: this.goals,
      isConfigured: this.twitter.isConfigured,
      engagementMetrics: this.engagementMetrics,
      status: 'active'
    };
  }
}

export default TwitterManagerAgent;
