// Wojat Master Scheduler Agent - Coordinates Twitter social media agents
import ContentGeneratorAgent from './content-generator-agent.js';
import TwitterManagerAgent from './twitter-manager-agent.js';
import dotenv from 'dotenv';

dotenv.config();

export class MasterSchedulerAgent {
  constructor() {
    this.name = 'Wojat Master Scheduler Agent';
    this.personality = 'Strategic coordinator focused on maximizing Twitter impact and community engagement';
    this.goals = [
      'Coordinate Twitter platform for maximum impact',
      'Optimize posting schedules for Twitter',
      'Ensure consistent brand messaging',
      'Maximize engagement and reach on Twitter',
      'Monitor and analyze performance on Twitter'
    ];

    // Initialize Twitter agents only
    this.contentGenerator = new ContentGeneratorAgent();
    this.twitterManager = new TwitterManagerAgent();
    
    this.agents = [
      this.contentGenerator,
      this.twitterManager
    ];

    this.isRunning = false;
    this.schedule = [];
    this.performanceMetrics = {
      totalPosts: 0,
      totalEngagement: 0,
      totalReach: 0,
      averageEngagementRate: 0
    };
  }

  // Initialize all agents (legacy method - now Twitter only)
  async initialize() {
    return this.initializeTwitterOnly();
  }

  // Initialize Twitter-only agents
  async initializeTwitterOnly() {
    try {
      console.log('🎯 Initializing Wojat Master Scheduler Agent (Twitter Only)...');
      
      // Initialize Twitter agents only
      const initResults = await Promise.allSettled([
        this.twitterManager.initialize()
      ]);

      const successCount = initResults.filter(result => result.status === 'fulfilled' && result.value).length;
      console.log(`✅ ${successCount}/${initResults.length} Twitter agents initialized`);

      // Create initial schedule
      this.createTwitterSchedule();
      
      console.log('✅ Wojat Master Scheduler Agent (Twitter Only) initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Wojat Master Scheduler Agent:', error);
      return false;
    }
  }

