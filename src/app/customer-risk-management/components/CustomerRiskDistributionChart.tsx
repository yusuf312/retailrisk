'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ChartInner = dynamic(() => import('./CustomerRiskDistributionChartInner'), { ssr: false });

interface Customer {
  id: string;
  compositeScore: number;
  riskLevel: string;
}

export default function CustomerRiskDistributionChart({ customers }: { customers: Customer[] }) {
  return <ChartInner customers={customers} />;
}