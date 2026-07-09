'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const LeakageTrendChartInner = dynamic(() => import('./LeakageTrendChartInner'), { ssr: false });

export default function LeakageTrendChart() {
  return <LeakageTrendChartInner />;
}