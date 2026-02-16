// Content Generator Agent - Creates engaging social media content
import dotenv from 'dotenv';

dotenv.config();

export class ContentGeneratorAgent {
  constructor() {
    this.name = 'Content Generator Agent';
    this.personality = 'Creative and engaging content creator focused on memecoin education and entertainment';
    this.goals = [
      'Create viral content about trending memecoins',
      'Educate users about trading strategies',
      'Build community engagement through interactive content',
      'Maintain consistent brand voice across platforms'
    ];
    
    this.contentTemplates = {
      trending: {
        twitter: '🔥 TRENDING ALERT! 🔥\n\n📈 {token} is pumping!\n💰 Price: ${price}\n📊 Volume: ${volume}\n🎬 TikTok: {hashtags}\n\n#Solana #Memecoin #Pump #TikTok #Crypto',
        telegram: '🚨 <b>TRENDING ALERT!</b> 🚨\n\n📈 <b>{token}</b> is showing strong momentum!\n💰 <b>Price:</b> ${price}\n📊 <b>24h Volume:</b> ${volume}\n🎬 <b>TikTok Hashtags:</b> {hashtags}\n\n#Solana #Memecoin #Pump'
      },
      educational: {
        twitter: '📚 MEMECOIN EDUCATION 📚\n\n{title}\n\n{content}\n\n💡 Key takeaway: {takeaway}\n\n#MemecoinEducation #TradingTips #Solana',
        telegram: '📚 <b>MEMECOIN EDUCATION</b> 📚\n\n<b>{title}</b>\n\n{content}\n\n💡 <b>Key takeaway:</b> {takeaway}\n\n#MemecoinEducation #TradingTips'
      },
      analysis: {
        twitter: '📊 MARKET ANALYSIS 📊\n\n{analysis}\n\n🎯 Recommendation: {recommendation}\n📈 Confidence: {confidence}%\n\n#MarketAnalysis #Trading #Solana',
        telegram: '📊 <b>MARKET ANALYSIS</b> 📊\n\n{analysis}\n\n🎯 <b>Recommendation:</b> {recommendation}\n📈 <b>Confidence:</b> {confidence}%\n\n#MarketAnalysis #Trading'
      },
      community: {
        twitter: '👥 COMMUNITY SPOTLIGHT 👥\n\n{content}\n\n🎉 Shoutout to our amazing community!\n\n#Community #Memecoin #Solana',
        telegram: '👥 <b>COMMUNITY SPOTLIGHT</b> 👥\n\n{content}\n\n🎉 Shoutout to our amazing community!\n\n#Community #Memecoin'
      }
    };
  }

  // Generate trending alert content
  generateTrendingAlert(data, platform = 'twitter') {
    const { token, price, volume, hashtags } = data;
    
    const template = this.contentTemplates.trending[platform];
    return template
      .replace('{token}', token)
      .replace('{price}', price?.toFixed(6) || 'N/A')
      .replace('{volume}', this.formatVolume(volume))
      .replace('{hashtags}', hashtags?.join(' ') || '#memecoin');
  }

  // Generate educational content
  generateEducationalContent(topic, platform = 'twitter') {
    const educationalTopics = {
      'risk-management': {
        title: 'Risk Management 101',
        content: 'Never invest more than you can afford to lose. Set stop-losses and take-profits. Diversify your portfolio. Remember: memecoins are high-risk, high-reward investments.',
        takeaway: 'Protect your capital first, profits second'
      },
      'technical-analysis': {
        title: 'Reading the Charts',
        content: 'Look for volume spikes, support/resistance levels, and trend patterns. Volume often precedes price movement. Use multiple timeframes for better context.',
        takeaway: 'Volume + Price action = Better decisions'
      },
      'social-sentiment': {
        title: 'Social Media Signals',
        content: 'TikTok trends, Twitter mentions, and community engagement can indicate potential moves. But always verify with on-chain data and technical analysis.',
        takeaway: 'Social sentiment is a tool, not the whole strategy'
      },
      'market-timing': {
        title: 'Timing Your Entries',
        content: 'Enter during dips, not pumps. Look for consolidation patterns before breakouts. Avoid FOMO - there\'s always another opportunity.',
        takeaway: 'Patience beats panic every time'
      }
    };

    const topicData = educationalTopics[topic] || educationalTopics['risk-management'];
    const template = this.contentTemplates.educational[platform];
    
    return template
      .replace('{title}', topicData.title)
      .replace('{content}', topicData.content)
      .replace('{takeaway}', topicData.takeaway);
  }

