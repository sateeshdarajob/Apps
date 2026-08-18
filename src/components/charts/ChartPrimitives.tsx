import type { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartSeriesPoint, RagStatus } from '@/types';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  action?: ReactNode;
  id?: string;
};

export function ChartCard({ title, subtitle, children, height = 280, action, id }: ChartCardProps) {
  return (
    <Card id={id} sx={{ height: '100%' }}>
      <CardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: subtitle ? 0 : 1 }}
        >
          <Typography variant="h4">{title}</Typography>
          {action}
        </Box>
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

const RAG_COLORS: Record<'green' | 'amber' | 'red', string> = {
  green: '#2E7D4F',
  amber: '#C47A11',
  red: '#C62828',
};

type RagDonutChartProps = {
  data: { status: RagStatus; label: string; value: number }[];
  activeStatus?: RagStatus | 'all';
  onSegmentClick?: (status: RagStatus) => void;
};

export function RagDonutChart({ data, activeStatus = 'all', onSegmentClick }: RagDonutChartProps) {
  const chartData = data.filter(
    (item): item is { status: 'green' | 'amber' | 'red'; label: string; value: number } =>
      item.status === 'green' || item.status === 'amber' || item.status === 'red',
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="label"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          onClick={(_, index) => {
            const entry = chartData[index];
            if (entry && onSegmentClick) onSegmentClick(entry.status);
          }}
          style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.status}
              fill={RAG_COLORS[entry.status]}
              opacity={activeStatus === 'all' || activeStatus === entry.status ? 1 : 0.35}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={28} />
      </PieChart>
    </ResponsiveContainer>
  );
}

type MilestoneStackedBarProps = {
  data: {
    label: string;
    completed: number;
    inProgress: number;
    atRisk: number;
    delayed: number;
  }[];
};

export function MilestoneStackedBar({ data }: MilestoneStackedBarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" stackId="a" fill="#2E7D4F" name="Completed" />
        <Bar dataKey="inProgress" stackId="a" fill="#1565A0" name="In Progress" />
        <Bar dataKey="atRisk" stackId="a" fill="#C47A11" name="At Risk" />
        <Bar dataKey="delayed" stackId="a" fill="#C62828" name="Delayed" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type DualLineChartProps = {
  data: { label: string; planned: number; actual: number }[];
};

export function DualLineChart({ data }: DualLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="planned"
          name="Planned"
          stroke="#8A9BA8"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="#0B3A53"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

type ScopeChangeBarProps = {
  data: { label: string; original: number; added: number; removed: number }[];
};

export function ScopeChangeBar({ data }: ScopeChangeBarProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Legend />
        <Bar dataKey="original" name="Original Scope" fill="#0B3A53" radius={[4, 4, 0, 0]} />
        <Bar dataKey="added" name="Added Scope" fill="#C47A11" radius={[4, 4, 0, 0]} />
        <Bar dataKey="removed" name="Removed Scope" fill="#8A9BA8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type ClickableLineChartProps = {
  data: { label: string; value: number }[];
  color?: string;
  onPointClick?: (index: number) => void;
};

export function ClickableLineChart({
  data,
  color = '#0B3A53',
  onPointClick,
}: ClickableLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} domain={[0, 100]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, cursor: onPointClick ? 'pointer' : 'default' }}
          activeDot={{
            r: 6,
            cursor: onPointClick ? 'pointer' : 'default',
            onClick: (_, payload) => {
              const index = (payload as { index?: number }).index;
              if (typeof index === 'number' && onPointClick) onPointClick(index);
            },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

type AgingBarChartProps = {
  data: { label: string; value: number; bucket?: string }[];
  onBarClick?: (bucket: string) => void;
};

export function AgingBarChart({ data, onBarClick }: AgingBarChartProps) {
  const colors = ['#2E7D4F', '#1565A0', '#C47A11', '#C62828'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D8E1E8" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#8A9BA8" />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#8A9BA8" width={36} />
        <Tooltip />
        <Bar
          dataKey="value"
          radius={[4, 4, 0, 0]}
          cursor={onBarClick ? 'pointer' : 'default'}
          onClick={(_, index) => {
            const entry = data[index];
            if (entry && onBarClick) onBarClick(entry.bucket ?? entry.label);
          }}
        >
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
