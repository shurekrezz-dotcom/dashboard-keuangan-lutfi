import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatRupiah } from '../lib/utils';
import { Skeleton } from './ui/skeleton';

interface ExpenseCategoryChartProps {
  categoryBreakdown: Record<string, number>;
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function ExpenseCategoryChart({ categoryBreakdown, isLoading = false }: ExpenseCategoryChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{formatRupiah(payload[0].value)}</p>
          <p className="text-xs text-gray-500">{percentage}% dari total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Kategori Pengeluaran</CardTitle>
          <CardDescription>Distribusi pengeluaran berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500 text-sm">Belum ada data pengeluaran</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Kategori Pengeluaran</CardTitle>
        <CardDescription>Distribusi pengeluaran berdasarkan kategori</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart key="expense-pie-chart">
            <Pie
              key="expense-pie"
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`expense-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip key="expense-tooltip" content={<CustomTooltip />} />
            <Legend
              key="expense-legend"
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => {
                const percentage = ((entry.payload.value / total) * 100).toFixed(0);
                return `${value} (${percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}