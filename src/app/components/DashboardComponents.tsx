import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Skeleton } from './ui/skeleton';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  WalletIcon,
  TrendingUpIcon,
  Trash2Icon,
  CalendarIcon,
  FilterIcon,
  XIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { formatRupiah, formatDate, formatMonthYear, formatPeriodKey, getDateRange } from '../lib/utils';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from 'react-day-picker';
import type { Transaction } from '../lib/api';

// ==================== DASHBOARD STATS ====================

interface DashboardStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalIncome,
  totalExpense,
  balance,
  transactionCount,
  isLoading = false,
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Pemasukan',
      value: totalIncome,
      icon: ArrowUpIcon,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Pengeluaran',
      value: totalExpense,
      icon: ArrowDownIcon,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Saldo',
      value: balance,
      icon: WalletIcon,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Transaksi',
      value: transactionCount,
      icon: TrendingUpIcon,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isCount: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.isCount ? stat.value : formatRupiah(stat.value)}
            </div>
            {!stat.isCount && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.value >= 0 ? '+' : ''}{((stat.value / (totalIncome || 1)) * 100).toFixed(1)}% dari pemasukan
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ==================== CASH FLOW CHART ====================

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

  let daysDiff = 180;
  if (dateRange) {
    daysDiff = Math.ceil((new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24));
  }

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

  const CustomCashFlowTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.period}</p>
          <p className="text-sm text-green-600">Pemasukan: {formatRupiah(payload[0].value)}</p>
          <p className="text-sm text-red-600">Pengeluaran: {formatRupiah(payload[1].value)}</p>
          <p className="text-sm font-semibold mt-1">Net: {formatRupiah(payload[0].payload.netBalance)}</p>
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
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#6b7280" angle={chartData.length > 10 ? -45 : 0} textAnchor={chartData.length > 10 ? 'end' : 'middle'} height={chartData.length > 10 ? 80 : 30} />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
            <Tooltip content={<CustomCashFlowTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
            <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ==================== EXPENSE CATEGORY CHART ====================

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

interface ExpenseCategoryChartProps {
  categoryBreakdown: Record<string, number>;
  isLoading?: boolean;
}

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

  const chartData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomCategoryTooltip = ({ active, payload }: any) => {
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
    if (percent < 0.05) return null;
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-semibold">
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
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={CustomLabel} outerRadius={100} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomCategoryTooltip />} />
            <Legend verticalAlign="bottom" height={36} formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(0);
              return `${value} (${percentage}%)`;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ==================== TRANSACTION LIST ====================

const categoryEmoji: Record<string, string> = {
  Gaji: '💼', Bonus: '🎁', Investasi: '📈', Freelance: '💻', Lainnya: '📌',
  Makanan: '🍜', Transportasi: '🚌', Belanja: '🛍️', Tagihan: '📄',
  Hiburan: '🎬', Kesehatan: '💊', Pendidikan: '📚',
};

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export function TransactionList({ transactions, onDelete, isLoading = false }: TransactionListProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100">
                <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
                <Skeleton className="h-5 w-20 shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader><CardTitle>Riwayat Transaksi</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-gray-500 text-sm">Belum ada transaksi. Mulai tambahkan transaksi pertama Anda!</p>
        </CardContent>
      </Card>
    );
  }

  const grouped = transactions.reduce((acc: Record<string, Transaction[]>, t) => {
    const d = t.date ? t.date.split('T')[0] : new Date().toISOString().split('T')[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(t);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Riwayat Transaksi</CardTitle>
            <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transaksi tercatat</p>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
            {transactions.length} data
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Total Masuk</p>
            <p className="text-sm font-bold text-emerald-700 truncate">+{formatRupiah(totalIncome).replace('Rp', 'Rp ')}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1">Total Keluar</p>
            <p className="text-sm font-bold text-rose-700 truncate">-{formatRupiah(totalExpense).replace('Rp', 'Rp ')}</p>
          </div>
        </div>

        {/* List */}
        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-5">
            {sortedDates.map((dateKey) => (
              <div key={dateKey}>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                    {formatDate(dateKey)}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="space-y-2">
                  {grouped[dateKey].map((transaction) => {
                    const isIncome = transaction.type === 'income';
                    const emoji = categoryEmoji[transaction.category] ?? (isIncome ? '💰' : '💸');

                    return (
                      <div
                        key={transaction.id}
                        className="flex flex-col p-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-150"
                      >
                        {/* Baris atas: icon + info + tombol hapus */}
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-base shrink-0 ${isIncome ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            <span>{emoji}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 min-w-0">
                              <span className="text-sm font-semibold text-gray-800 truncate">{transaction.category}</span>
                              {isIncome
                                ? <ArrowUpIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                : <ArrowDownIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                            </div>
                            {transaction.description && (
                              <p className="text-[11px] text-gray-400 truncate">{transaction.description}</p>
                            )}
                            <p className="text-[11px] text-gray-400">{formatDate(transaction.date)}</p>
                          </div>

                          {/* Tombol hapus — selalu visible, background solid */}
                          <button
                            onClick={() => onDelete(transaction.id)}
                            style={{ opacity: 1, visibility: 'visible', display: 'flex' }}
                            className="shrink-0 h-8 w-8 rounded-xl items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 active:scale-95 transition-all duration-150"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Baris bawah: nominal */}
                        <div className="mt-1.5 flex justify-end">
                          <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isIncome ? '+' : '-'}{formatRupiah(transaction.amount).replace('Rp', 'Rp')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ==================== DATE RANGE FILTER ====================

type Period = 'today' | 'week' | 'month' | 'year' | 'all';
type FilterPeriod = Period | 'custom';

interface DateRangeFilterProps {
  onFilterChange: (startDate: string | undefined, endDate: string | undefined) => void;
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const periods = [
    { value: 'today' as const, label: 'Hari Ini' },
    { value: 'week' as const, label: 'Minggu Ini' },
    { value: 'month' as const, label: 'Bulan Ini' },
    { value: 'year' as const, label: 'Tahun Ini' },
    { value: 'all' as const, label: 'Semua' },
  ];

  const handlePeriodChange = (period: Exclude<Period, 'custom'>) => {
    setSelectedPeriod(period);
    setCustomDateRange(undefined);
    const range = getDateRange(period);
    if (range) {
      onFilterChange(range.startDate, range.endDate);
    } else {
      onFilterChange(undefined, undefined);
    }
  };

  const handleCustomDateChange = (range: DateRange | undefined) => {
    setCustomDateRange(range);
    if (range?.from && range?.to) {
      const startDate = range.from.toISOString().split('T')[0];
      const endDate = range.to.toISOString().split('T')[0];
      onFilterChange(startDate, endDate);
      setSelectedPeriod('custom');
    }
  };

  const handleClearCustom = () => {
    setCustomDateRange(undefined);
    setSelectedPeriod('month');
    const range = getDateRange('month');
    if (range) onFilterChange(range.startDate, range.endDate);
  };

  const getDisplayText = () => {
    if (selectedPeriod === 'custom' && customDateRange?.from && customDateRange?.to) {
      const startDate = customDateRange.from.toISOString().split('T')[0];
      const endDate = customDateRange.to.toISOString().split('T')[0];
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return periods.find(p => p.value === selectedPeriod)?.label || 'Pilih Periode';
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter Periode:</span>
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {periods.map((period) => (
            <Button key={period.value} variant={selectedPeriod === period.value ? 'default' : 'outline'} size="sm" onClick={() => handlePeriodChange(period.value)}>
              {period.label}
            </Button>
          ))}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant={selectedPeriod === 'custom' ? 'default' : 'outline'} size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />Custom
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Pilih Rentang Tanggal</h4>
                  {customDateRange && (
                    <Button variant="ghost" size="sm" onClick={handleClearCustom} className="h-auto p-1">
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <DateRangePicker value={customDateRange} onChange={(range) => { handleCustomDateChange(range); if (range?.from && range?.to) setIsOpen(false); }} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap">
          <CalendarIcon className="h-4 w-4 inline mr-2" />
          {getDisplayText()}
        </div>
      </div>
    </Card>
  );
}