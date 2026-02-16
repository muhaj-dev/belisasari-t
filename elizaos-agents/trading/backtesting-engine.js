// Backtesting Engine - Strategy validation and testing
import dotenv from 'dotenv';

dotenv.config();

export class BacktestingEngine {
  constructor() {
    this.historicalData = new Map();
    this.strategies = new Map();
    this.results = new Map();
    this.isInitialized = false;
  }

  // Initialize backtesting engine
  async initialize() {
    try {
      console.log('📊 Initializing Backtesting Engine...');
      
      // Load historical data
      await this.loadHistoricalData();
      
      // Load strategies
      await this.loadStrategies();
      
      this.isInitialized = true;
      console.log('✅ Backtesting Engine initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Backtesting Engine:', error);
      return false;
    }
  }

  // Load historical data
  async loadHistoricalData() {
    try {
      console.log('📈 Loading historical data...');
      
      const tokens = ['SOL', 'BONK', 'WIF', 'PEPE'];
      const days = 365; // 1 year of data
      
      for (const token of tokens) {
        const data = this.generateHistoricalData(token, days);
        this.historicalData.set(token, data);
      }
      
      console.log(`✅ Historical data loaded for ${tokens.length} tokens`);
    } catch (error) {
      console.error('❌ Error loading historical data:', error);
    }
  }

  // Generate historical data
  generateHistoricalData(token, days) {
    const data = [];
    const basePrice = this.getBasePrice(token);
    let currentPrice = basePrice;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      
      // Generate realistic price movement
      const volatility = this.getVolatility(token);
      const change = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice * (1 + change);
      
      // Generate volume
      const volume = Math.random() * 1000000;
      
      // Generate sentiment
      const sentiment = Math.random() * 2 - 1;
      
      data.push({
        date,
        open: currentPrice * 0.99,
        high: currentPrice * 1.02,
        low: currentPrice * 0.98,
        close: currentPrice,
        volume,
        sentiment
      });
    }
    
