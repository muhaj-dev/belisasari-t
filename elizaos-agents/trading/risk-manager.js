// Risk Management System - Sophisticated risk controls and monitoring
import dotenv from 'dotenv';

dotenv.config();

export class RiskManager {
  constructor() {
    this.riskLimits = {
      maxPositionSize: 0.15, // 15% max per position
      maxDailyLoss: 0.05, // 5% max daily loss
      maxDrawdown: 0.20, // 20% max drawdown
      maxCorrelation: 0.7, // 70% max correlation between positions
      maxVolatility: 0.8, // 80% max portfolio volatility
      minLiquidity: 10000, // $10k min liquidity per position
      maxLeverage: 1.0, // No leverage allowed
      stopLossPercent: 0.15, // 15% stop loss
      takeProfitPercent: 0.30 // 30% take profit
    };
    
    this.riskMetrics = {
      currentDrawdown: 0,
      dailyPnL: 0,
      portfolioVolatility: 0,
      var95: 0,
      var99: 0,
      maxCorrelation: 0,
      concentrationRisk: 0,
      liquidityRisk: 0
    };
    
    this.alertThresholds = {
      drawdown: 0.10, // Alert at 10% drawdown
      dailyLoss: 0.03, // Alert at 3% daily loss
      volatility: 0.60, // Alert at 60% volatility
      correlation: 0.60, // Alert at 60% correlation
      concentration: 0.20 // Alert at 20% concentration
    };
    
    this.alerts = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  // Initialize risk manager
  async initialize() {
    try {
      console.log('🛡️ Initializing Risk Management System...');
      
      // Load risk limits from configuration
      await this.loadRiskLimits();
      
      // Start monitoring
      this.startMonitoring();
      
      console.log('✅ Risk Management System initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Risk Management System:', error);
      return false;
    }
  }

  // Load risk limits from configuration
  async loadRiskLimits() {
    try {
      // This would load from database or configuration file
      // For now, use default limits
      console.log('📋 Risk limits loaded:', this.riskLimits);
    } catch (error) {
      console.error('❌ Error loading risk limits:', error);
    }
  }

  // Start risk monitoring
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performRiskChecks();
    }, 30000); // Check every 30 seconds
    
    console.log('🔍 Risk monitoring started');
  }

  // Stop risk monitoring
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.isMonitoring = false;
    console.log('⏹️ Risk monitoring stopped');
  }

  // Perform comprehensive risk checks
  async performRiskChecks() {
    try {
      // Update risk metrics
      await this.updateRiskMetrics();
      
      // Check all risk limits
      this.checkDrawdownRisk();
      this.checkDailyLossRisk();
      this.checkVolatilityRisk();
      this.checkCorrelationRisk();
      this.checkConcentrationRisk();
      this.checkLiquidityRisk();
      
      // Generate alerts if needed
      this.generateAlerts();
      
    } catch (error) {
      console.error('❌ Error performing risk checks:', error);
    }
  }

  // Update risk metrics
  async updateRiskMetrics() {
    try {
      // This would get real portfolio data
      // For now, simulate some metrics
      this.riskMetrics.currentDrawdown = Math.random() * 0.1; // 0-10%
      this.riskMetrics.dailyPnL = (Math.random() - 0.5) * 0.05; // ±5%
      this.riskMetrics.portfolioVolatility = 0.4 + Math.random() * 0.4; // 40-80%
      this.riskMetrics.var95 = this.calculateVaR(0.95);
      this.riskMetrics.var99 = this.calculateVaR(0.99);
      this.riskMetrics.maxCorrelation = 0.3 + Math.random() * 0.4; // 30-70%
      this.riskMetrics.concentrationRisk = 0.1 + Math.random() * 0.2; // 10-30%
      this.riskMetrics.liquidityRisk = Math.random() * 0.1; // 0-10%
      
    } catch (error) {
      console.error('❌ Error updating risk metrics:', error);
    }
  }

  // Calculate Value at Risk
  calculateVaR(confidence) {
    const portfolioValue = 10000; // Simulated portfolio value
    const volatility = this.riskMetrics.portfolioVolatility;
    const zScore = confidence === 0.95 ? 1.645 : 2.326;
    
    return portfolioValue * volatility * zScore;
  }

  // Check drawdown risk
  checkDrawdownRisk() {
    const currentDrawdown = this.riskMetrics.currentDrawdown;
    const maxDrawdown = this.riskLimits.maxDrawdown;
    
    if (currentDrawdown > maxDrawdown) {
      this.createAlert('CRITICAL', 'Drawdown Limit Exceeded', 
        `Current drawdown: ${(currentDrawdown * 100).toFixed(2)}% exceeds limit: ${(maxDrawdown * 100).toFixed(2)}%`);
    } else if (currentDrawdown > this.alertThresholds.drawdown) {
      this.createAlert('WARNING', 'High Drawdown', 
        `Current drawdown: ${(currentDrawdown * 100).toFixed(2)}% is approaching limit`);
    }
  }

  // Check daily loss risk
  checkDailyLossRisk() {
    const dailyPnL = this.riskMetrics.dailyPnL;
    const maxDailyLoss = this.riskLimits.maxDailyLoss;
    
    if (dailyPnL < -maxDailyLoss) {
      this.createAlert('CRITICAL', 'Daily Loss Limit Exceeded', 
        `Daily P&L: ${(dailyPnL * 100).toFixed(2)}% exceeds limit: ${(-maxDailyLoss * 100).toFixed(2)}%`);
    } else if (dailyPnL < -this.alertThresholds.dailyLoss) {
      this.createAlert('WARNING', 'High Daily Loss', 
        `Daily P&L: ${(dailyPnL * 100).toFixed(2)}% is approaching limit`);
    }
  }

  // Check volatility risk
  checkVolatilityRisk() {
    const volatility = this.riskMetrics.portfolioVolatility;
    const maxVolatility = this.riskLimits.maxVolatility;
    
    if (volatility > maxVolatility) {
      this.createAlert('CRITICAL', 'Volatility Limit Exceeded', 
        `Portfolio volatility: ${(volatility * 100).toFixed(2)}% exceeds limit: ${(maxVolatility * 100).toFixed(2)}%`);
    } else if (volatility > this.alertThresholds.volatility) {
      this.createAlert('WARNING', 'High Volatility', 
        `Portfolio volatility: ${(volatility * 100).toFixed(2)}% is approaching limit`);
    }
  }

  // Check correlation risk
  checkCorrelationRisk() {
    const maxCorrelation = this.riskMetrics.maxCorrelation;
    const maxAllowedCorrelation = this.riskLimits.maxCorrelation;
    
    if (maxCorrelation > maxAllowedCorrelation) {
      this.createAlert('WARNING', 'High Correlation Risk', 
        `Maximum correlation: ${(maxCorrelation * 100).toFixed(2)}% exceeds limit: ${(maxAllowedCorrelation * 100).toFixed(2)}%`);
    }
  }

  // Check concentration risk
  checkConcentrationRisk() {
    const concentration = this.riskMetrics.concentrationRisk;
    const maxPositionSize = this.riskLimits.maxPositionSize;
    
    if (concentration > maxPositionSize) {
      this.createAlert('CRITICAL', 'Concentration Limit Exceeded', 
        `Largest position: ${(concentration * 100).toFixed(2)}% exceeds limit: ${(maxPositionSize * 100).toFixed(2)}%`);
    } else if (concentration > this.alertThresholds.concentration) {
      this.createAlert('WARNING', 'High Concentration', 
        `Largest position: ${(concentration * 100).toFixed(2)}% is approaching limit`);
    }
  }

  // Check liquidity risk
  checkLiquidityRisk() {
    const liquidityRisk = this.riskMetrics.liquidityRisk;
    
    if (liquidityRisk > 0.05) { // 5% threshold
      this.createAlert('WARNING', 'Liquidity Risk', 
        `Liquidity risk: ${(liquidityRisk * 100).toFixed(2)}% - some positions may be illiquid`);
    }
  }

  // Create risk alert
  createAlert(level, type, message) {
    const alert = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      type,
      message,
      acknowledged: false
    };
    
    this.alerts.push(alert);
    console.log(`🚨 ${level} ALERT: ${type} - ${message}`);
    
    // Send notification if critical
    if (level === 'CRITICAL') {
      this.sendCriticalAlert(alert);
    }
  }

  // Send critical alert
  sendCriticalAlert(alert) {
    // This would send notifications via email, SMS, etc.
    console.log(`🚨 CRITICAL ALERT SENT: ${alert.type}`);
  }

  // Generate alerts based on thresholds
  generateAlerts() {
    // Clear old alerts (keep last 100)
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  // Validate trade before execution
  async validateTrade(trade) {
    try {
      const { token, action, positionSize, currentPrice } = trade;
      
      // Check position size limit
      const positionValue = positionSize * currentPrice;
      const portfolioValue = 10000; // Simulated portfolio value
      const positionAllocation = positionValue / portfolioValue;
      
      if (positionAllocation > this.riskLimits.maxPositionSize) {
        return {
          valid: false,
          reason: `Position size ${(positionAllocation * 100).toFixed(2)}% exceeds limit ${(this.riskLimits.maxPositionSize * 100).toFixed(2)}%`
        };
      }
      
      // Check daily loss limit
      if (this.riskMetrics.dailyPnL < -this.riskLimits.maxDailyLoss) {
        return {
          valid: false,
          reason: `Daily loss limit exceeded: ${(this.riskMetrics.dailyPnL * 100).toFixed(2)}%`
        };
      }
      
      // Check drawdown limit
      if (this.riskMetrics.currentDrawdown > this.riskLimits.maxDrawdown) {
        return {
          valid: false,
          reason: `Drawdown limit exceeded: ${(this.riskMetrics.currentDrawdown * 100).toFixed(2)}%`
        };
      }
      
      // Check volatility limit
      if (this.riskMetrics.portfolioVolatility > this.riskLimits.maxVolatility) {
        return {
          valid: false,
          reason: `Volatility limit exceeded: ${(this.riskMetrics.portfolioVolatility * 100).toFixed(2)}%`
        };
      }
      
      // Check liquidity
      if (positionValue < this.riskLimits.minLiquidity) {
        return {
          valid: false,
          reason: `Position value $${positionValue.toFixed(2)} below minimum liquidity $${this.riskLimits.minLiquidity}`
        };
      }
      
      return {
        valid: true,
        reason: 'Trade passed all risk checks'
      };
      
    } catch (error) {
      console.error('❌ Error validating trade:', error);
      return {
        valid: false,
        reason: `Validation error: ${error.message}`
      };
    }
  }

  // Calculate optimal position size
  calculateOptimalPositionSize(signal, portfolioValue) {
    try {
      const { confidence, riskLevel, currentPrice, stopLoss } = signal;
      
      // Base position size (2% of portfolio)
      let baseSize = 0.02;
      
      // Adjust based on confidence
      if (confidence > 0.8) baseSize *= 1.5;
      else if (confidence > 0.6) baseSize *= 1.2;
      else if (confidence < 0.4) baseSize *= 0.5;
      
      // Adjust based on risk level
      if (riskLevel === 'low') baseSize *= 1.2;
      else if (riskLevel === 'high') baseSize *= 0.7;
      
      // Calculate position value
      const positionValue = portfolioValue * baseSize;
      let positionSize = positionValue / currentPrice;
      
      // Apply maximum position size limit
      const maxPositionValue = portfolioValue * this.riskLimits.maxPositionSize;
      const maxPositionSize = maxPositionValue / currentPrice;
      
      positionSize = Math.min(positionSize, maxPositionSize);
      
      // Apply Kelly Criterion (simplified)
      if (stopLoss && currentPrice) {
        const stopLossPercent = Math.abs(currentPrice - stopLoss) / currentPrice;
        const kellySize = (confidence * 2 - 1) / stopLossPercent;
        positionSize = Math.min(positionSize, kellySize * portfolioValue / currentPrice);
      }
      
      return Math.max(0, positionSize);
      
    } catch (error) {
      console.error('❌ Error calculating optimal position size:', error);
      return 0;
    }
  }

  // Calculate stop loss price
  calculateStopLoss(signal) {
    try {
      const { currentPrice, riskLevel } = signal;
      const stopLossPercent = this.riskLimits.stopLossPercent;
      
      // Adjust stop loss based on risk level
      let adjustedStopLoss = stopLossPercent;
      if (riskLevel === 'low') adjustedStopLoss *= 0.8;
      else if (riskLevel === 'high') adjustedStopLoss *= 1.2;
      
      return currentPrice * (1 - adjustedStopLoss);
      
    } catch (error) {
      console.error('❌ Error calculating stop loss:', error);
      return currentPrice * 0.85; // Default 15% stop loss
    }
  }

  // Calculate take profit price
  calculateTakeProfit(signal) {
    try {
      const { currentPrice, riskLevel } = signal;
      const takeProfitPercent = this.riskLimits.takeProfitPercent;
      
      // Adjust take profit based on risk level
      let adjustedTakeProfit = takeProfitPercent;
      if (riskLevel === 'low') adjustedTakeProfit *= 0.8;
      else if (riskLevel === 'high') adjustedTakeProfit *= 1.2;
      
      return currentPrice * (1 + adjustedTakeProfit);
      
    } catch (error) {
      console.error('❌ Error calculating take profit:', error);
      return currentPrice * 1.30; // Default 30% take profit
    }
  }

  // Get risk assessment
  getRiskAssessment() {
    return {
      limits: this.riskLimits,
      metrics: this.riskMetrics,
      alerts: this.alerts.filter(alert => !alert.acknowledged),
      status: this.getRiskStatus()
    };
  }

  // Get risk status
  getRiskStatus() {
    const criticalAlerts = this.alerts.filter(alert => alert.level === 'CRITICAL' && !alert.acknowledged);
    const warningAlerts = this.alerts.filter(alert => alert.level === 'WARNING' && !alert.acknowledged);
    
    if (criticalAlerts.length > 0) {
      return 'CRITICAL';
    } else if (warningAlerts.length > 0) {
      return 'WARNING';
    } else {
      return 'NORMAL';
    }
  }

  // Acknowledge alert
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log(`✅ Alert acknowledged: ${alert.type}`);
    }
  }

  // Update risk limits
  updateRiskLimits(newLimits) {
    this.riskLimits = { ...this.riskLimits, ...newLimits };
    console.log('📋 Risk limits updated:', this.riskLimits);
  }

  // Emergency stop all trading
  emergencyStop() {
    console.log('🚨 EMERGENCY STOP TRIGGERED - All trading halted');
    
    // Create critical alert
    this.createAlert('CRITICAL', 'Emergency Stop', 'All trading has been halted due to risk limits');
    
    // This would trigger emergency stop in trading engine
    return true;
  }

  // Get risk metrics
  getRiskMetrics() {
    return {
      ...this.riskMetrics,
      status: this.getRiskStatus(),
      alertsCount: this.alerts.filter(a => !a.acknowledged).length,
      monitoring: this.isMonitoring
    };
  }

  // Get alerts
  getAlerts(limit = 50) {
    return this.alerts
      .filter(alert => !alert.acknowledged)
      .slice(-limit)
      .reverse();
  }

  // Clear old alerts
  clearOldAlerts() {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffDate);
    console.log('🧹 Old alerts cleared');
  }

  // Get status
  getStatus() {
    return {
      initialized: true,
      monitoring: this.isMonitoring,
      riskStatus: this.getRiskStatus(),
      alertsCount: this.alerts.filter(a => !a.acknowledged).length,
      metrics: this.riskMetrics
    };
  }
}

export default RiskManager;
