'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ChartInner = dynamic(() => import('./SupplierDefectChartInner'), { ssr: false });

export default function SupplierDefectChart() {
  return <ChartInner />;
}