  // Create Twitter-only posting schedule
  createTwitterSchedule() {
    const today = new Date();
    this.schedule = [];

    // Morning content (8:00 AM)
    this.schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
      type: 'educational',
      platforms: ['twitter'],
      content: 'risk-management',
      priority: 'high'
    });

    // Midday trending update (12:00 PM)
    this.schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      type: 'trending',
      platforms: ['twitter'],
      content: 'daily-trends',
      priority: 'high'
    });

    // Afternoon analysis (4:00 PM)
    this.schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
      type: 'analysis',
      platforms: ['twitter'],
      content: 'market-analysis',
      priority: 'medium'
    });

    // Evening community content (8:00 PM)
    this.schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
      type: 'community',
      platforms: ['twitter'],
      content: 'community-spotlight',
      priority: 'medium'
    });

    // Night thread (Twitter only - 10:00 PM)
    this.schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 0),
      type: 'thread',
      platforms: ['twitter'],
      content: 'memecoin-guide',
      priority: 'low'
    });

    console.log(`📅 Master schedule created with ${this.schedule.length} scheduled posts`);
  }

  // Execute scheduled posts
  async executeScheduledPosts() {
    const now = new Date();
    const postsToExecute = this.schedule.filter(post => post.time <= now);

    for (const post of postsToExecute) {
      try {
        console.log(`📝 Executing scheduled post: ${post.type} on ${post.platforms.join(', ')}`);
        
        const results = await this.executePost(post);
        
        // Update performance metrics
        this.updatePerformanceMetrics(results);
        
        // Remove executed post from schedule
        this.schedule = this.schedule.filter(p => p !== post);
        
        console.log(`✅ Scheduled post executed successfully`);
      } catch (error) {
        console.error(`❌ Error executing scheduled post ${post.type}:`, error);
      }
    }
  }

  // Execute a single post on Twitter
  async executePost(post) {
    const results = {};
    
    for (const platform of post.platforms) {
      try {
        let result;
        
        switch (platform) {
          case 'twitter':
            result = await this.executeTwitterPost(post);
            break;
          default:
            console.log(`⚠️ Platform ${platform} not supported in Twitter-only mode`);
            result = { success: false, error: 'Platform not supported' };
        }
        
        results[platform] = result;
      } catch (error) {
        console.error(`❌ Error executing ${platform} post:`, error);
        results[platform] = { success: false, error: error.message };
      }
    }
    
    return results;
  }

  // Execute Twitter post
  async executeTwitterPost(post) {
    switch (post.type) {
      case 'educational':
        return await this.twitterManager.postEducationalContent(post.content);
      case 'trending':
        // This would use real trending data
        console.log('📈 Would post trending update to Twitter');
        return { success: true, simulated: true };
      case 'analysis':
        // This would use real analysis data
        console.log('📊 Would post market analysis to Twitter');
        return { success: true, simulated: true };
      case 'community':
        console.log('👥 Would post community content to Twitter');
        return { success: true, simulated: true };
      case 'thread':
        return await this.twitterManager.createThread(post.content, {});
      default:
        return { success: false, error: 'Unknown post type' };
    }
  }


  // Post trending alert on Twitter
  async postTrendingAlert(trendingData) {
    try {
      console.log('🔥 Posting trending alert on Twitter...');
      
      const results = {};
      
      // Post to Twitter
      try {
        results.twitter = await this.twitterManager.postTrendingAlert(trendingData);
      } catch (error) {
        results.twitter = { success: false, error: error.message };
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(results);
      
      console.log('✅ Trending alert posted on Twitter');
      return results;
    } catch (error) {
      console.error('❌ Error posting trending alert:', error);
      throw error;
    }
  }

  // Post educational content on Twitter
  async postEducationalContent(topic) {
    try {
      console.log(`📚 Posting educational content on Twitter: ${topic}`);
      
      const results = {};
      
      // Post to Twitter
      try {
        results.twitter = await this.twitterManager.postEducationalContent(topic);
      } catch (error) {
        results.twitter = { success: false, error: error.message };
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(results);
      
      console.log('✅ Educational content posted on Twitter');
      return results;
    } catch (error) {
      console.error('❌ Error posting educational content:', error);
      throw error;
    }
  }

  // Post market analysis on Twitter
  async postMarketAnalysis(analysis) {
    try {
      console.log('📊 Posting market analysis on Twitter...');
      
      const results = {};
      
      // Post to Twitter
      try {
        results.twitter = await this.twitterManager.postMarketAnalysis(analysis);
      } catch (error) {
        results.twitter = { success: false, error: error.message };
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(results);
      
      console.log('✅ Market analysis posted on Twitter');
      return results;
    } catch (error) {
      console.error('❌ Error posting market analysis:', error);
      throw error;
    }
  }

  // Update performance metrics
  updatePerformanceMetrics(results) {
    this.performanceMetrics.totalPosts += Object.keys(results).length;
    
    // Count successful posts
    const successfulPosts = Object.values(results).filter(result => result.success).length;
    this.performanceMetrics.totalEngagement += successfulPosts;
    
    // Calculate engagement rate
    if (this.performanceMetrics.totalPosts > 0) {
      this.performanceMetrics.averageEngagementRate = 
        (this.performanceMetrics.totalEngagement / this.performanceMetrics.totalPosts) * 100;
    }
  }

  // Get performance metrics for all platforms
  async getPerformanceMetrics() {
    try {
      console.log('📊 Gathering performance metrics from Twitter...');
      
      const metrics = {
        twitter: await this.twitterManager.getEngagementMetrics(),
        master: this.performanceMetrics
      };
      
      return metrics;
    } catch (error) {
      console.error('❌ Error getting performance metrics:', error);
      return { error: error.message };
    }
  }

  // Start continuous monitoring
  async startMonitoring(intervalMs = 300000) { // 5 minutes default
    if (this.isRunning) {
      console.log('⚠️ Monitoring already running');
      return;
    }

    this.isRunning = true;
    console.log(`🔄 Starting continuous monitoring (${intervalMs / 1000}s intervals)...`);

    const runCycle = async () => {
      if (!this.isRunning) return;

      try {
        // Execute scheduled posts
        await this.executeScheduledPosts();
        
        // Handle mentions and engagement
        await this.handleEngagement();
        
        // Update performance metrics
        await this.getPerformanceMetrics();
        
      } catch (error) {
        console.error('❌ Error in monitoring cycle:', error);
      }

      // Schedule next cycle
      setTimeout(runCycle, intervalMs);
    };

    // Start the first cycle immediately
    runCycle();
  }

  // Stop monitoring
  stopMonitoring() {
    console.log('⏹️ Stopping monitoring...');
    this.isRunning = false;
  }

  // Handle engagement across platforms
  async handleEngagement() {
    try {
      console.log('💬 Handling engagement across platforms...');
      
      // Handle Twitter mentions
      await this.twitterManager.handleMentions();
      
      // Other platforms would have similar engagement handling
      console.log('✅ Engagement handled across all platforms');
    } catch (error) {
      console.error('❌ Error handling engagement:', error);
    }
  }

  // Create content strategy based on trends
  async createContentStrategy(trends) {
    try {
      console.log('🎨 Creating content strategy based on trends...');
      
      const strategy = {
        trending: {
          platforms: ['twitter', 'telegram', 'discord'],
          priority: 'high',
          content: 'trending-alert'
        },
        educational: {
          platforms: ['twitter', 'telegram', 'discord'],
          priority: 'medium',
          content: 'risk-management'
        },
        community: {
          platforms: ['discord', 'telegram'],
          priority: 'low',
          content: 'community-spotlight'
        }
      };
      
      return strategy;
    } catch (error) {
      console.error('❌ Error creating content strategy:', error);
      throw error;
    }
  }

  // Get agent status
  getStatus() {
    return {
      name: this.name,
      personality: this.personality,
      goals: this.goals,
      isRunning: this.isRunning,
      agentsCount: this.agents.length,
      scheduleCount: this.schedule.length,
      performanceMetrics: this.performanceMetrics,
      status: 'active'
    };
  }

  // Get all agents status
  getAllAgentsStatus() {
    return {
      master: this.getStatus(),
      contentGenerator: this.contentGenerator.getStatus(),
      twitterManager: this.twitterManager.getStatus()
    };
  }
}

export default MasterSchedulerAgent;
