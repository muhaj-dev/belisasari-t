'use client';

import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./dashboard-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0F' }}>
      <div className="text-center">
        <div className="w-14 h-14 rounded-full animate-spin mx-auto mb-4"
          style={{ border: '3px solid rgba(0,212,255,0.15)', borderTopColor: '#00D4FF' }} />
        <p style={{ color: '#6B7280', fontSize: 13 }}>Loading dashboard...</p>
      </div>
    </div>
  )
});

export default function DashboardPage() {
  return <DashboardClient />;
}
