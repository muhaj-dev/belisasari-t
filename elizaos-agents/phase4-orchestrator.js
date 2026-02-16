// Phase 4 Orchestrator - Advanced AI Trading & Portfolio Management
import TradingBotAgent from './trading/trading-bot-agent.js';
import AITradingEngine from './trading/ai-trading-engine.js';
import PortfolioManager from './trading/portfolio-manager.js';
import RiskManager from './trading/risk-manager.js';
import MarketPredictionAI from './trading/market-prediction-ai.js';
import BacktestingEngine from './trading/backtesting-engine.js';
import dotenv from 'dotenv';

dotenv.config();

export class Phase4Orchestrator {
  constructor() {
    this.name = 'Phase 4 Orchestrator';
    this.description = 'Advanced AI Trading & Portfolio Management System';
    this.version = '4.0.0';
    
    // Initialize trading components
    this.tradingBot = new TradingBotAgent();
    this.tradingEngine = new AITradingEngine();
    this.portfolioManager = new PortfolioManager();
    this.riskManager = new RiskManager();
    this.marketPredictionAI = new MarketPredictionAI();
    this.backtestingEngine = new BacktestingEngine();
    
    this.components = [
      this.tradingBot,
      this.tradingEngine,
      this.portfolioManager,
      this.riskManager,
      this.marketPredictionAI,
      this.backtestingEngine
    ];
    
    this.isRunning = false;
    this.systemHealth = {
      status: 'initializing',
      components: {},
      lastUpdate: new Date()
    };
  }

  // Initialize Phase 4 system
  async initialize() {
    try {
      console.log('🚀 Initializing Phase 4: Advanced AI Trading & Portfolio Management...\n');
      
      // Initialize all components
      const initResults = await Promise.allSettled([
        this.tradingBot.initialize(),
        this.tradingEngine.initialize(),
        this.portfolioManager.initialize(),
        this.riskManager.initialize(),
        this.marketPredictionAI.initialize(),
        this.backtestingEngine.initialize()
      ]);

      const successCount = initResults.filter(result => result.status === 'fulfilled' && result.value).length;
      console.log(`✅ ${successCount}/${initResults.length} components initialized`);

      // Update system health
      this.updateSystemHealth();
      
      if (successCount >= 3) {
        console.log('✅ Phase 4 system initialized successfully');
        return true;
      } else {
        console.log('⚠️ Phase 4 system initialized with limited functionality');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Phase 4 system:', error);
      return false;
    }
  }

  // Start autonomous trading system
  async startTradingSystem() {
    try {
      if (this.isRunning) {
        console.log('⚠️ Trading system is already running');
        return;
      }

      console.log('🚀 Starting autonomous trading system...\n');
      
      // Start trading bot
      await this.tradingBot.startTrading();
      
      // Start monitoring
      this.startSystemMonitoring();
      
      this.isRunning = true;
      console.log('✅ Autonomous trading system started');
      
    } catch (error) {
      console.error('❌ Error starting trading system:', error);
      throw error;
    }
  }

  // Stop trading system
  async stopTradingSystem() {
    try {
      console.log('⏹️ Stopping trading system...');
      
      // Stop trading bot
      await this.tradingBot.stopTrading();
      
      // Stop monitoring
      this.stopSystemMonitoring();
      
      this.isRunning = false;
      console.log('✅ Trading system stopped');
      
    } catch (error) {
      console.error('❌ Error stopping trading system:', error);
    }
  }

  // Start system monitoring
  startSystemMonitoring() {
    if (this.monitoringInterval) return;
    
    this.monitoringInterval = setInterval(() => {
      this.performSystemHealthCheck();
    }, 60000); // Check every minute
    
    console.log('🔍 System monitoring started');
  }

  // Stop system monitoring
  stopSystemMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('⏹️ System monitoring stopped');
  }

  // Perform system health check
  async performSystemHealthCheck() {
    try {
      // Check component health
      const componentHealth = {};
      
      for (const component of this.components) {
        try {
          const status = component.getStatus ? component.getStatus() : { status: 'unknown' };
          componentHealth[component.constructor.name] = {
            status: status.status || 'healthy',
            lastCheck: new Date()
          };
        } catch (error) {
          componentHealth[component.constructor.name] = {
            status: 'error',
            error: error.message,
            lastCheck: new Date()
          };
        }
      }
      
      // Update system health
      this.systemHealth = {
        status: this.determineOverallStatus(componentHealth),
        components: componentHealth,
        lastUpdate: new Date()
      };
      
      // Log health status
      if (this.systemHealth.status !== 'healthy') {
        console.log(`⚠️ System health: ${this.systemHealth.status}`);
      }
      
    } catch (error) {
      console.error('❌ Error performing health check:', error);
    }
  }

