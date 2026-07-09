import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardHeader from './components/DashboardHeader';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import LeakageTrendChart from './components/LeakageTrendChart';
import TopRiskCustomersTable from './components/TopRiskCustomersTable';
import RiskActivityFeed from './components/RiskActivityFeed';

export default function RiskDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6 fade-in">
        <DashboardHeader />
        <MetricsBentoGrid />
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LeakageTrendChart />
          </div>
          <div>
            <RiskActivityFeed />
          </div>
        </div>
        <TopRiskCustomersTable />
      </div>
    </AppLayout>
  );
}