import type { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartSeriesPoint } from '@/types';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
};

export function ChartCard({ title, subtitle, children, height = 280 }: ChartCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ width: '100%', height }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

type SimpleLineChartProps = {
  data: ChartSeriesPoint[];
  color?: string;
};

export function SimpleLineChart({ data, color = '#0B3A53' }: SimpleLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

type SimpleBarChartProps = {
  data: ChartSeriesPoint[];
  color?: string;
};

export function SimpleBarChart({ data, color = '#3D8B6E' }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
