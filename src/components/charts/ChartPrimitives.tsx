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

const CHART_GRID = '#E4EBEF';
const CHART_AXIS = '#8A9BA8';
const TOOLTIP_STYLE = {
  backgroundColor: '#1A2B36',
  border: 'none',
  borderRadius: 4,
  fontSize: 12,
  color: '#fff',
  padding: '8px 10px',
  boxShadow: '0 4px 12px rgba(15, 26, 34, 0.18)',
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  action?: ReactNode;
  id?: string;
};

export function ChartCard({ title, subtitle, children, height = 220, action, id }: ChartCardProps) {
  return (
    <Card id={id} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1.5,
            mb: subtitle ? 0.25 : 1.25,
          }}
        >
          <Typography variant="h4" component="h3">
            {title}
          </Typography>
          {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.4 }}>
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
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: CHART_GRID }} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

type SimpleBarChartProps = {
  data: ChartSeriesPoint[];
  color?: string;
};

export function SimpleBarChart({ data, color = '#0B3A53' }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(11, 58, 83, 0.04)' }} />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const RAG_COLORS: Record<'green' | 'amber' | 'red', string> = {
  green: '#1F6B45',
  amber: '#A86810',
  red: '#B42318',
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
        <Tooltip contentStyle={TOOLTIP_STYLE} />
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
      <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend />
        <Bar dataKey="completed" stackId="a" fill="#1F6B45" name="Completed" />
        <Bar dataKey="inProgress" stackId="a" fill="#175C8A" name="In Progress" />
        <Bar dataKey="atRisk" stackId="a" fill="#A86810" name="At Risk" />
        <Bar dataKey="delayed" stackId="a" fill="#B42318" name="Delayed" radius={[4, 4, 0, 0]} />
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
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
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
      <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend />
        <Bar dataKey="original" name="Original Scope" fill="#0B3A53" radius={[4, 4, 0, 0]} />
        <Bar dataKey="added" name="Added Scope" fill="#A86810" radius={[4, 4, 0, 0]} />
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
      <LineChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
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
  const colors = ['#1F6B45', '#175C8A', '#A86810', '#B42318'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
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

type DualSeriesBarChartProps = {
  data: { label: string; capacity: number; demand: number }[];
};

export function DualSeriesBarChart({ data }: DualSeriesBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_AXIS }} stroke={CHART_AXIS} width={32} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend />
        <Bar dataKey="capacity" name="Capacity" fill="#0B3A53" radius={[3, 3, 0, 0]} maxBarSize={36} />
        <Bar dataKey="demand" name="Demand" fill="#A86810" radius={[3, 3, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

type HeatmapCell = {
  probability: string;
  impact: string;
  count: number;
};

type ProbabilityImpactHeatmapProps = {
  probabilities: string[];
  impacts: string[];
  cells: HeatmapCell[];
};

function heatmapColor(count: number): string {
  if (count <= 0) return '#F7F9FB';
  if (count === 1) return '#F3E6CF';
  if (count === 2) return '#D0923A';
  return '#B42318';
}

export function ProbabilityImpactHeatmap({
  probabilities,
  impacts,
  cells,
}: ProbabilityImpactHeatmapProps) {
  const lookup = new Map(
    cells.map((cell) => [`${cell.probability}:${cell.impact}`, cell.count]),
  );

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `88px repeat(${impacts.length}, 1fr)`,
        gap: 0.75,
        height: '100%',
        alignContent: 'center',
      }}
    >
      <Box />
      {impacts.map((impact) => (
        <Typography key={impact} variant="caption" textAlign="center" color="text.secondary">
          {impact}
        </Typography>
      ))}
      {probabilities.map((probability) => (
        <Box key={probability} sx={{ display: 'contents' }}>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
            {probability}
          </Typography>
          {impacts.map((impact) => {
            const count = lookup.get(`${probability}:${impact}`) ?? 0;
            return (
              <Box
                key={`${probability}-${impact}`}
                sx={{
                  bgcolor: heatmapColor(count),
                  borderRadius: 1,
                  minHeight: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: count >= 2 ? '#fff' : 'text.primary',
                  fontWeight: 600,
                  fontSize: 13,
                }}
                title={`${probability} × ${impact}: ${count}`}
              >
                {count}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
