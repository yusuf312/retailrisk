'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ChartInner = dynamic(() => import('./EmployeeDiscountChartInner'), { ssr: false });

interface Employee {
  id: string;
  name: string;
  avgDiscountPct: number;
  teamAvgPct: number;
  anomalyScore: number;
  riskLevel: string;
}

export default function EmployeeDiscountChart({ employees }: { employees: Employee[] }) {
  return <ChartInner employees={employees} />;
}