  // Generate market analysis content
  generateMarketAnalysis(analysis, platform = 'twitter') {
    const template = this.contentTemplates.analysis[platform];
    
    return template
      .replace('{analysis}', analysis.summary)
      .replace('{recommendation}', analysis.recommendation)
      .replace('{confidence}', Math.round(analysis.confidence * 100));
  }

  // Generate community content
  generateCommunityContent(type, data, platform = 'twitter') {
    const communityContent = {
      'success-story': {
        content: `🎉 Success story from our community!\n\n"${data.story}"\n\n- @${data.username}\n\nKeep sharing your wins! 🚀`
      },
      'question': {
        content: `❓ Community Question:\n\n"${data.question}"\n\nWhat are your thoughts? Drop your answers below! 👇`
      },
      'poll': {
        content: `📊 Community Poll:\n\n${data.question}\n\nA) ${data.optionA}\nB) ${data.optionB}\nC) ${data.optionC}\n\nVote and let us know why!`
      },
      'tip': {
        content: `💡 Community Tip:\n\n"${data.tip}"\n\n- Shared by @${data.username}\n\nThanks for sharing your knowledge! 🙏`
      }
    };

    const content = communityContent[type] || communityContent['question'];
    const template = this.contentTemplates.community[platform];
    
    return template.replace('{content}', content.content);
  }

  // Generate thread content for Twitter
  generateThread(topic, data) {
    const threads = {
      'memecoin-guide': [
        '🧵 MEMECOIN TRADING GUIDE 🧵\n\n1/10 Let\'s break down everything you need to know about memecoin trading on Solana!',
        '2/10 What are memecoins?\n\nMemecoins are cryptocurrencies inspired by internet memes, jokes, or viral content. They often have no utility but can generate massive returns.',
        '3/10 Why Solana?\n\n• Low transaction fees\n• Fast transactions\n• High throughput\n• Active DeFi ecosystem\n• Pump.fun integration',
        '4/10 Key platforms:\n\n• Pump.fun - Token creation\n• Jupiter - DEX aggregator\n• Raydium - Liquidity pools\n• Birdeye - Price tracking',
        '5/10 Risk factors:\n\n• High volatility\n• Liquidity issues\n• Rug pulls\n• Market manipulation\n• Regulatory uncertainty',
        '6/10 How to research:\n\n• Check contract on Solscan\n• Verify liquidity\n• Analyze social sentiment\n• Look for red flags\n• Check team background',
        '7/10 Entry strategies:\n\n• Dollar-cost averaging\n• Set stop-losses\n• Take partial profits\n• Don\'t FOMO\n• Have an exit plan',
        '8/10 Technical analysis:\n\n• Volume patterns\n• Support/resistance\n• Trend lines\n• Moving averages\n• RSI indicators',
        '9/10 Social signals:\n\n• TikTok trends\n• Twitter mentions\n• Community engagement\n• Influencer activity\n• News coverage',
        '10/10 Final tips:\n\n• Start small\n• Learn continuously\n• Stay updated\n• Network with others\n• Never invest more than you can lose\n\n#MemecoinGuide #Solana #Trading'
      ],
      'tiktok-trends': [
        '🧵 TIKTOK TREND ANALYSIS 🧵\n\n1/8 How TikTok trends can predict memecoin movements!',
        '2/8 The connection:\n\nTikTok trends often reflect what\'s popular in culture. When memes go viral, related tokens can pump.',
        '3/8 What to look for:\n\n• Hashtag growth\n• Video engagement\n• Creator mentions\n• Comment activity\n• Share velocity',
        '4/8 Timing matters:\n\n• Early trend = Higher potential\n• Peak trend = Higher risk\n• Late trend = Lower returns\n• Dead trend = Avoid',
        '5/8 Key indicators:\n\n• Sudden spike in mentions\n• Celebrity involvement\n• Cross-platform spread\n• Media coverage\n• Community buzz',
        '6/8 Research tools:\n\n• TikTok analytics\n• Social listening tools\n• Google Trends\n• Twitter sentiment\n• Community forums',
        '7/8 Risk management:\n\n• Not all trends translate\n• Timing is crucial\n• Social sentiment changes fast\n• Always verify with data',
        '8/8 Pro tips:\n\n• Follow trendsetters\n• Monitor multiple platforms\n• Set alerts for keywords\n• Track engagement metrics\n• Stay ahead of the curve\n\n#TikTokTrends #Memecoin #Analysis'
      ]
    };

    return threads[topic] || threads['memecoin-guide'];
  }

