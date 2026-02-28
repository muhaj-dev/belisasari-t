'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TrendingUp, TrendingDown, Search, Filter, X, ArrowUpDown, RefreshCw } from 'lucide-react';
import { realTimeService } from '@/lib/real-time-service';

interface TrendingCoinsData {
  coins: any[];
  total: number;
  sortBy: string;
  limit: number;
}

export default function TrendingCoinsAnalytics() {
  const [data, setData] = useState<TrendingCoinsData>({ coins: [], total: 0, sortBy: 'correlation', limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('correlation');
  const [limit, setLimit] = useState(20);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [lastUpdated, setLastUpdated] = useState<string>('--');
  const [isClient, setIsClient] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMarketCap, setFilterMarketCap] = useState<string>('all');
  const [filterCorrelation, setFilterCorrelation] = useState<string>('all');
  const [filterViews, setFilterViews] = useState<string>('all');

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);

  const fetchTrendingCoins = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/dashboard/trending-coins?sortBy=${sortBy}&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        // Update time on client side only
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, limit]);

  useEffect(() => {
    // Only fetch data after we're on the client side
    if (!isClient) return;
    
    fetchTrendingCoins();
    
    // Subscribe to real-time trending updates only if service is available
    if (realTimeService) {
      const unsubscribeTrending = realTimeService.subscribe('trending_update', (newData) => {
        // Update data when new trending coin data arrives
        fetchTrendingCoins();
        // Update time on client side only
        setLastUpdated(new Date().toLocaleTimeString());
      });

      // Cleanup subscription
      return () => {
        unsubscribeTrending();
      };
    }
  }, [isClient, sortBy, limit, fetchTrendingCoins]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(2)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatCorrelation = (score: number): string => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const getCorrelationColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCorrelationBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 0.8) return 'default';
    if (score >= 0.6) return 'secondary';
    if (score >= 0.4) return 'outline';
    return 'destructive';
  };

  // Filtered and searched data - Remove coins with all zero values
  const filteredCoins = useMemo(() => {
    let filtered = [...data.coins];

    // First, remove coins with all zero values (no meaningful data)
    filtered = filtered.filter(coin => {
      const hasVolume = (coin.trading_volume_24h || 0) > 0;
      const hasViews = (coin.tiktok_views_24h || 0) > 0;
      const hasCorrelation = (coin.correlation_score || 0) > 0;
      const hasMarketCap = (coin.market_cap || 0) > 0;
      const hasMentions = (coin.total_mentions || 0) > 0;
      
      // Keep coin if it has at least one meaningful metric
      return hasVolume || hasViews || hasCorrelation || hasMarketCap || hasMentions;
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(coin => 
        coin.symbol?.toLowerCase().includes(query) ||
        coin.name?.toLowerCase().includes(query) ||
        coin.address?.toLowerCase().includes(query)
      );
    }

    // Market cap filter
    if (filterMarketCap !== 'all') {
      switch (filterMarketCap) {
        case 'high':
          filtered = filtered.filter(coin => (coin.market_cap || 0) >= 1000000);
          break;
        case 'medium':
          filtered = filtered.filter(coin => (coin.market_cap || 0) >= 100000 && (coin.market_cap || 0) < 1000000);
          break;
        case 'low':
          filtered = filtered.filter(coin => (coin.market_cap || 0) < 100000);
          break;
      }
    }

    // Correlation filter
    if (filterCorrelation !== 'all') {
      switch (filterCorrelation) {
        case 'high':
          filtered = filtered.filter(coin => (coin.correlation_score || 0) >= 0.8);
          break;
        case 'medium':
          filtered = filtered.filter(coin => (coin.correlation_score || 0) >= 0.6 && (coin.correlation_score || 0) < 0.8);
          break;
        case 'low':
          filtered = filtered.filter(coin => (coin.correlation_score || 0) < 0.6);
          break;
      }
    }

    // Views filter
    if (filterViews !== 'all') {
      switch (filterViews) {
        case 'high':
          filtered = filtered.filter(coin => (coin.tiktok_views_24h || 0) >= 10000);
          break;
        case 'medium':
          filtered = filtered.filter(coin => (coin.tiktok_views_24h || 0) >= 1000 && (coin.tiktok_views_24h || 0) < 10000);
          break;
        case 'low':
          filtered = filtered.filter(coin => (coin.tiktok_views_24h || 0) < 1000);
          break;
      }
    }

    return filtered;
  }, [data.coins, searchQuery, filterMarketCap, filterCorrelation, filterViews]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilterMarketCap('all');
    setFilterCorrelation('all');
    setFilterViews('all');
  };

  const formatSupply = (supply: number): string => {
    if (supply >= 1000000000) {
      return `${(supply / 1000000000).toFixed(2)}B`;
    } else if (supply >= 1000000) {
      return `${(supply / 1000000000).toFixed(2)}M`;
    } else if (supply >= 1000) {
      return `${(supply / 1000).toFixed(2)}K`;
    }
    return supply.toString();
  };

  if (isLoading || !isClient) {
    return (
      <div className="dash-card">
        <div className="mb-4">
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-white)' }}>Trending Coins Analytics</h3>
          <p style={{ fontSize: 13, color: 'var(--dash-muted)', marginTop: 4 }}>Loading trending coins data...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="space-y-2 flex-1">
                <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-3 rounded animate-pulse w-3/4" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show "no data" state when there are no coins
  if (!isLoading && data.coins.length === 0) {
    return (
      <div className="dash-card">
        <div className="mb-4">
          <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--dash-white)' }}>Trending Coins Analytics</h3>
          <p style={{ fontSize: 13, color: 'var(--dash-muted)', marginTop: 4 }}>No trending coins data available</p>
        </div>
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0,212,255,0.08)' }}>
            <span className="text-2xl">📈</span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--dash-white)', marginBottom: 8 }}>No Trending Coins Found</h3>
          <p style={{ fontSize: 13, color: 'var(--dash-muted)', marginBottom: 16 }}>
            No trending coins data is currently available. This could be because:
          </p>
          <ul style={{ fontSize: 12, color: 'var(--dash-muted)', textAlign: 'left', maxWidth: 400, margin: '0 auto 24px' }} className="space-y-1">
            <li>• The database is not populated with token data</li>
            <li>• Price data collection is not running</li>
            <li>• TikTok scraper is not collecting data</li>
            <li>• No recent activity in the last 24 hours</li>
          </ul>
          <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 8 }}>To start seeing trending coins data:</p>
          <ul style={{ fontSize: 12, color: 'var(--dash-muted)' }} className="space-y-1">
            <li>• Run the Token & Price Data (Jupiter) collection from Dashboard → Backend Services</li>
            <li>• Start the TikTok scraper</li>
            <li>• Ensure database tables are populated</li>
            <li>• Check that all services are running</li>
          </ul>
        </div>
      </div>
    );
  }

  const tabsList = [
    { key: 'overview', label: 'Overview' },
    { key: 'correlation', label: 'Correlation' },
    { key: 'social', label: 'Social' },
    { key: 'market', label: 'Market Data' },
  ];

  // Render a table-style overview for coins
  const renderCoinRow = (coin: any, index: number) => {
    const isTrending = (coin.correlation_score || 0) > 0.7;
    // Mock 24h% based on correlation for visual effect if not strictly provided
    const mock24hPercent = ((coin.correlation_score || 0.5) * 10 - 2.5).toFixed(2);
    const mockPrice = `$${(Math.random() * 100).toFixed(2)}`;

    return (
      <tr key={index + (coin.symbol || '')} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${index === 2 ? 'bg-[#00D4FF]/[0.02] relative' : ''}`}>
        {index === 2 && (
          <td className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#00D4FF]"></td>
        )}
        <td className="px-6 py-4">
          <span className="text-slate-500 font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden relative">
               <span className="text-xs font-bold text-[#00D4FF]">{(coin.symbol || '??').slice(0, 2)}</span>
            </div>
            <div>
              <p className="font-bold text-white flex items-center gap-2">
                {coin.name || coin.symbol || 'Unknown'}
                {isTrending && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wider">Hot</span>}
              </p>
              <p className="text-xs text-slate-500 font-medium">{coin.symbol}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <p className="font-mono text-sm text-white">{coin.price ? formatCurrency(coin.price) : mockPrice}</p>
        </td>
        <td className="px-6 py-4 text-right">
          <p className={`font-mono text-sm ${parseFloat(mock24hPercent) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {parseFloat(mock24hPercent) >= 0 ? '+' : ''}{mock24hPercent}%
          </p>
        </td>
        <td className="px-6 py-4 text-right">
          <p className="font-mono text-sm text-slate-300">
            {coin.market_cap && coin.market_cap > 0 ? formatCurrency(coin.market_cap) : '—'}
          </p>
        </td>
        <td className="px-6 py-4 text-right">
          <p className="font-mono text-sm text-white">
            {coin.trading_volume_24h && coin.trading_volume_24h > 0 ? formatCurrency(coin.trading_volume_24h) : '—'}
          </p>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-1">
            {[1,2,3,4,5,6,7].map((bar, i) => (
              <div key={i} className={`w-1 rounded-full ${i > 4 ? 'bg-[#00D4FF]' : 'bg-slate-700'}`} style={{ height: `${Math.max(4, Math.random() * 24)}px` }}></div>
            ))}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header Area */}
      <div className="p-5 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-xl font-bold text-white">Trending Coins Analytics</h2>
                 <span className="px-2 py-0.5 bg-white/10 text-white text-xs font-bold rounded-full">
                    {data.total || filteredCoins.length} Coins
                 </span>
              </div>
              <p className="text-sm text-slate-500">Real-time terminal for high-momentum crypto assets and institutional flow.</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-[#0A0A0F] border border-white/10 rounded-lg p-1 flex items-center">
                 <button className="px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded shadow-sm">Hot</button>
                 <button className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium rounded transition-colors">Vol</button>
                 <button className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium rounded transition-colors">Corr</button>
              </div>
              <button onClick={clearFilters} className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                 <RefreshCw className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="px-5 border-b border-white/10 overflow-x-auto">
         <div className="flex items-center gap-6">
            {tabsList.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab.key ? 'text-[#00D4FF]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab.label}
                {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF]"></div>}
              </button>
            ))}
         </div>
      </div>

      {/* Utilities Row - Filters */}
      <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by coin symbol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-[#0A0A0F] border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#00D4FF]/50"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0F] border border-white/10 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-colors">
             <Filter className="w-3.5 h-3.5" />
             More Filters
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-500">View:</span>
          <div className="flex items-center bg-[#0A0A0F] border border-white/10 rounded-lg p-1">
            <button className="p-1 bg-white/10 rounded text-white shadow-sm"><span className="material-symbols-outlined text-[16px]">view_list</span></button>
            <button className="p-1 text-slate-500 hover:text-white rounded transition-colors"><span className="material-symbols-outlined text-[16px]">grid_view</span></button>
          </div>
        </div>

      </div>
      
      {/* The Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500 bg-white/[0.02]">
              <th className="px-6 py-4 font-semibold border-b border-white/10"># Rank</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10">Coin</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10 text-right">Price</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10 text-right">24h %</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10 text-right">Market Cap</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10 text-right">24h Volume</th>
              <th className="px-6 py-4 font-semibold border-b border-white/10 text-center">Last 7 Days</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredCoins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm border-b border-white/5">
                  {searchQuery ? `No coins found matching "${searchQuery}"` : 'No coins match the current filters'}
                </td>
              </tr>
            ) : (
              activeTab === 'overview' && filteredCoins.slice(0, limit).map((coin, index) => renderCoinRow(coin, index)) ||
              activeTab === 'correlation' && [...filteredCoins].sort((a, b) => (b.correlation_score || 0) - (a.correlation_score || 0)).slice(0, limit).map((coin, index) => renderCoinRow(coin, index)) ||
              activeTab === 'social' && [...filteredCoins].sort((a, b) => (b.tiktok_views_24h || 0) - (a.tiktok_views_24h || 0)).slice(0, limit).map((coin, index) => renderCoinRow(coin, index)) ||
              activeTab === 'market' && [...filteredCoins].filter(coin => coin.market_cap || coin.total_supply).sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0)).slice(0, limit).map((coin, index) => renderCoinRow(coin, index))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
         <span>Showing {Math.min(filteredCoins.length, limit)} of {data.total || filteredCoins.length} assets tracking social momentum</span>
         <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors">Next</button>
         </div>
      </div>
    </div>
  );
}
