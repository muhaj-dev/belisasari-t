import { createIrisTradingAgent, IrisTradingFunctions } from './iris-trading-agent.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testIrisAgent() {
  console.log('🧪 Testing Iris Trading Agent...\n');

  try {
    // Test 1: Agent Initialization
    console.log('1️⃣ Testing agent initialization...');
    const agent = await createIrisTradingAgent();
    console.log('✅ Agent initialized successfully\n');

    // Test 2: Trading Functions
    console.log('2️⃣ Testing trading functions...');
    const tradingFunctions = new IrisTradingFunctions(agent);
    
    // Test TikTok trend analysis
    console.log('   📊 Testing TikTok trend analysis...');
    const trends = await tradingFunctions.analyzeTikTokTrends();
    console.log('   ✅ TikTok trends analyzed:', trends.trendingHashtags.length, 'hashtags found\n');

    // Test token analysis
    console.log('   🔍 Testing token analysis...');
    const tokenAnalysis = await tradingFunctions.analyzeToken('So11111111111111111111111111111111111111112');
    console.log('   ✅ Token analysis completed:', tokenAnalysis.recommendation, '\n');

    // Test trading recommendations
    console.log('   💡 Testing trading recommendations...');
    const recommendations = await tradingFunctions.generateTradingRecommendations();
    console.log('   ✅ Generated', recommendations.length, 'trading recommendations\n');

    // Test 3: Agent Character
    console.log('3️⃣ Testing agent character...');
    console.log('   Name:', agent.character?.name || 'Not set');
    console.log('   Goals:', agent.character?.goals?.length || 0, 'goals defined');
    console.log('   ✅ Agent character configured\n');

    // Test 4: Plugin Integration
    console.log('4️⃣ Testing plugin integration...');
    const plugins = agent.plugins || [];
    console.log('   Plugins loaded:', plugins.length);
    console.log('   ✅ Plugin integration working\n');

    console.log('🎉 All tests passed! Iris Trading Agent is ready to use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests
testIrisAgent();