    return data;
  }

  // Get base price for token
  getBasePrice(token) {
    const basePrices = {
      'SOL': 100,
      'BONK': 0.000012,
      'WIF': 2.45,
      'PEPE': 0.000001
    };
    return basePrices[token] || 1.0;
  }

  // Get volatility for token
  getVolatility(token) {
    const volatilities = {
      'SOL': 0.05,
      'BONK': 0.15,
      'WIF': 0.12,
      'PEPE': 0.20
    };
    return volatilities[token] || 0.10;
  }

  // Load strategies
  async loadStrategies() {
    try {
      console.log('📋 Loading trading strategies...');
      
      // Momentum Strategy
      this.strategies.set('momentum', {
        name: 'Momentum Strategy',
        description: 'Trade based on price momentum and volume',
        parameters: {
          lookbackPeriod: 20,
          minVolume: 100000,
          minPriceChange: 0.05,
          confidenceThreshold: 0.7
        },
        execute: this.executeMomentumStrategy.bind(this)
      });

      // Mean Reversion Strategy
      this.strategies.set('mean_reversion', {
        name: 'Mean Reversion Strategy',
        description: 'Trade based on price reversals from extremes',
        parameters: {
          lookbackPeriod: 14,
          rsiOversold: 30,
          rsiOverbought: 70,
          confidenceThreshold: 0.6
        },
        execute: this.executeMeanReversionStrategy.bind(this)
      });

      // Sentiment Strategy
      this.strategies.set('sentiment', {
        name: 'Sentiment Strategy',
        description: 'Trade based on social media sentiment',
        parameters: {
          minSentiment: 0.6,
          minVolume: 500000,
          confidenceThreshold: 0.65
        },
        execute: this.executeSentimentStrategy.bind(this)
      });

      // Pattern Recognition Strategy
      this.strategies.set('pattern', {
        name: 'Pattern Recognition Strategy',
        description: 'Trade based on technical chart patterns',
        parameters: {
          minPatternConfidence: 0.7,
          minTarget: 0.05,
          confidenceThreshold: 0.75
        },
        execute: this.executePatternStrategy.bind(this)
      });

      console.log(`✅ ${this.strategies.size} strategies loaded`);
    } catch (error) {
      console.error('❌ Error loading strategies:', error);
    }
  }

  // Run backtest for strategy
  async runBacktest(strategyId, token, startDate, endDate, initialCapital = 10000) {
    try {
      console.log(`🧪 Running backtest: ${strategyId} for ${token}`);
      
      const strategy = this.strategies.get(strategyId);
      if (!strategy) {
        throw new Error(`Strategy ${strategyId} not found`);
      }

      const data = this.historicalData.get(token);
      if (!data) {
        throw new Error(`No data found for ${token}`);
      }

      // Filter data by date range
      const filteredData = data.filter(d => d.date >= startDate && d.date <= endDate);
      if (filteredData.length === 0) {
        throw new Error('No data in specified date range');
      }

      // Initialize backtest state
      const state = {
        capital: initialCapital,
        position: null,
        trades: [],
        equity: [initialCapital],
        maxDrawdown: 0,
        peak: initialCapital
      };

      // Run strategy on historical data
      for (let i = 0; i < filteredData.length; i++) {
        const currentData = filteredData[i];
        const historicalData = filteredData.slice(0, i + 1);
        
        // Execute strategy
        const signal = await strategy.execute(historicalData, currentData, state);
        
        if (signal) {
          await this.executeSignal(signal, currentData, state);
        }
        
        // Update equity curve
        const currentEquity = this.calculateEquity(state);
        state.equity.push(currentEquity);
        
        // Update drawdown
        if (currentEquity > state.peak) {
          state.peak = currentEquity;
        }
        const drawdown = (state.peak - currentEquity) / state.peak;
        state.maxDrawdown = Math.max(state.maxDrawdown, drawdown);
      }

      // Calculate performance metrics
      const metrics = this.calculatePerformanceMetrics(state, initialCapital);
      
      // Store results
      const result = {
        strategyId,
        token,
        startDate,
        endDate,
        initialCapital,
        finalCapital: state.capital,
        trades: state.trades,
        equity: state.equity,
        metrics
      };
      
      this.results.set(`${strategyId}_${token}_${startDate.getTime()}`, result);
      
      console.log(`✅ Backtest completed: ${strategyId} for ${token}`);
      return result;
      
    } catch (error) {
      console.error('❌ Error running backtest:', error);
      throw error;
    }
  }

  // Execute momentum strategy
  async executeMomentumStrategy(historicalData, currentData, state) {
    const { lookbackPeriod, minVolume, minPriceChange, confidenceThreshold } = this.strategies.get('momentum').parameters;
    
    if (historicalData.length < lookbackPeriod) return null;
    
    const recentData = historicalData.slice(-lookbackPeriod);
    const prices = recentData.map(d => d.close);
    const volumes = recentData.map(d => d.volume);
    
    // Calculate momentum
    const priceChange = (currentData.close - prices[0]) / prices[0];
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    
    if (currentData.volume < minVolume || Math.abs(priceChange) < minPriceChange) {
      return null;
    }
    
    const confidence = Math.min(Math.abs(priceChange) * 2, 0.95);
    
    if (confidence < confidenceThreshold) return null;
    
    return {
      action: priceChange > 0 ? 'buy' : 'sell',
      confidence,
      reason: `Momentum: ${(priceChange * 100).toFixed(2)}% change`,
      stopLoss: currentData.close * (priceChange > 0 ? 0.95 : 1.05),
      takeProfit: currentData.close * (priceChange > 0 ? 1.10 : 0.90)
    };
  }

  // Execute mean reversion strategy
  async executeMeanReversionStrategy(historicalData, currentData, state) {
    const { lookbackPeriod, rsiOversold, rsiOverbought, confidenceThreshold } = this.strategies.get('mean_reversion').parameters;
    
    if (historicalData.length < lookbackPeriod) return null;
    
    const recentData = historicalData.slice(-lookbackPeriod);
    const prices = recentData.map(d => d.close);
    
    // Calculate RSI
    const rsi = this.calculateRSI(prices, lookbackPeriod);
    
    if (rsi < rsiOversold) {
      return {
        action: 'buy',
        confidence: (rsiOversold - rsi) / rsiOversold,
        reason: `RSI oversold: ${rsi.toFixed(2)}`,
        stopLoss: currentData.close * 0.95,
        takeProfit: currentData.close * 1.10
      };
    } else if (rsi > rsiOverbought) {
      return {
        action: 'sell',
        confidence: (rsi - rsiOverbought) / (100 - rsiOverbought),
        reason: `RSI overbought: ${rsi.toFixed(2)}`,
        stopLoss: currentData.close * 1.05,
        takeProfit: currentData.close * 0.90
      };
    }
    
    return null;
  }

  // Execute sentiment strategy
  async executeSentimentStrategy(historicalData, currentData, state) {
    const { minSentiment, minVolume, confidenceThreshold } = this.strategies.get('sentiment').parameters;
    
    if (currentData.sentiment < minSentiment || currentData.volume < minVolume) {
      return null;
    }
    
    const confidence = Math.min(currentData.sentiment, 0.95);
    
    if (confidence < confidenceThreshold) return null;
    
    return {
      action: 'buy',
      confidence,
      reason: `Positive sentiment: ${(currentData.sentiment * 100).toFixed(1)}%`,
      stopLoss: currentData.close * 0.95,
      takeProfit: currentData.close * 1.10
    };
  }

  // Execute pattern strategy
  async executePatternStrategy(historicalData, currentData, state) {
    const { minPatternConfidence, minTarget, confidenceThreshold } = this.strategies.get('pattern').parameters;
    
    // Simple pattern detection
    const patterns = this.detectPatterns(historicalData);
    
    if (patterns.length === 0) return null;
    
    const bestPattern = patterns.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    
    if (bestPattern.confidence < minPatternConfidence) return null;
    
    const targetReturn = (bestPattern.target - currentData.close) / currentData.close;
    if (targetReturn < minTarget) return null;
    
    return {
      action: bestPattern.type.includes('bottom') ? 'buy' : 'sell',
      confidence: bestPattern.confidence,
      reason: `Pattern: ${bestPattern.type}`,
      stopLoss: bestPattern.stopLoss,
      takeProfit: bestPattern.target
    };
  }

  // Detect patterns in data
  detectPatterns(data) {
    const patterns = [];
    
    if (data.length < 20) return patterns;
    
    // Simple double bottom detection
    const recent = data.slice(-20);
    const lows = recent.map(d => d.low);
    const minLow = Math.min(...lows);
    const lowIndices = lows.map((low, i) => low === minLow ? i : -1).filter(i => i !== -1);
    
    if (lowIndices.length >= 2) {
      patterns.push({
        type: 'double_bottom',
        confidence: 0.7,
        target: recent[recent.length - 1].close * 1.05,
        stopLoss: minLow * 0.98
      });
    }
    
    return patterns;
  }

  // Calculate RSI
  calculateRSI(prices, period) {
    if (prices.length < period + 1) return 50;
    
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Execute trading signal
  async executeSignal(signal, currentData, state) {
    if (!signal || signal.confidence < 0.5) return;
    
    const { action, confidence, reason, stopLoss, takeProfit } = signal;
    const price = currentData.close;
    const positionSize = this.calculatePositionSize(state.capital, confidence);
    
    if (action === 'buy' && !state.position) {
      state.position = {
        type: 'long',
        entryPrice: price,
        size: positionSize,
        stopLoss,
        takeProfit,
        entryTime: currentData.date
      };
      
      state.capital -= positionSize * price;
    } else if (action === 'sell' && state.position && state.position.type === 'long') {
      const pnl = (price - state.position.entryPrice) * state.position.size;
      state.capital += state.position.size * price;
      
      state.trades.push({
        entry: state.position.entryPrice,
        exit: price,
        size: state.position.size,
        pnl,
        return: pnl / (state.position.entryPrice * state.position.size),
        entryTime: state.position.entryTime,
        exitTime: currentData.date,
        reason
      });
      
      state.position = null;
    }
  }

  // Calculate position size
  calculatePositionSize(capital, confidence) {
    const baseSize = capital * 0.1; // 10% of capital
    return baseSize * confidence;
  }

  // Calculate current equity
  calculateEquity(state) {
    if (!state.position) return state.capital;
    
    const currentPrice = state.position.entryPrice; // Simplified
    const unrealizedPnL = (currentPrice - state.position.entryPrice) * state.position.size;
    return state.capital + unrealizedPnL;
  }

  // Calculate performance metrics
  calculatePerformanceMetrics(state, initialCapital) {
    const finalCapital = state.capital;
    const totalReturn = (finalCapital - initialCapital) / initialCapital;
    
    const trades = state.trades;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const winRate = trades.length > 0 ? winningTrades.length / trades.length : 0;
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) : 0;
    
    const profitFactor = avgLoss > 0 ? (avgWin * winningTrades.length) / (avgLoss * losingTrades.length) : 0;
    
    // Calculate Sharpe ratio (simplified)
    const returns = state.equity.slice(1).map((equity, i) => 
      (equity - state.equity[i]) / state.equity[i]
    );
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const sharpeRatio = Math.sqrt(variance) > 0 ? avgReturn / Math.sqrt(variance) : 0;
    
    return {
      totalReturn,
      finalCapital,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      maxDrawdown: state.maxDrawdown,
      sharpeRatio,
      avgReturn,
      volatility: Math.sqrt(variance)
    };
  }

  // Compare strategies
  async compareStrategies(token, startDate, endDate, initialCapital = 10000) {
    try {
      console.log(`📊 Comparing strategies for ${token}`);
      
      const results = [];
      
      for (const [strategyId, strategy] of this.strategies) {
        try {
          const result = await this.runBacktest(strategyId, token, startDate, endDate, initialCapital);
          results.push(result);
        } catch (error) {
          console.error(`❌ Error backtesting ${strategyId}:`, error);
        }
      }
      
      // Sort by total return
      results.sort((a, b) => b.metrics.totalReturn - a.metrics.totalReturn);
      
      console.log('📈 Strategy Comparison Results:');
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.strategyId}: ${(result.metrics.totalReturn * 100).toFixed(2)}% return`);
      });
      
      return results;
    } catch (error) {
      console.error('❌ Error comparing strategies:', error);
      return [];
    }
  }

  // Get backtest results
  getResults() {
    return Array.from(this.results.values());
  }

  // Get strategy performance summary
  getStrategySummary() {
    const results = this.getResults();
    const summary = {};
    
    for (const result of results) {
      const key = `${result.strategyId}_${result.token}`;
      if (!summary[key]) {
        summary[key] = {
          strategy: result.strategyId,
          token: result.token,
          totalReturn: result.metrics.totalReturn,
          winRate: result.metrics.winRate,
          sharpeRatio: result.metrics.sharpeRatio,
          maxDrawdown: result.metrics.maxDrawdown,
          totalTrades: result.metrics.totalTrades
        };
      }
    }
    
    return Object.values(summary);
  }

  // Get status
  getStatus() {
    return {
      initialized: this.isInitialized,
      strategies: this.strategies.size,
      historicalData: this.historicalData.size,
      results: this.results.size
    };
  }
}

export default BacktestingEngine;
