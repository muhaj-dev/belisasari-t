'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { realTimeService } from '@/lib/real-time-service';
import { telegramViewsService } from '@/lib/telegram-views-service';
import { tiktokHashtagsService } from '@/lib/tiktok-hashtags-service';

interface RealTimeData {
  tiktok: {
    recentVideos: number;
    totalViews: number;
    trendingTokens: string[];
    trendingHashtags: Array<{
      hashtag: string;
      count: number;
      totalViews: number;
      avgViews: number;
    }>;
  };
  telegram: {
    recentMessages: number;
    activeChannels: number;
    trendingKeywords: string[];
  };
  patternAnalysis: {
    lastAnalysis: string;
    correlations: number;
    recommendations: number;
  };
}

export default function RealTimeData() {
  const [data, setData] = useState<RealTimeData>({
    tiktok: { recentVideos: 0, totalViews: 0, trendingTokens: [], trendingHashtags: [] },
    telegram: { recentMessages: 0, activeChannels: 0, trendingKeywords: [] },
    patternAnalysis: { lastAnalysis: 'Never', correlations: 0, recommendations: 0 }
  });
  const [formattedLastAnalysis, setFormattedLastAnalysis] = useState<string>('Never');
  const [isClient, setIsClient] = useState(false);
  const [telegramConnectionStatus, setTelegramConnectionStatus] = useState<{
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
  }>({
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0
  });
  const [tiktokHashtagsConnectionStatus, setTiktokHashtagsConnectionStatus] = useState<{
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
  }>({
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0
  });

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only fetch data after we're on the client side
    if (!isClient) return;
    
    // Initial data fetch
    fetchRealTimeData();
    
    // Subscribe to real-time updates only if service is available
    if (realTimeService) {
      const unsubscribeTiktok = realTimeService.subscribe('tiktok_update', (newData) => {
        setData(prev => ({
          ...prev,
          tiktok: {
            ...prev.tiktok,
            recentVideos: prev.tiktok.recentVideos + 1,
            totalViews: prev.tiktok.totalViews + (newData.views || 0),
            trendingTokens: Array.from(new Set([...prev.tiktok.trendingTokens, ...(newData.mentions?.map((m: { tokens?: { symbol?: string } }) => m?.tokens?.symbol || 'Unknown') || [])])).slice(0, 5)
          }
        }));
      });

      const unsubscribeTrending = realTimeService.subscribe('trending_update', (newData) => {
        // Update trending coins data in real-time
        console.log('New trending coin data:', newData);
      });

      // Cleanup subscriptions
      return () => {
        unsubscribeTiktok();
        unsubscribeTrending();
      };
    }
  }, [isClient]);

  // Telegram real-time subscription
  useEffect(() => {
    if (!isClient) return;

    // Subscribe to Telegram real-time updates
    const unsubscribeTelegram = telegramViewsService.subscribe((telegramData) => {
      setData(prev => ({
        ...prev,
        telegram: {
          recentMessages: telegramData.totalMessages,
          activeChannels: telegramData.activeChannels,
          trendingKeywords: telegramData.keywords.slice(0, 5)
        }
      }));
    });

    // Update connection status
    const updateConnectionStatus = () => {
      setTelegramConnectionStatus(telegramViewsService.getConnectionStatus());
    };

    // Check connection status periodically
    const statusInterval = setInterval(updateConnectionStatus, 5000);
    updateConnectionStatus(); // Initial check

    return () => {
      unsubscribeTelegram();
      clearInterval(statusInterval);
    };
  }, [isClient]);

  // TikTok hashtags real-time subscription
  useEffect(() => {
    if (!isClient) return;

    // Subscribe to TikTok hashtags real-time updates
    const unsubscribeTiktokHashtags = tiktokHashtagsService.subscribe((hashtagsData) => {
      setData(prev => ({
        ...prev,
        tiktok: {
          ...prev.tiktok,
          trendingHashtags: hashtagsData.hashtags.slice(0, 10) // Top 10 hashtags
        }
      }));
    });

    // Update connection status
    const updateHashtagsConnectionStatus = () => {
      setTiktokHashtagsConnectionStatus(tiktokHashtagsService.getConnectionStatus());
    };

    // Check connection status periodically
    const hashtagsStatusInterval = setInterval(updateHashtagsConnectionStatus, 5000);
    updateHashtagsConnectionStatus(); // Initial check

    return () => {
      unsubscribeTiktokHashtags();
      clearInterval(hashtagsStatusInterval);
    };
  }, [isClient]);

  // Update formatted time whenever lastAnalysis changes
  useEffect(() => {
    if (data.patternAnalysis.lastAnalysis && data.patternAnalysis.lastAnalysis !== 'Never') {
      const formatTimeAgo = (timestamp: string) => {
        try {
          const date = new Date(timestamp);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          
          if (diffMins < 60) return `${diffMins}m ago`;
          if (diffHours < 24) return `${diffHours}h ago`;
          return '1d+ ago';
        } catch {
          return timestamp;
        }
      };
      
      setFormattedLastAnalysis(formatTimeAgo(data.patternAnalysis.lastAnalysis));
    } else {
      setFormattedLastAnalysis('Never');
    }
  }, [data.patternAnalysis.lastAnalysis]);

  const fetchRealTimeData = async () => {
    try {
      // Fetch recent TikTok data
      const tiktokResponse = await fetch('/api/supabase/get-tiktoks?limit=5');
      if (tiktokResponse.ok) {
        const tiktokResponseData = await tiktokResponse.json();
        const tiktokData = Array.isArray(tiktokResponseData.data) ? tiktokResponseData.data : [];
        
        setData(prev => ({
          ...prev,
          tiktok: {
            recentVideos: tiktokData.length,
            totalViews: tiktokData.reduce((sum: number, video: { views?: number; mentions?: Array<{ tokens?: { symbol?: string } }> }) => sum + (video?.views || 0), 0),
            trendingTokens: tiktokData
              .filter((video: { mentions?: Array<{ tokens?: { symbol?: string } }> }) => video?.mentions && Array.isArray(video.mentions) && video.mentions.length > 0)
              .flatMap((video: { mentions?: Array<{ tokens?: { symbol?: string } }> }) => video.mentions?.map((m: { tokens?: { symbol?: string } }) => m?.tokens?.symbol || 'Unknown') || [])
              .slice(0, 5),
            trendingHashtags: prev.tiktok.trendingHashtags // Keep existing hashtags, will be updated by real-time service
          }
        }));
      }

      // Fetch recent Telegram data
      const telegramResponse = await fetch('/api/dashboard/telegram-recent');
      if (telegramResponse.ok) {
        const telegramData = await telegramResponse.json();
        setData(prev => ({
          ...prev,
          telegram: {
            recentMessages: Array.isArray(telegramData.messages) ? telegramData.messages.length : 0,
            activeChannels: Array.isArray(telegramData.channels) ? telegramData.channels.length : 0,
            trendingKeywords: Array.isArray(telegramData.keywords) ? telegramData.keywords.slice(0, 5) : []
          }
        }));
      }

      // Fetch pattern analysis summary
      const analysisResponse = await fetch('/api/dashboard/analysis-summary');
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setData(prev => ({
          ...prev,
          patternAnalysis: {
            lastAnalysis: analysisData.lastAnalysis || 'Never',
            correlations: analysisData.totalCorrelations || 0,
            recommendations: analysisData.totalRecommendations || 0
          }
        }));
      }

    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Set default values on error to prevent UI crashes
      setData(prev => ({
        ...prev,
        tiktok: { recentVideos: 0, totalViews: 0, trendingTokens: [], trendingHashtags: [] },
        telegram: { recentMessages: 0, activeChannels: 0, trendingKeywords: [] },
        patternAnalysis: { lastAnalysis: 'Error', correlations: 0, recommendations: 0 }
      }));
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="dash-section-title">Real-Time Data Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TikTok Data */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-white)' }}>
              TikTok Analytics
            </span>
            <div className={`dash-pulse-dot ${
              tiktokHashtagsConnectionStatus.isConnected 
                ? 'dash-pulse-dot--green' 
                : tiktokHashtagsConnectionStatus.isConnecting 
                  ? 'dash-pulse-dot--cyan' 
                  : 'dash-pulse-dot--red'
            }`} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Total Views:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                {data.tiktok.totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Recent Videos:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                {data.tiktok.recentVideos}
              </span>
            </div>
          </div>

          {data.tiktok.trendingTokens.length > 0 && (
            <div className="mt-4">
              <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 6 }}>Trending Tokens</p>
              <div className="flex flex-wrap gap-1.5">
                {data.tiktok.trendingTokens.map((token, index) => (
                  <span key={index} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6,
                    background: 'rgba(0, 212, 255, 0.1)', color: 'var(--dash-cyan)'
                  }}>
                    {token}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.tiktok.trendingHashtags.length > 0 && (
            <div className="mt-3">
              <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 6 }}>Trending Hashtags</p>
              <div className="flex flex-wrap gap-1.5">
                {data.tiktok.trendingHashtags.map((hashtag, index) => (
                  <span key={index} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.06)', color: 'var(--dash-white)', border: '1px solid var(--dash-border)'
                  }}>
                    {hashtag.hashtag} ({hashtag.count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telegram Data */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-white)' }}>
              Telegram Analytics
            </span>
            <div className={`dash-pulse-dot ${
              telegramConnectionStatus.isConnected 
                ? 'dash-pulse-dot--green' 
                : telegramConnectionStatus.isConnecting 
                  ? 'dash-pulse-dot--cyan' 
                  : 'dash-pulse-dot--red'
            }`} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Active Channels:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                {data.telegram.activeChannels}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Recent Messages:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                {data.telegram.recentMessages}
              </span>
            </div>
          </div>

          {data.telegram.trendingKeywords.length > 0 && (
            <div className="mt-4">
              <p style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 6 }}>Trending Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {data.telegram.trendingKeywords.map((keyword, index) => (
                  <span key={index} style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6,
                    background: 'rgba(255, 255, 255, 0.06)', color: 'var(--dash-white)', border: '1px solid var(--dash-border)'
                  }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pattern Analysis */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-white)' }}>
              AI Pattern Analysis
            </span>
            <div className="dash-pulse-dot dash-pulse-dot--green" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Correlations:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                {data.patternAnalysis.correlations}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Recommendations:</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-purple)' }}>
                {data.patternAnalysis.recommendations}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Last Analysis:</span>
              <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>
                {formattedLastAnalysis}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