  // Determine overall system status
  determineOverallStatus(componentHealth) {
    const statuses = Object.values(componentHealth).map(c => c.status);
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.every(s => s === 'healthy' || s === 'unknown')) return 'healthy';
    
    return 'unknown';
  }

  // Update system health
  updateSystemHealth() {
    this.systemHealth = {
      status: 'healthy',
      components: {},
      lastUpdate: new Date()
    };
  }

  // Execute trading strategy
  async executeStrategy(strategyName, parameters = {}) {
    try {
      console.log(`📈 Executing strategy: ${strategyName}`);
      
      // Get market analysis
      const marketAnalysis = await this.getMarketAnalysis();
      
      // Generate trading signals
      const signals = await this.generateTradingSignals(strategyName, parameters);
      
      // Execute trades
      const results = [];
      for (const signal of signals) {
        try {
          const trade = await this.tradingEngine.executeTrade(signal);
          results.push(trade);
        } catch (error) {
          console.error(`❌ Error executing trade for ${signal.token}:`, error);
        }
      }
      
      console.log(`✅ Strategy executed: ${results.length} trades`);
      return results;
      
    } catch (error) {
      console.error('❌ Error executing strategy:', error);
      throw error;
    }
  }

  // Generate trading signals
  async generateTradingSignals(strategyName, parameters) {
    try {
      const signals = [];
      const tokens = ['SOL', 'BONK', 'WIF', 'PEPE'];
      
      for (const token of tokens) {
        // Get market prediction
        const prediction = await this.marketPredictionAI.predictTrend(token, '1h');
        
        if (prediction.confidence > 0.6) {
          const signal = {
            token,
            strategy: strategyName,
            action: prediction.direction === 'bullish' ? 'buy' : 'sell',
            currentPrice: await this.tradingEngine.getCurrentPrice(token),
            targetPrice: prediction.priceTarget,
            stopLoss: prediction.stopLoss,
            confidence: prediction.confidence,
            riskLevel: this.calculateRiskLevel(prediction.confidence),
            reason: `Strategy: ${strategyName}`,
            timestamp: new Date()
          };
          
          signals.push(signal);
        }
      }
      
      return signals;
    } catch (error) {
      console.error('❌ Error generating signals:', error);
      return [];
    }
  }

  // Calculate risk level
  calculateRiskLevel(confidence) {
    if (confidence > 0.8) return 'low';
    if (confidence > 0.6) return 'medium';
    return 'high';
  }

  // Get market analysis
  async getMarketAnalysis() {
    try {
      const analysis = {
        timestamp: new Date(),
        predictions: {},
        patterns: {},
        sentiment: {},
        volatility: {}
      };
      
      const tokens = ['SOL', 'BONK', 'WIF', 'PEPE'];
      
      for (const token of tokens) {
        try {
          // Get trend prediction
          analysis.predictions[token] = await this.marketPredictionAI.predictTrend(token, '1h');
          
          // Get patterns
          analysis.patterns[token] = await this.marketPredictionAI.identifyPatterns(token);
          
          // Get sentiment
          analysis.sentiment[token] = this.marketPredictionAI.getSentimentScore(token);
          
          // Get volatility
          analysis.volatility[token] = await this.marketPredictionAI.predictVolatility(token, '1h');
          
        } catch (error) {
          console.error(`❌ Error analyzing ${token}:`, error);
        }
      }
      
      return analysis;
    } catch (error) {
      console.error('❌ Error getting market analysis:', error);
      return null;
    }
  }

  // Get portfolio performance
  getPortfolioPerformance() {
    try {
      const portfolio = this.portfolioManager.getPortfolioSummary();
      const performance = this.portfolioManager.getPerformance();
      const riskAssessment = this.portfolioManager.getRiskAssessment();
      
      return {
        portfolio,
        performance,
        riskAssessment,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error getting portfolio performance:', error);
      return null;
    }
  }

  // Get trading performance
  getTradingPerformance() {
    try {
      const tradingMetrics = this.tradingEngine.getPerformanceMetrics();
      const riskMetrics = this.riskManager.getRiskMetrics();
      const botStatus = this.tradingBot.getTradingStatus();
      
      return {
        trading: tradingMetrics,
        risk: riskMetrics,
        bot: botStatus,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error getting trading performance:', error);
      return null;
    }
  }

  // Rebalance portfolio
  async rebalancePortfolio() {
    try {
      console.log('⚖️ Rebalancing portfolio...');
      
      const result = await this.portfolioManager.rebalancePortfolio();
      
      console.log('✅ Portfolio rebalanced');
      return result;
      
    } catch (error) {
      console.error('❌ Error rebalancing portfolio:', error);
      throw error;
    }
  }

  // Optimize portfolio allocation
  async optimizePortfolio() {
    try {
      console.log('🎯 Optimizing portfolio allocation...');
      
      const result = await this.portfolioManager.optimizeAllocation();
      
      console.log('✅ Portfolio optimized');
      return result;
      
    } catch (error) {
      console.error('❌ Error optimizing portfolio:', error);
      throw error;
    }
  }

  // Get risk assessment
  getRiskAssessment() {
    try {
      const riskMetrics = this.riskManager.getRiskMetrics();
      const portfolioRisk = this.portfolioManager.getRiskAssessment();
      const alerts = this.riskManager.getAlerts();
      
      return {
        riskMetrics,
        portfolioRisk,
        alerts,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error getting risk assessment:', error);
      return null;
    }
  }

  // Emergency stop
  async emergencyStop() {
    try {
      console.log('🚨 EMERGENCY STOP TRIGGERED');
      
      // Stop trading system
      await this.stopTradingSystem();
      
      // Emergency stop trading engine
      await this.tradingEngine.emergencyStop();
      
      // Send alerts
      console.log('🚨 All trading activities stopped');
      
    } catch (error) {
      console.error('❌ Error in emergency stop:', error);
    }
  }

  // Test all components
  async testAllComponents() {
    console.log('🧪 Testing all Phase 4 components...\n');
    
    const testResults = {};
    
    // Test Trading Bot
    console.log('1️⃣ Testing Trading Bot Agent...');
    try {
      const status = this.tradingBot.getStatus();
      testResults.tradingBot = {
        success: true,
        status: status.initialized ? 'initialized' : 'not initialized',
        strategies: status.strategies?.length || 0
      };
      console.log(`   ✅ Trading Bot: ${status.initialized ? 'Initialized' : 'Not initialized'}`);
    } catch (error) {
      testResults.tradingBot = { success: false, error: error.message };
      console.log('   ❌ Trading Bot: Failed');
    }
    
    // Test Trading Engine
    console.log('2️⃣ Testing AI Trading Engine...');
    try {
      const status = this.tradingEngine.getStatus();
      testResults.tradingEngine = {
        success: true,
        initialized: status.initialized,
        walletConnected: status.walletConnected,
        totalTrades: status.totalTrades
      };
      console.log(`   ✅ Trading Engine: ${status.initialized ? 'Initialized' : 'Not initialized'}`);
    } catch (error) {
      testResults.tradingEngine = { success: false, error: error.message };
      console.log('   ❌ Trading Engine: Failed');
    }
    
    // Test Portfolio Manager
    console.log('3️⃣ Testing Portfolio Manager...');
    try {
      const status = this.portfolioManager.getStatus();
      testResults.portfolioManager = {
        success: true,
        initialized: status.initialized,
        totalValue: status.totalValue,
        positions: status.positions
      };
      console.log(`   ✅ Portfolio Manager: ${status.initialized ? 'Initialized' : 'Not initialized'}`);
    } catch (error) {
      testResults.portfolioManager = { success: false, error: error.message };
      console.log('   ❌ Portfolio Manager: Failed');
    }
    
    // Test Risk Manager
    console.log('4️⃣ Testing Risk Manager...');
    try {
      const status = this.riskManager.getStatus();
      testResults.riskManager = {
        success: true,
        initialized: status.initialized,
        monitoring: status.monitoring,
        riskStatus: status.riskStatus
      };
      console.log(`   ✅ Risk Manager: ${status.initialized ? 'Initialized' : 'Not initialized'}`);
    } catch (error) {
      testResults.riskManager = { success: false, error: error.message };
      console.log('   ❌ Risk Manager: Failed');
    }
    
    // Test Market Prediction AI
    console.log('5️⃣ Testing Market Prediction AI...');
    try {
      const status = this.marketPredictionAI.getStatus();
      testResults.marketPredictionAI = {
        success: true,
        initialized: status.initialized,
        models: status.models,
        predictions: status.predictions
      };
      console.log(`   ✅ Market Prediction AI: ${status.initialized ? 'Initialized' : 'Not initialized'}`);
    } catch (error) {
      testResults.marketPredictionAI = { success: false, error: error.message };
      console.log('   ❌ Market Prediction AI: Failed');
    }
    
    console.log('\n📊 Test Results Summary:');
    const successCount = Object.values(testResults).filter(result => result.success).length;
    const totalCount = Object.keys(testResults).length;
    console.log(`   ✅ Successful: ${successCount}/${totalCount}`);
    
    return testResults;
  }

  // Get system status
  getSystemStatus() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      running: this.isRunning,
      health: this.systemHealth,
      components: this.components.map(c => ({
        name: c.constructor.name,
        status: c.getStatus ? c.getStatus() : { status: 'unknown' }
      })),
      timestamp: new Date()
    };
  }

  // Run backtest for strategy
  async runBacktest(strategyId, token, startDate, endDate, initialCapital = 10000) {
    try {
      console.log(`🧪 Running backtest: ${strategyId} for ${token}`);
      
      const result = await this.backtestingEngine.runBacktest(strategyId, token, startDate, endDate, initialCapital);
      
      console.log(`✅ Backtest completed: ${(result.metrics.totalReturn * 100).toFixed(2)}% return`);
      return result;
      
    } catch (error) {
      console.error('❌ Error running backtest:', error);
      throw error;
    }
  }

  // Compare strategies
  async compareStrategies(token, startDate, endDate, initialCapital = 10000) {
    try {
      console.log(`📊 Comparing strategies for ${token}`);
      
      const results = await this.backtestingEngine.compareStrategies(token, startDate, endDate, initialCapital);
      
      console.log(`✅ Strategy comparison completed: ${results.length} strategies tested`);
      return results;
      
    } catch (error) {
      console.error('❌ Error comparing strategies:', error);
      throw error;
    }
  }

  // Get backtest results
  getBacktestResults() {
    return this.backtestingEngine.getResults();
  }

  // Get strategy summary
  getStrategySummary() {
    return this.backtestingEngine.getStrategySummary();
  }

  // Get comprehensive report
  getComprehensiveReport() {
    try {
      const systemStatus = this.getSystemStatus();
      const portfolioPerformance = this.getPortfolioPerformance();
      const tradingPerformance = this.getTradingPerformance();
      const riskAssessment = this.getRiskAssessment();
      const marketAnalysis = this.getMarketAnalysis();
      const backtestResults = this.getBacktestResults();
      const strategySummary = this.getStrategySummary();
      
      return {
        system: systemStatus,
        portfolio: portfolioPerformance,
        trading: tradingPerformance,
        risk: riskAssessment,
        market: marketAnalysis,
        backtesting: {
          results: backtestResults,
          strategySummary: strategySummary
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error generating comprehensive report:', error);
      return null;
    }
  }
}

// Main execution function
export async function main() {
  console.log('🚀 Starting Phase 4: Advanced AI Trading & Portfolio Management...\n');

  try {
    // Create orchestrator
    const orchestrator = new Phase4Orchestrator();
    
    // Initialize system
    await orchestrator.initialize();
    
    // Test all components
    console.log('\n🧪 Running comprehensive component tests...');
    const testResults = await orchestrator.testAllComponents();
    
    // Get system status
    console.log('\n📊 Phase 4 System Status:');
    const status = orchestrator.getSystemStatus();
    console.log(`   Name: ${status.name}`);
    console.log(`   Version: ${status.version}`);
    console.log(`   Running: ${status.running ? 'Yes' : 'No'}`);
    console.log(`   Health: ${status.health.status}`);
    console.log(`   Components: ${status.components.length} active`);
    
    // Get comprehensive report
    console.log('\n📈 Generating comprehensive report...');
    const report = orchestrator.getComprehensiveReport();
    
    if (report) {
      console.log('✅ Comprehensive report generated');
      console.log(`   Portfolio Value: $${report.portfolio?.portfolio?.totalValue?.toFixed(2) || 'N/A'}`);
      console.log(`   Total Return: ${report.portfolio?.performance?.totalReturn?.toFixed(2) || 'N/A'}%`);
      console.log(`   Risk Status: ${report.risk?.riskMetrics?.status || 'N/A'}`);
      console.log(`   Active Positions: ${report.trading?.trading?.activePositions || 0}`);
    }
    
    console.log('\n🎉 Phase 4 implementation complete!');
    console.log('\nNext steps:');
    console.log('1. Start autonomous trading with: orchestrator.startTradingSystem()');
    console.log('2. Monitor performance with: orchestrator.getSystemStatus()');
    console.log('3. Get comprehensive report with: orchestrator.getComprehensiveReport()');
    console.log('4. Execute strategies with: orchestrator.executeStrategy(strategyName)');
    
  } catch (error) {
    console.error('❌ Fatal error in Phase 4:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url.endsWith('phase4-orchestrator.js')) {
  main();
}
