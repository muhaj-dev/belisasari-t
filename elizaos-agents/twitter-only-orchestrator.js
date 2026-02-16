// Twitter-Only Orchestrator - Focused on Twitter Automation
import MasterSchedulerAgent from './agents/master-scheduler-agent.js';
import ContentGeneratorAgent from './agents/content-generator-agent.js';
import TwitterManagerAgent from './agents/twitter-manager-agent.js';
import dotenv from 'dotenv';

dotenv.config();

export class TwitterOnlyOrchestrator {
  constructor() {
    this.name = 'Twitter-Only Orchestrator';
    this.description = 'Focused Twitter Automation System for Memecoin Hunting';
    this.version = '1.0.0';
    
    // Initialize only Twitter-focused agents
    this.contentGenerator = new ContentGeneratorAgent();
    this.twitterManager = new TwitterManagerAgent();
    
    // Simplified master scheduler for Twitter only
    this.masterScheduler = new MasterSchedulerAgent();
    
    this.agents = [
      this.masterScheduler,
      this.contentGenerator,
      this.twitterManager
    ];
    
    this.isRunning = false;
    this.postingInterval = null;
  }

  // Initialize Twitter-only system
  async initialize() {
    try {
      console.log('🐦 Initializing Twitter-Only Automation System...\n');
      
      // Initialize Twitter manager
      const twitterInitialized = await this.twitterManager.initialize();
      
      if (twitterInitialized) {
        console.log('✅ Twitter-Only system initialized successfully');
        console.log('🐦 Platform: Twitter only');
        console.log('🤖 Active agents: Content Generator, Twitter Manager');
        return true;
      } else {
        console.log('⚠️ Twitter not configured, running in simulation mode');
        console.log('📝 Set up Twitter credentials in .env file to enable posting');
        return true; // Still return true for simulation mode
      }
    } catch (error) {
      console.error('❌ Failed to initialize Twitter-Only system:', error);
      return false;
    }
  }

  // Start continuous Twitter automation
  async startAutomation() {
    try {
      console.log('🚀 Starting Twitter automation...');
      
      this.isRunning = true;
      
      // Post initial content
      await this.postInitialContent();
      
      // Set up regular posting schedule
      this.setupPostingSchedule();
      
      console.log('✅ Twitter automation started successfully');
      console.log('📅 Posting schedule: Every 30 minutes');
      console.log('🔄 Press Ctrl+C to stop');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to start Twitter automation:', error);
      return false;
    }
  }

  // Stop automation
  async stopAutomation() {
    try {
      console.log('🛑 Stopping Twitter automation...');
      
      this.isRunning = false;
      
      if (this.postingInterval) {
        clearInterval(this.postingInterval);
        this.postingInterval = null;
      }
      
      console.log('✅ Twitter automation stopped');
      return true;
    } catch (error) {
      console.error('❌ Error stopping automation:', error);
      return false;
    }
  }

  // Post initial content
  async postInitialContent() {
    try {
      console.log('📝 Posting initial content...');
      
      // Welcome tweet
      await this.postWelcomeTweet();
      
      // Educational content
      await this.postEducationalContent('memecoin_basics');
      
      // Market status
      await this.postMarketStatus();
      
      console.log('✅ Initial content posted');
    } catch (error) {
      console.error('❌ Error posting initial content:', error);
    }
  }

