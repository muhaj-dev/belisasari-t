// Bitquery Integration for Iris Trading Agent
import dotenv from 'dotenv';

dotenv.config();

export class BitqueryIntegration {
  constructor() {
    this.apiKey = process.env.BITQUERY_API_KEY;
    this.accessToken = process.env.ACCESS_TOKEN;
    this.baseUrl = 'https://streaming.bitquery.io/eap';
  }

  // Fetch trending memecoins from Bitquery
  async fetchTrendingMemecoins() {
    try {
      const query = {
        query: `{
          Solana {
            DEXTrades(
              limitBy: { by: Trade_Buy_Currency_MintAddress, count: 10 }
              orderBy: { descending: Block_Time }
              where: {
                Trade: {
                  Dex: { ProtocolName: { is: "pump" } }
                  Buy: {
                    Currency: {
                      MintAddress: { notIn: ["11111111111111111111111111111111"] }
                    }
                  }
                }
                Transaction: { Result: { Success: true } }
                Block: { Time: { since: "2024-01-01T00:00:00Z" } }
              }
            ) {
              Trade {
                Buy {
                  Price
                  PriceInUSD
                  Currency {
                    Uri
                    MintAddress
                    Name
                    Symbol
                  }
                }
              }
              Block {
                Time
              }
            }
          }
        }`,
        variables: "{}"
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        throw new Error(`Bitquery API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.processMemecoinData(data);
    } catch (error) {
      console.error('Error fetching trending memecoins:', error);
      throw error;
    }
  }

  // Process memecoin data for Iris agent
  processMemecoinData(data) {
    const trades = data?.data?.Solana?.DEXTrades || [];
    
    return trades.map(trade => ({
      mintAddress: trade.Trade.Buy.Currency.MintAddress,
      name: trade.Trade.Buy.Currency.Name,
      symbol: trade.Trade.Buy.Currency.Symbol,
      price: trade.Trade.Buy.Price,
      priceUSD: trade.Trade.Buy.PriceInUSD,
      uri: trade.Trade.Buy.Currency.Uri,
      timestamp: trade.Block.Time,
      // Add Iris-specific analysis
      irisScore: this.calculateIrisScore(trade),
      trendDirection: this.determineTrendDirection(trade),
      riskLevel: this.assessRiskLevel(trade)
    }));
  }

  // Calculate Iris score based on trading activity
  calculateIrisScore(trade) {
    const price = parseFloat(trade.Trade.Buy.PriceInUSD) || 0;
    const volume = price * 1000; // Simplified volume calculation
    
    // Higher score for higher volume and recent activity
    let score = Math.min(volume / 10000, 100); // Cap at 100
    
    // Boost score for recent trades
    const tradeTime = new Date(trade.Block.Time);
    const now = new Date();
    const hoursAgo = (now - tradeTime) / (1000 * 60 * 60);
    
    if (hoursAgo < 1) score *= 1.5;
    else if (hoursAgo < 6) score *= 1.2;
    else if (hoursAgo < 24) score *= 1.1;
    
    return Math.round(score);
  }

  // Determine trend direction
  determineTrendDirection(trade) {
    // This would be enhanced with historical data comparison
    const price = parseFloat(trade.Trade.Buy.PriceInUSD) || 0;
    
    if (price > 0.001) return 'bullish';
    if (price > 0.0001) return 'neutral';
    return 'bearish';
  }

  // Assess risk level
  assessRiskLevel(trade) {
    const price = parseFloat(trade.Trade.Buy.PriceInUSD) || 0;
    
    if (price > 0.01) return 'low';
    if (price > 0.001) return 'medium';
    return 'high';
  }

  // Get token price history
  async getTokenPriceHistory(mintAddress, hours = 24) {
    try {
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      
      const query = {
        query: `{
          Solana {
            DEXTrades(
              where: {
                Trade: {
                  Buy: {
                    Currency: {
                      MintAddress: { is: "${mintAddress}" }
                    }
                  }
                }
                Block: { Time: { since: "${since}" } }
              }
              orderBy: { ascending: Block_Time }
            ) {
              Trade {
                Buy {
                  PriceInUSD
                }
              }
              Block {
                Time
              }
            }
          }
        }`,
        variables: "{}"
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        throw new Error(`Bitquery API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processPriceHistory(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }

  // Process price history data
  processPriceHistory(data) {
    const trades = data?.data?.Solana?.DEXTrades || [];
    
    return trades.map(trade => ({
      price: parseFloat(trade.Trade.Buy.PriceInUSD) || 0,
      timestamp: trade.Block.Time
    }));
  }
}

export default BitqueryIntegration;
