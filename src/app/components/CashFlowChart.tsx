import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRupiah, formatMonthYear, formatPeriodKey } from '../lib/utils';
import { Skeleton } from './ui/skeleton';

interface CashFlowChartProps {
  cashFlow: Record<string, { income: number; expense: number }>;
  isLoading?: boolean;
  dateRange?: { startDate: string; endDate: string } | null;
}

export function CashFlowChart({ cashFlow, isLoading = false, dateRange }: CashFlowChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Calculate days difference for formatting
  let daysDiff = 180; // default to 6 months
  if (dateRange) {
    daysDiff = Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24));
  }

  // Convert cashFlow object to array and sort by date
  const chartData = Object.entries(cashFlow)
    .map(([period, data], index) => ({
      id: `${period}-${index}`,
      period: formatPeriodKey(period, daysDiff),
      periodKey: period,
      pemasukan: data.income,
      pengeluaran: data.expense,
      netBalance: data.income - data.expense,
    }))
    .sort((a, b) => a.periodKey.localeCompare(b.periodKey));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.period}</p>
          <p className="text-sm text-green-600">
            Pemasukan: {formatRupiah(payload[0].value)}
          </p>
          <p className="text-sm text-red-600">
            Pengeluaran: {formatRupiah(payload[1].value)}
          </p>
          <p className="text-sm font-semibold mt-1">
            Net: {formatRupiah(payload[0].payload.netBalance)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getChartDescription = () => {
    if (daysDiff <= 7) return 'Perbandingan harian pemasukan dan pengeluaran';
    if (daysDiff <= 31) return 'Perbandingan harian pemasukan dan pengeluaran';
    if (daysDiff <= 365) return 'Perbandingan bulanan pemasukan dan pengeluaran';
    return 'Perbandingan tahunan pemasukan dan pengeluaran';
  };

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Arus Kas</CardTitle>
          <CardDescription>{getChartDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500 text-sm">Belum ada data transaksi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Arus Kas</CardTitle>
        <CardDescription>{getChartDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} key="cash-flow-area-chart">
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1" key="gradient-income">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} key="stop-income-1" />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} key="stop-income-2" />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1" key="gradient-expense">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} key="stop-expense-1" />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} key="stop-expense-2" />
              </linearGradient>
            </defs>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              key="xaxis"
              dataKey="period" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              angle={chartData.length > 10 ? -45 : 0}
              textAnchor={chartData.length > 10 ? 'end' : 'middle'}
              height={chartData.length > 10 ? 80 : 30}
            />
            <YAxis
              key="yaxis"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
            />
            <Tooltip key="tooltip" content={<CustomTooltip />} />
            <Legend key="legend" />
            <Area
              key="area-income"
              type="monotone"
              dataKey="pemasukan"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              key="area-expense"
              type="monotone"
              dataKey="pengeluaran"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}