  // Setup regular posting schedule
  setupPostingSchedule() {
    // Post every 30 minutes
    this.postingInterval = setInterval(async () => {
      if (this.isRunning) {
        await this.executeScheduledPost();
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  // Execute scheduled post
  async executeScheduledPost() {
    try {
      const postTypes = [
        'trending_alert',
        'educational',
        'market_analysis',
        'community_engagement',
        'trading_tip'
      ];
      
      const randomType = postTypes[Math.floor(Math.random() * postTypes.length)];
      
      switch (randomType) {
        case 'trending_alert':
          await this.postTrendingAlert();
          break;
        case 'educational':
          await this.postEducationalContent();
          break;
        case 'market_analysis':
          await this.postMarketAnalysis();
          break;
        case 'community_engagement':
          await this.postCommunityEngagement();
          break;
        case 'trading_tip':
          await this.postTradingTip();
          break;
      }
    } catch (error) {
      console.error('❌ Error executing scheduled post:', error);
    }
  }

  // Post welcome tweet
  async postWelcomeTweet() {
    try {
      const welcomeTweet = `🚀 Welcome to Iris - The AI Memecoin Hunter! 🚀

🤖 I'm your AI assistant for finding the next big memecoin
📊 I analyze TikTok trends, Telegram signals, and blockchain data
💡 I'll share insights, alerts, and trading tips

Follow me for:
• 🔥 Trending memecoin alerts
• 📚 Educational content
• 📈 Market analysis
• 💰 Trading recommendations

#Memecoin #Solana #Crypto #AI #Trading`;

      await this.twitterManager.postTweet(welcomeTweet);
      console.log('✅ Welcome tweet posted');
    } catch (error) {
      console.error('❌ Error posting welcome tweet:', error);
    }
  }

  // Post educational content
  async postEducationalContent(topic = null) {
    try {
      const topics = [
        'memecoin_basics',
        'risk_management',
        'technical_analysis',
        'market_sentiment',
        'trading_psychology'
      ];
      
      const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
      
      await this.twitterManager.postEducationalContent(selectedTopic);
      console.log(`✅ Educational content posted: ${selectedTopic}`);
    } catch (error) {
      console.error('❌ Error posting educational content:', error);
    }
  }

  // Post market status
  async postMarketStatus() {
    try {
      const marketStatus = {
        summary: 'Market showing mixed signals with increased memecoin activity',
        keyMetrics: {
          totalVolume: '$2.5M',
          activeTokens: 150,
          trendingHashtags: ['#memecoin', '#solana', '#pumpfun']
        }
      };
      
      await this.twitterManager.postMarketAnalysis(marketStatus);
      console.log('✅ Market status posted');
    } catch (error) {
      console.error('❌ Error posting market status:', error);
    }
  }

  // Post trending alert
  async postTrendingAlert() {
    try {
      // This would use real trending data from your scrapers
      const trendingData = {
        memecoins: [
          {
            name: 'Sample Token',
            symbol: 'SAMPLE',
            price: 0.000123,
            volume24h: 125000,
            change24h: 15.67
          }
        ],
        tiktokTrends: {
          trendingHashtags: ['#memecoin', '#solana', '#pumpfun']
        }
      };
      
      await this.twitterManager.postTrendingAlert(trendingData);
      console.log('✅ Trending alert posted');
    } catch (error) {
      console.error('❌ Error posting trending alert:', error);
    }
  }

  // Post market analysis
  async postMarketAnalysis() {
    try {
      const analysis = {
        summary: 'Strong bullish momentum detected in memecoin sector',
        recommendation: 'Consider small positions in trending tokens with proper risk management',
        confidence: 0.75,
        keyFactors: [
          'High TikTok engagement',
          'Increased trading volume',
          'Positive social sentiment'
        ],
        riskLevel: 'medium'
      };
      
      await this.twitterManager.postMarketAnalysis(analysis);
      console.log('✅ Market analysis posted');
    } catch (error) {
      console.error('❌ Error posting market analysis:', error);
    }
  }

  // Post community engagement
  async postCommunityEngagement() {
    try {
      const engagementTypes = [
        'poll',
        'question',
        'discussion_starter',
        'community_highlight'
      ];
      
      const type = engagementTypes[Math.floor(Math.random() * engagementTypes.length)];
      
      switch (type) {
        case 'poll':
          await this.postPoll();
          break;
        case 'question':
          await this.postQuestion();
          break;
        case 'discussion_starter':
          await this.postDiscussionStarter();
          break;
        case 'community_highlight':
          await this.postCommunityHighlight();
          break;
      }
      
      console.log(`✅ Community engagement posted: ${type}`);
    } catch (error) {
      console.error('❌ Error posting community engagement:', error);
    }
  }

  // Post trading tip
  async postTradingTip() {
    try {
      const tips = [
        'Always set stop-losses when trading memecoins',
        'Never invest more than you can afford to lose',
        'Diversify your portfolio across different tokens',
        'Follow the 1% rule: risk only 1% of your portfolio per trade',
        'Use technical analysis to confirm social signals'
      ];
      
      const tip = tips[Math.floor(Math.random() * tips.length)];
      
      const tweet = `💡 Trading Tip of the Day 💡

${tip}

#TradingTip #Memecoin #RiskManagement #Crypto`;

      await this.twitterManager.postTweet(tweet);
      console.log('✅ Trading tip posted');
    } catch (error) {
      console.error('❌ Error posting trading tip:', error);
    }
  }

  // Post poll
  async postPoll() {
    try {
      const polls = [
        {
          question: 'What\'s your favorite memecoin right now?',
          options: ['BONK', 'WIF', 'PEPE', 'Other']
        },
        {
          question: 'How do you discover new memecoins?',
          options: ['TikTok', 'Telegram', 'Twitter', 'Friends']
        }
      ];
      
      const poll = polls[Math.floor(Math.random() * polls.length)];
      
      await this.twitterManager.postPoll(poll.question, poll.options);
      console.log('✅ Poll posted');
    } catch (error) {
      console.error('❌ Error posting poll:', error);
    }
  }

  // Post question
  async postQuestion() {
    try {
      const questions = [
        'What memecoin are you most excited about this week?',
        'What\'s your biggest trading mistake and what did you learn?',
        'How do you manage risk when trading volatile memecoins?',
        'What indicators do you use to identify potential winners?'
      ];
      
      const question = questions[Math.floor(Math.random() * questions.length)];
      
      const tweet = `🤔 Community Question 🤔

${question}

💬 Share your thoughts below! #Community #Memecoin #Trading`;

      await this.twitterManager.postTweet(tweet);
      console.log('✅ Question posted');
    } catch (error) {
      console.error('❌ Error posting question:', error);
    }
  }

  // Post discussion starter
  async postDiscussionStarter() {
    try {
      const topics = [
        'The future of memecoins in 2024',
        'How AI is changing crypto trading',
        'The psychology of FOMO in memecoin trading',
        'Building a sustainable trading strategy'
      ];
      
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const tweet = `💭 Let's Discuss 💭

${topic}

What are your thoughts? Let's have a healthy discussion! 

#Discussion #Memecoin #Crypto #Community`;

      await this.twitterManager.postTweet(tweet);
      console.log('✅ Discussion starter posted');
    } catch (error) {
      console.error('❌ Error posting discussion starter:', error);
    }
  }

  // Post community highlight
  async postCommunityHighlight() {
    try {
      const highlights = [
        'Shoutout to our amazing community for sharing great insights!',
        'Thank you to everyone who participated in our poll yesterday!',
        'Great to see so many new faces joining our memecoin journey!',
        'The community feedback has been incredible - keep it coming!'
      ];
      
      const highlight = highlights[Math.floor(Math.random() * highlights.length)];
      
      const tweet = `🌟 Community Highlight 🌟

${highlight}

#Community #ThankYou #Memecoin #Together`;

      await this.twitterManager.postTweet(tweet);
      console.log('✅ Community highlight posted');
    } catch (error) {
      console.error('❌ Error posting community highlight:', error);
    }
  }

  // Get system status
  getSystemStatus() {
    return {
      name: this.name,
      version: this.version,
      isRunning: this.isRunning,
      agents: {
        contentGenerator: this.contentGenerator ? 'active' : 'inactive',
        twitterManager: this.twitterManager ? 'active' : 'inactive'
      },
      platform: 'Twitter only',
      postingInterval: this.postingInterval ? 'active' : 'inactive'
    };
  }

  // Manual post method
  async postManualTweet(content) {
    try {
      await this.twitterManager.postTweet(content);
      console.log('✅ Manual tweet posted');
      return { success: true };
    } catch (error) {
      console.error('❌ Error posting manual tweet:', error);
      return { success: false, error: error.message };
    }
  }
}

// Main execution function
async function main() {
  const orchestrator = new TwitterOnlyOrchestrator();
  
  try {
    // Initialize the system
    const initialized = await orchestrator.initialize();
    
    if (!initialized) {
      console.error('❌ Failed to initialize Twitter-Only system');
      process.exit(1);
    }
    
    // Start automation
    await orchestrator.startAutomation();
    
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await orchestrator.stopAutomation();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await orchestrator.stopAutomation();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Fatal error in Twitter-Only system:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('twitter-only-orchestrator.js')) {
  main();
}

