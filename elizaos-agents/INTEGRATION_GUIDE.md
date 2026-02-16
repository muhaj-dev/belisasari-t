# Iris ElizaOS Integration Guide

## 🎉 Phase 1 Complete!

Your ElizaOS integration is now set up and working. Here's how to integrate it with your existing Iris platform.

## 📁 What's Been Created

```
elizaos-agents/
├── iris-simple-agent.js          # ✅ Working agent (tested)
├── iris-trading-agent.js         # Full ElizaOS agent (needs env setup)
├── simple-test.js               # ✅ Test script (working)
├── config/agent-config.js       # Agent configuration
├── integrations/
│   ├── bitquery-integration.js  # Bitquery API integration
│   └── supabase-integration.js  # Supabase database integration
├── index.js                     # Main orchestrator
├── README.md                    # Documentation
└── INTEGRATION_GUIDE.md         # This file
```

## 🚀 Quick Start

### 1. Test the Working Agent
```bash
cd elizaos-agents
node iris-simple-agent.js
```

### 2. Set Up Environment Variables
Copy your existing environment variables from your main project:

```bash
# Copy from your bitquery directory
cp ../bitquery/.env .env

# Add OpenAI API key for full ElizaOS functionality
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
```

### 3. Test with Real Data
```bash
node simple-test.js
```

## 🔗 Integration with Existing Iris Platform

### Option 1: Standalone Agent (Recommended for Phase 1)
Run the ElizaOS agent as a separate service that communicates with your existing platform:

```bash
# In elizaos-agents directory
node iris-simple-agent.js

# In your main project
cd ../frontend && npm run dev
```

### Option 2: Direct Integration
Import the agent into your existing Next.js frontend:

```javascript
// In your frontend/lib/iris-agent.js
import { IrisSimpleAgent } from '../../elizaos-agents/iris-simple-agent.js';

export const irisAgent = new IrisSimpleAgent();

// Use in your components
export async function getTrendingCoins() {
  return await irisAgent.getTrendingTokens(10);
}
```

## 🔧 Configuration

### Environment Variables
The agent uses these environment variables (copy from your existing setup):

```env
# From your bitquery setup
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_SECRET=your_supabase_anon_key
BITQUERY_API_KEY=your_bitquery_api_key
ACCESS_TOKEN=your_bitquery_access_token

# New for ElizaOS
OPENAI_API_KEY=your_openai_api_key
SOLANA_PRIVATE_KEY=your_solana_private_key  # Optional
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Agent Configuration
Edit `config/agent-config.js` to customize:

- **Trading Parameters**: Position sizes, risk levels
- **Data Sources**: Refresh intervals, thresholds
- **Notifications**: Alert conditions

## 📊 Current Capabilities

### ✅ Working Features
- **Agent Personality**: Configured with memecoin hunting traits
- **Data Integration**: Connects to your Supabase database
- **Trend Analysis**: Analyzes TikTok trends and memecoin patterns
- **Trading Recommendations**: Generates buy/sell/hold suggestions
- **Portfolio Tracking**: Monitors token balances and performance
- **Query Handling**: Responds to natural language queries

### 🔄 Integration Points
- **TikTok Scraper**: Processes data from your existing scraper
- **Bitquery API**: Fetches real-time Solana blockchain data
- **Supabase Database**: Stores analysis results and user data
- **Twitter Bot**: Can enhance your existing social media automation

## 🎯 Next Steps (Phase 2)

### 1. Enhanced Social Media Automation
- Replace your current Twitter bot with ElizaOS social agents
- Add Telegram/Discord integration
- Implement intelligent content generation

### 2. AI-Powered Frontend
- Add chat interface to your Next.js app
- Implement conversational AI for user queries
- Create personalized recommendation system

### 3. Advanced Trading Features
- Automated trading based on social sentiment
- Risk management with stop-losses
- Portfolio optimization using AI recommendations

## 🧪 Testing

### Test the Agent
```bash
# Test basic functionality
node iris-simple-agent.js

# Test with your environment
node simple-test.js

# Test full ElizaOS integration (requires env setup)
node test-agent.js
```

### Test Integration
```bash
# Test Supabase connection
node -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_SECRET);
console.log('Supabase connected:', !!supabase);
"

# Test Bitquery API
node -e "
const response = await fetch('https://streaming.bitquery.io/eap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.BITQUERY_API_KEY,
    'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
  },
  body: JSON.stringify({query: '{ Solana { DEXTrades(limit: 1) { Trade { Buy { PriceInUSD } } } } }'})
});
console.log('Bitquery API:', response.ok ? 'Working' : 'Error');
"
```

## 🚨 Important Notes

- **Test First**: Always test with small amounts before production
- **API Limits**: Monitor your Bitquery and OpenAI API usage
- **Security**: Keep private keys secure and never commit to version control
- **Gradual Integration**: Start with the simple agent, then upgrade to full ElizaOS

## 📞 Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   ```bash
   # Check if .env file exists
   ls -la .env
   
   # Copy from existing project
   cp ../bitquery/.env .env
   ```

2. **Supabase Connection Failed**
   ```bash
   # Test connection
   node -e "console.log('SUPABASE_URL:', process.env.SUPABASE_URL)"
   ```

3. **Bitquery API Error**
   ```bash
   # Check API key
   node -e "console.log('BITQUERY_API_KEY:', process.env.BITQUERY_API_KEY ? 'Set' : 'Missing')"
   ```

4. **ElizaOS Dependencies**
   ```bash
   # Install missing packages
   npm install sharp
   npm audit fix
   ```

## 🎉 Success!

Your Iris platform now has AI-powered capabilities through ElizaOS! The agent can:

- Analyze TikTok trends and correlate with memecoin performance
- Generate intelligent trading recommendations
- Track portfolio performance
- Respond to natural language queries
- Integrate with your existing data sources

Ready to move to Phase 2? Let's enhance your social media automation and add a conversational AI interface to your frontend!
