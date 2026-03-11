import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { EditorElement } from '../types';

const COLORS = ['#e7926b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface ChartRendererProps {
  element: EditorElement;
  width: number;
  height: number;
  className?: string;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  element,
  width,
  height,
  className = '',
}) => {
  const data = element.chartData ?? {
    chartType: 'bar' as const,
    data: [
      { label: 'A', value: 40 },
      { label: 'B', value: 30 },
      { label: 'C', value: 50 },
      { label: 'D', value: 20 },
    ],
  };
  const chartType = data.chartType;
  const chartData = data.data;

  const commonProps = {
    width,
    height,
    data: chartData,
    margin: { top: 8, right: 8, left: 8, bottom: 8 },
  };

  if (chartType === 'pie') {
    return (
      <div className={className} style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={(entry) => entry.label}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => [val, '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === 'line') {
    return (
      <div className={className} style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={{ fill: COLORS[0] }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
