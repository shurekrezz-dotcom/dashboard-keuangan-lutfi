import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FileTextIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  PiggyBankIcon,
  BarChart3Icon,
} from 'lucide-react';

import {
  CashFlowChart,
  ExpenseCategoryChart,
  DateRangeFilter
} from '../components/DashboardComponents';

import { api, DashboardSummaryAPI } from '../lib/api';
import { getDateRange, formatRupiah } from '../lib/utils';

// ── Metric card helper ───────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  textColor: string;
  borderColor: string;
}

function MetricCard({ label, value, icon, gradient, iconBg, textColor, borderColor }: MetricCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl border ${borderColor} shadow-sm overflow-hidden`}>
      <div className={`h-1 ${gradient}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
          <div className={`p-2 ${iconBg} rounded-xl`}>{icon}</div>
        </div>
        <p className={`text-xl font-bold ${textColor} tracking-tight`}>{value}</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function Laporan() {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(getDateRange('month'));

  // ====================
  // FETCH SUMMARY (TYPED)
  // ====================
  const { data: summary, isLoading: isSummaryLoading } =
    useQuery<DashboardSummaryAPI>({
      queryKey: ['dashboard-summary', dateRange?.startDate, dateRange?.endDate],
      queryFn: () =>
        api.getDashboardSummary(dateRange?.startDate, dateRange?.endDate),
    });

  // ====================
  // FETCH TRANSACTIONS
  // ====================
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', dateRange?.startDate, dateRange?.endDate],
    queryFn: () =>
      api.getTransactions(dateRange?.startDate, dateRange?.endDate),
  });

  const handleFilterChange = (
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
    } else {
      setDateRange(null);
    }
  };

  const avgIncome =
    transactions.length > 0
      ? (summary?.totalIncome || 0) /
      Math.max(1, Object.keys(summary?.cashFlow || {}).length)
      : 0;

  const avgExpense =
    transactions.length > 0
      ? (summary?.totalExpense || 0) /
      Math.max(1, Object.keys(summary?.cashFlow || {}).length)
      : 0;

  const savingsRate = summary?.totalIncome
    ? ((summary.balance || 0) / summary.totalIncome) * 100
    : 0;

  const categoryEntries = Object.entries(summary?.categoryBreakdown || {})
    .sort(([, a], [, b]) => b - a);

  // Color palette for category bars
  const barColors = [
    'bg-indigo-500',
    'bg-violet-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-orange-500',
    'bg-rose-500',
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 space-y-7">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-md opacity-40" />
          <div className="relative p-3.5 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
            <FileTextIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laporan Keuangan</h1>
          <p className="text-sm text-slate-400 font-medium">Analisis lengkap aktivitas keuangan Anda</p>
        </div>
      </div>

      {/* DATE FILTER */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1">
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Pemasukan"
          value={formatRupiah(summary?.totalIncome || 0)}
          icon={<TrendingUpIcon className="h-4 w-4 text-emerald-600" />}
          gradient="bg-gradient-to-r from-emerald-400 to-teal-500"
          iconBg="bg-emerald-50"
          textColor="text-emerald-700"
          borderColor="border-emerald-100"
        />
        <MetricCard
          label="Total Pengeluaran"
          value={formatRupiah(summary?.totalExpense || 0)}
          icon={<TrendingDownIcon className="h-4 w-4 text-rose-600" />}
          gradient="bg-gradient-to-r from-rose-400 to-red-500"
          iconBg="bg-rose-50"
          textColor="text-rose-700"
          borderColor="border-rose-100"
        />
        <MetricCard
          label="Saldo"
          value={formatRupiah(summary?.balance || 0)}
          icon={<WalletIcon className="h-4 w-4 text-indigo-600" />}
          gradient="bg-gradient-to-r from-indigo-400 to-violet-500"
          iconBg="bg-indigo-50"
          textColor="text-indigo-700"
          borderColor="border-indigo-100"
        />
        <MetricCard
          label="Tingkat Tabungan"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBankIcon className="h-4 w-4 text-amber-600" />}
          gradient="bg-gradient-to-r from-amber-400 to-orange-500"
          iconBg="bg-amber-50"
          textColor="text-amber-700"
          borderColor="border-amber-100"
        />
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-400 via-violet-500 to-rose-400" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-xl">
            <BarChart3Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Rincian Kategori Pengeluaran</h2>
            <p className="text-xs text-slate-400">Breakdown detail pengeluaran per kategori</p>
          </div>
        </div>

        <div className="p-5">
          {categoryEntries.length > 0 ? (
            <div className="space-y-4">
              {categoryEntries.map(([category, amount], index) => {
                const percentage = summary?.totalExpense
                  ? (amount / summary.totalExpense) * 100
                  : 0;
                const colorClass = barColors[index % barColors.length];

                return (
                  <div key={category} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                        <span className="text-sm font-medium text-slate-700">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {percentage.toFixed(1)}%
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {formatRupiah(amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${colorClass} h-2 rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <BarChart3Icon className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">Belum ada data pengeluaran</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}