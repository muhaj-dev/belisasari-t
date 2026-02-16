// Telegram Manager Agent - Telegram channel and community management
import dotenv from 'dotenv';

dotenv.config();

export class TelegramManagerAgent {
  constructor() {
    this.name = 'Telegram Manager Agent';
    this.personality = 'Community-focused manager specializing in building engaged Telegram communities around memecoin trading';
    this.goals = [
      'Build and grow Telegram communities',
      'Facilitate real-time discussions about memecoins',
      'Share instant alerts and updates',
      'Moderate community discussions',
      'Create educational content for Telegram format'
    ];

    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.groupId = process.env.TELEGRAM_GROUP_ID;
    this.isConfigured = !!(this.botToken && this.channelId);
    
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.memberCount = 0;
    this.messageCount = 0;
    this.engagementRate = 0;
  }

  // Initialize the Telegram manager
  async initialize() {
    try {
      console.log('📱 Initializing Telegram Manager Agent...');
      
      if (!this.isConfigured) {
        console.log('⚠️ Telegram not configured, running in simulation mode');
        return false;
      }

      // Test bot connection
      const response = await fetch(`${this.baseUrl}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        console.log(`✅ Telegram bot connected: @${data.result.username}`);
        return true;
      } else {
        console.log('❌ Failed to connect to Telegram bot');
        return false;
      }
    } catch (error) {
      console.error('❌ Error initializing Telegram Manager Agent:', error);
      return false;
    }
  }

  // Send message to channel
  async sendChannelMessage(text, options = {}) {
    try {
      if (!this.isConfigured) {
        console.log('📱 [SIMULATION] Channel message:', text);
        return { success: true, messageId: 'simulated' };
      }

      const payload = {
        chat_id: this.channelId,
        text: text,
        parse_mode: 'HTML',
        ...options
      };

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Channel message sent');
        return { success: true, messageId: data.result.message_id };
      } else {
        console.error('❌ Failed to send channel message:', data.description);
        return { success: false, error: data.description };
      }
    } catch (error) {
      console.error('❌ Error sending channel message:', error);
      return { success: false, error: error.message };
    }
  }

  // Send message to group
  async sendGroupMessage(text, options = {}) {
    try {
      if (!this.isConfigured) {
        console.log('📱 [SIMULATION] Group message:', text);
        return { success: true, messageId: 'simulated' };
      }

      const payload = {
        chat_id: this.groupId,
        text: text,
        parse_mode: 'HTML',
        ...options
      };

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Group message sent');
        return { success: true, messageId: data.result.message_id };
      } else {
        console.error('❌ Failed to send group message:', data.description);
        return { success: false, error: data.description };
      }
    } catch (error) {
      console.error('❌ Error sending group message:', error);
      return { success: false, error: error.message };
    }
  }

  // Post trending alert to channel
  async postTrendingAlert(trendingData) {
    try {
      console.log('🔥 Posting trending alert to Telegram...');
      
      const { token, price, volume, hashtags } = trendingData;
      
      const message = `🚨 <b>TRENDING ALERT!</b> 🚨\n\n` +
        `📈 <b>${token}</b> is showing strong momentum!\n` +
        `💰 <b>Price:</b> $${price?.toFixed(6) || 'N/A'}\n` +
        `📊 <b>24h Volume:</b> $${this.formatVolume(volume)}\n` +
        `🎬 <b>TikTok Hashtags:</b> ${hashtags?.join(' ') || '#memecoin'}\n\n` +
        `#Solana #Memecoin #Pump #TikTok #Crypto`;
      
      const result = await this.sendChannelMessage(message);
      
      if (result.success) {
        // Also post to group for discussion
        const groupMessage = `🔥 <b>New trending alert posted!</b>\n\nWhat do you think about ${token}? Share your thoughts! 👇`;
        await this.sendGroupMessage(groupMessage);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error posting trending alert:', error);
      throw error;
    }
  }

  // Post educational content
  async postEducationalContent(topic, data = {}) {
    try {
      console.log(`📚 Posting educational content: ${topic}`);
      
      const educationalContent = {
        'risk-management': {
          title: 'Risk Management 101',
          content: `📚 <b>MEMECOIN EDUCATION</b> 📚\n\n` +
            `<b>Risk Management 101</b>\n\n` +
            `Never invest more than you can afford to lose. Set stop-losses and take-profits. ` +
            `Diversify your portfolio. Remember: memecoins are high-risk, high-reward investments.\n\n` +
            `💡 <b>Key takeaway:</b> Protect your capital first, profits second\n\n` +
            `#MemecoinEducation #TradingTips #RiskManagement`
        },
        'technical-analysis': {
          title: 'Reading the Charts',
          content: `📚 <b>MEMECOIN EDUCATION</b> 📚\n\n` +
            `<b>Reading the Charts</b>\n\n` +
            `Look for volume spikes, support/resistance levels, and trend patterns. ` +
            `Volume often precedes price movement. Use multiple timeframes for better context.\n\n` +
            `💡 <b>Key takeaway:</b> Volume + Price action = Better decisions\n\n` +
            `#MemecoinEducation #TradingTips #TechnicalAnalysis`
        },
        'social-sentiment': {
          title: 'Social Media Signals',
          content: `📚 <b>MEMECOIN EDUCATION</b> 📚\n\n` +
            `<b>Social Media Signals</b>\n\n` +
            `TikTok trends, Twitter mentions, and community engagement can indicate potential moves. ` +
            `But always verify with on-chain data and technical analysis.\n\n` +
            `💡 <b>Key takeaway:</b> Social sentiment is a tool, not the whole strategy\n\n` +
            `#MemecoinEducation #TradingTips #SocialSentiment`
        }
      };

      const content = educationalContent[topic] || educationalContent['risk-management'];
      
      const result = await this.sendChannelMessage(content.content);
      
      if (result.success) {
        // Post discussion prompt to group
        const discussionPrompt = `📚 <b>Educational content posted!</b>\n\n` +
          `Topic: ${content.title}\n\n` +
          `What questions do you have about this topic? Let's discuss! 👇`;
        await this.sendGroupMessage(discussionPrompt);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error posting educational content:', error);
      throw error;
    }
  }

  // Post market analysis
  async postMarketAnalysis(analysis) {
    try {
      console.log('📊 Posting market analysis to Telegram...');
      
      const message = `📊 <b>MARKET ANALYSIS</b> 📊\n\n` +
        `${analysis.summary}\n\n` +
        `🎯 <b>Recommendation:</b> ${analysis.recommendation}\n` +
        `📈 <b>Confidence:</b> ${Math.round(analysis.confidence * 100)}%\n\n` +
        `#MarketAnalysis #Trading #Solana`;
      
      const result = await this.sendChannelMessage(message);
      
      if (result.success) {
        // Post discussion to group
        const discussionPrompt = `📊 <b>Market analysis posted!</b>\n\n` +
          `What's your take on this analysis? Agree or disagree? Let's discuss! 👇`;
        await this.sendGroupMessage(discussionPrompt);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error posting market analysis:', error);
      throw error;
    }
  }

  // Create and post poll
  async createPoll(question, options) {
    try {
      console.log('📊 Creating Telegram poll...');
      
      if (!this.isConfigured) {
        console.log('📱 [SIMULATION] Poll:', question);
        return { success: true, pollId: 'simulated' };
      }

      const payload = {
        chat_id: this.groupId,
        question: question,
        options: options,
        is_anonymous: false,
        type: 'regular'
      };

      const response = await fetch(`${this.baseUrl}/sendPoll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Poll created');
        return { success: true, pollId: data.result.poll.id };
      } else {
        console.error('❌ Failed to create poll:', data.description);
        return { success: false, error: data.description };
      }
    } catch (error) {
      console.error('❌ Error creating poll:', error);
      return { success: false, error: error.message };
    }
  }

  // Post community spotlight
  async postCommunitySpotlight(spotlightData) {
    try {
      console.log('👥 Posting community spotlight...');
      
      const message = `👥 <b>COMMUNITY SPOTLIGHT</b> 👥\n\n` +
        `${spotlightData.content}\n\n` +
        `🎉 Shoutout to our amazing community!\n\n` +
        `#Community #Memecoin #Solana`;
      
      const result = await this.sendChannelMessage(message);
      
      if (result.success) {
        // Post appreciation message to group
        const appreciation = `👥 <b>Community spotlight posted!</b>\n\n` +
          `Thank you to everyone who contributes to our community! 🙏\n\n` +
          `Keep sharing your insights and helping others! 💪`;
        await this.sendGroupMessage(appreciation);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error posting community spotlight:', error);
      throw error;
    }
  }

  // Send instant alert
  async sendInstantAlert(alertData) {
    try {
      console.log('🚨 Sending instant alert...');
      
      const { type, message, priority } = alertData;
      
      const alertEmoji = {
        'volume-spike': '📈',
        'price-alert': '💰',
        'trend-change': '🔄',
        'breaking-news': '📰',
        'warning': '⚠️'
      };
      
      const emoji = alertEmoji[type] || '🚨';
      const priorityText = priority === 'high' ? '🔴 HIGH PRIORITY' : '🟡 ALERT';
      
      const alertMessage = `${emoji} <b>${priorityText}</b> ${emoji}\n\n` +
        `${message}\n\n` +
        `#Alert #Memecoin #Solana`;
      
      const result = await this.sendChannelMessage(alertMessage);
      
      if (result.success && priority === 'high') {
        // Also send to group for immediate discussion
        await this.sendGroupMessage(`🚨 <b>High priority alert posted!</b>\n\nCheck the channel for details! 👆`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error sending instant alert:', error);
      throw error;
    }
  }

  // Get channel statistics
  async getChannelStats() {
    try {
      if (!this.isConfigured) {
        return {
          memberCount: 0,
          messageCount: 0,
          engagementRate: 0,
          status: 'simulation'
        };
      }

      // Get channel member count
      const memberResponse = await fetch(`${this.baseUrl}/getChatMemberCount?chat_id=${this.channelId}`);
      const memberData = await memberResponse.json();
      
      // Get recent messages (last 24 hours)
      const messagesResponse = await fetch(`${this.baseUrl}/getUpdates`);
      const messagesData = await messagesResponse.json();
      
      const memberCount = memberData.ok ? memberData.result : 0;
      const messageCount = messagesData.ok ? messagesData.result.length : 0;
      
      this.memberCount = memberCount;
      this.messageCount = messageCount;
      this.engagementRate = memberCount > 0 ? (messageCount / memberCount) * 100 : 0;
      
      return {
        memberCount: this.memberCount,
        messageCount: this.messageCount,
        engagementRate: this.engagementRate,
        status: 'active'
      };
    } catch (error) {
      console.error('❌ Error getting channel stats:', error);
      return {
        memberCount: this.memberCount,
        messageCount: this.messageCount,
        engagementRate: this.engagementRate,
        status: 'error'
      };
    }
  }

  // Format volume for display
  formatVolume(volume) {
    if (!volume) return 'N/A';
    
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(0)}K`;
    } else {
      return `$${volume.toFixed(0)}`;
    }
  }

  // Create daily content schedule
  createDailySchedule() {
    const schedule = [];
    const today = new Date();
    
    // Morning educational content
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
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
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
      type: 'analysis',
      content: 'market-analysis'
    });
    
    // Evening community engagement
    schedule.push({
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
      type: 'community',
      content: 'community-spotlight'
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
              console.log('📈 Would post trending update');
              break;
            case 'analysis':
              console.log('📊 Would post market analysis');
              break;
            case 'community':
              console.log('👥 Would post community content');
              break;
          }
        } catch (error) {
          console.error(`❌ Error executing scheduled post ${post.type}:`, error);
        }
      }
    }
  }

  // Get agent status
  getStatus() {
    return {
      name: this.name,
      personality: this.personality,
      goals: this.goals,
      isConfigured: this.isConfigured,
      memberCount: this.memberCount,
      messageCount: this.messageCount,
      engagementRate: this.engagementRate,
      status: 'active'
    };
  }
}

export default TelegramManagerAgent;
