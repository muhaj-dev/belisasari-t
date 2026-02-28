'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RealTimeData from '@/components/dashboard/real-time-data';
import TrendingCoinsSummary from '@/components/dashboard/trending-coins-summary';
import TrendingCoinsAnalytics from '@/components/dashboard/trending-coins-analytics';
import { PatternRecognitionCard } from '@/components/dashboard/pattern-recognition-card';
import { BackendServicesCard } from '@/components/dashboard/backend-services-card';
import ErrorBoundary from '@/components/dashboard/error-boundary';
import { useTwitterPost } from '@/hooks/use-twitter-post';
import { Loader2, Clock } from 'lucide-react';
import Image from 'next/image';

export default function DashboardClient() {
  const [scraperStatus, setScraperStatus] = useState({
    tiktok: {
      status: 'active',
      lastRun: null as Date | null,
      totalVideos: 1247,
      videosToday: 45
    },
    telegram: {
      status: 'active',
      lastRun: null as Date | null,
      totalMessages: 15420,
      messagesToday: 234
    },
    patternAnalysis: {
      status: 'active',
      lastRun: null as Date | null,
      totalAnalyses: 89,
      analysesToday: 12
    },
    twitter: {
      status: 'active',
      lastRun: null as Date | null,
      totalAlerts: 156,
      alertsToday: 8
    }
  });

  // Set the dates on the client side to avoid hydration mismatch
  useEffect(() => {
    const now = Date.now();
    setScraperStatus(prev => ({
      ...prev,
      tiktok: { ...prev.tiktok, lastRun: new Date(now - 1000 * 60 * 30) },
      telegram: { ...prev.telegram, lastRun: new Date(now - 1000 * 60 * 15) },
      patternAnalysis: { ...prev.patternAnalysis, lastRun: new Date(now - 1000 * 60 * 60) },
      twitter: { ...prev.twitter, lastRun: new Date(now - 1000 * 60 * 45) }
    }));
  }, []);

  // Fetch real TikTok/Telegram (and pattern) counts from API so "Today" and totals reflect Supabase
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/dashboard/scraper-status');
        if (!res.ok || cancelled) return;
        const raw = await res.json();
        const parseLastRun = (v: string | null | undefined): Date | null => {
          if (!v || v === 'Never') return null;
          const d = new Date(v);
          return isNaN(d.getTime()) ? null : d;
        };
        const mapStatus = (s: string) => (s === 'error' ? 'error' : 'active');
        setScraperStatus(prev => ({
          ...prev,
          tiktok: {
            status: mapStatus(raw.tiktok?.status),
            lastRun: parseLastRun(raw.tiktok?.lastRun) ?? prev.tiktok.lastRun,
            totalVideos: typeof raw.tiktok?.totalVideos === 'number' ? raw.tiktok.totalVideos : prev.tiktok.totalVideos,
            videosToday: typeof raw.tiktok?.videosToday === 'number' ? raw.tiktok.videosToday : prev.tiktok.videosToday
          },
          telegram: {
            status: mapStatus(raw.telegram?.status),
            lastRun: parseLastRun(raw.telegram?.lastRun) ?? prev.telegram.lastRun,
            totalMessages: typeof raw.telegram?.totalMessages === 'number' ? raw.telegram.totalMessages : prev.telegram.totalMessages,
            messagesToday: typeof raw.telegram?.messagesToday === 'number' ? raw.telegram.messagesToday : prev.telegram.messagesToday
          },
          patternAnalysis: {
            status: mapStatus(raw.patternAnalysis?.status),
            lastRun: parseLastRun(raw.patternAnalysis?.lastRun) ?? prev.patternAnalysis.lastRun,
            totalAnalyses: typeof raw.patternAnalysis?.totalAnalyses === 'number' ? raw.patternAnalysis.totalAnalyses : prev.patternAnalysis.totalAnalyses,
            analysesToday: typeof raw.patternAnalysis?.analysesToday === 'number' ? raw.patternAnalysis.analysesToday : prev.patternAnalysis.analysesToday
          }
        }));
      } catch (e) {
        if (!cancelled) console.error('Failed to load scraper status:', e);
      }
    };
    load();
    const interval = setInterval(load, 60_000); // refresh every 60s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Loading...';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatLastRunEST = (date: Date | null) => {
    if (!date) return 'Loading...';
    try {
      return date.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }) + ' EST';
    } catch {
      return formatTimeAgo(date);
    }
  };

  const { post, posting, error: twitterError } = useTwitterPost();
  const handlePostSummary = () => {
    post(
      '📊 Belisasari pipeline: Jupiter prices, TikTok & Telegram trends, pattern recognition. Track memecoins in one place. #Belisasari #Solana #Memecoin'
    );
  };

  const systemCards = [
    {
      name: 'TikTok Integration',
      key: 'tiktok' as const,
      totalLabel: 'Total Videos',
      totalValue: scraperStatus.tiktok.totalVideos,
      todayValue: scraperStatus.tiktok.videosToday,
      lastRun: scraperStatus.tiktok.lastRun,
      status: scraperStatus.tiktok.status,
    },
    {
      name: 'Telegram Integration',
      key: 'telegram' as const,
      totalLabel: 'Total Messages',
      totalValue: scraperStatus.telegram.totalMessages,
      todayValue: scraperStatus.telegram.messagesToday,
      lastRun: scraperStatus.telegram.lastRun,
      status: scraperStatus.telegram.status,
    },
    {
      name: 'Pattern Analysis',
      key: 'patternAnalysis' as const,
      totalLabel: 'Total Analyses',
      totalValue: scraperStatus.patternAnalysis.totalAnalyses,
      todayValue: scraperStatus.patternAnalysis.analysesToday,
      lastRun: scraperStatus.patternAnalysis.lastRun,
      status: scraperStatus.patternAnalysis.status,
    },
    {
      name: 'Twitter Integration',
      key: 'twitter' as const,
      totalLabel: 'Total Alerts',
      totalValue: scraperStatus.twitter.totalAlerts,
      todayValue: scraperStatus.twitter.alertsToday,
      lastRun: scraperStatus.twitter.lastRun,
      status: scraperStatus.twitter.status,
    },
  ];

  return (
    <div className="dashboard-theme">
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-white)' }}>
              Belisasari Dashboard
            </h1>
            <p style={{ fontSize: 13, color: 'var(--dash-muted)', marginTop: 4 }}>
              Real-time memecoin analytics from TikTok, Telegram, and AI analysis.
            </p>
          </div>
          <button
            className="dash-btn-cyan"
            onClick={handlePostSummary}
            disabled={posting}
          >
            {posting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Image src="/x.png" width={16} height={16} alt="X" className="rounded" />
            )}
            Post summary to Twitter
          </button>
        </div>
        {twitterError && (
          <p style={{ fontSize: 13, color: 'var(--dash-red)' }}>Twitter: {twitterError}</p>
        )}

        {/* Gradient divider */}
        <div className="dash-gradient-divider" />

        {/* Real-time Data Overview */}
        <ErrorBoundary>
          <RealTimeData />
        </ErrorBoundary>

        {/* AI-Powered Features */}
        <div className="space-y-5">
          <h2 className="dash-section-title">AI-Powered Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary>
              <PatternRecognitionCard />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <BackendServicesCard />
            </ErrorBoundary>
          </div>
        </div>

        {/* Trending Coins Analytics */}
        <div className="space-y-5">
          <ErrorBoundary>
            <TrendingCoinsSummary />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <TrendingCoinsAnalytics />
          </ErrorBoundary>
        </div>

        {/* System Status */}
        <div className="space-y-5">
          <h2 className="dash-section-title">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemCards.map((card) => (
              <div key={card.key} className="dash-status-card">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-white)' }}>
                    {card.name}
                  </span>
                  <div className={`dash-pulse-dot ${card.status === 'active' ? 'dash-pulse-dot--green' : 'dash-pulse-dot--red'}`} />
                </div>

                {/* Metric rows */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>{card.totalLabel}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                      {card.totalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Today</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-cyan)' }}>
                      {card.todayValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Last run */}
                <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: 'var(--dash-muted)' }}>
                  <Clock className="w-3 h-3" />
                  <span>Last Run {formatLastRunEST(card.lastRun)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