  // Generate poll content
  generatePoll(question, options, platform = 'twitter') {
    const pollTemplates = {
      twitter: `📊 POLL: ${question}\n\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}\n\nVote and share your reasoning! 👇`,
      telegram: `📊 <b>POLL:</b> ${question}\n\n${options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}\n\nVote and share your reasoning! 👇`
    };

    return pollTemplates[platform];
  }

  // Generate announcement content
  generateAnnouncement(type, data, platform = 'twitter') {
    const announcements = {
      'new-feature': {
        twitter: `🚀 NEW FEATURE ALERT! 🚀\n\n{feature}\n\n{description}\n\nTry it out and let us know what you think! 👇\n\n#NewFeature #Wojat #Memecoin`,
        telegram: `🚀 <b>NEW FEATURE ALERT!</b> 🚀\n\n<b>{feature}</b>\n\n{description}\n\nTry it out and let us know what you think! 👇`
      },
      'partnership': {
        twitter: `🤝 PARTNERSHIP ANNOUNCEMENT! 🤝\n\nWe\'re excited to partner with {partner}!\n\n{details}\n\n#Partnership #Wojat #Memecoin`,
        telegram: `🤝 <b>PARTNERSHIP ANNOUNCEMENT!</b> 🤝\n\nWe\'re excited to partner with <b>{partner}</b>!\n\n{details}`
      },
      'milestone': {
        twitter: `🎉 MILESTONE ACHIEVED! 🎉\n\n{milestone}\n\nThank you to our amazing community! 🙏\n\n#Milestone #Wojat #Community`,
        telegram: `🎉 <b>MILESTONE ACHIEVED!</b> �🎉\n\n{milestone}\n\nThank you to our amazing community! 🙏`
      }
    };

    const announcement = announcements[type] || announcements['new-feature'];
    const template = announcement[platform];
    
    return template
      .replace('{feature}', data.feature || 'New Feature')
      .replace('{description}', data.description || 'Check it out!')
      .replace('{partner}', data.partner || 'Our Partner')
      .replace('{details}', data.details || 'Exciting collaboration ahead!')
      .replace('{milestone}', data.milestone || 'Amazing achievement!');
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

  // Generate content based on current trends
  async generateTrendBasedContent(trends, platform = 'twitter') {
    const content = [];
    
    // Generate trending alert
    if (trends.topToken) {
      content.push({
        type: 'trending',
        content: this.generateTrendingAlert(trends.topToken, platform),
        priority: 'high'
      });
    }

    // Generate educational content
    const educationalTopics = ['risk-management', 'technical-analysis', 'social-sentiment', 'market-timing'];
    const randomTopic = educationalTopics[Math.floor(Math.random() * educationalTopics.length)];
    content.push({
      type: 'educational',
      content: this.generateEducationalContent(randomTopic, platform),
      priority: 'medium'
    });

    // Generate community poll
    const pollQuestions = [
      'What\'s your biggest challenge in memecoin trading?',
      'Which platform do you use most for research?',
      'What\'s your preferred risk level?',
      'How long do you typically hold memecoins?'
    ];
    const randomQuestion = pollQuestions[Math.floor(Math.random() * pollQuestions.length)];
    const pollOptions = [
      ['Fear of missing out', 'Risk management', 'Timing entries', 'Finding good projects'],
      ['TikTok', 'Twitter', 'Telegram', 'Community Forums'],
      ['Conservative', 'Moderate', 'Aggressive', 'YOLO'],
      ['Minutes', 'Hours', 'Days', 'Weeks']
    ];
    const randomOptions = pollOptions[Math.floor(Math.random() * pollOptions.length)];
    
    content.push({
      type: 'poll',
      content: this.generatePoll(randomQuestion, randomOptions, platform),
      priority: 'low'
    });

    return content;
  }

  // Get agent status
  getStatus() {
    return {
      name: this.name,
      personality: this.personality,
      goals: this.goals,
      contentTypes: Object.keys(this.contentTemplates),
      status: 'active'
    };
  }
}

export default ContentGeneratorAgent;
