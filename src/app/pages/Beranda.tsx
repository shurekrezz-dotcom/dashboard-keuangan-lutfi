import { useQuery } from '@tanstack/react-query';
import {
  WalletIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowRightLeftIcon,
} from 'lucide-react';
import {
  CashFlowChart,
  ExpenseCategoryChart,
  DateRangeFilter
} from '../components/DashboardComponents';
import { api } from '../lib/api';
import { formatRupiah } from '../lib/utils';
import { useState } from 'react';

// ── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  isLoading?: boolean;
}

function StatCard({ label, value, sub, icon, gradient, shadowColor, isLoading }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${gradient} p-5 ${shadowColor}`}>
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-2 w-16 h-16 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">{label}</span>
          <div className="p-2 bg-white/20 rounded-xl">{icon}</div>
        </div>
        {isLoading ? (
          <div className="h-7 w-28 bg-white/20 rounded-lg animate-pulse" />
        ) : (
          <p className="text-xl font-bold text-white tracking-tight truncate">{value}</p>
        )}
        {sub && <p className="text-xs text-white/50 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function Beranda() {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

  // Fetch dashboard summary
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboard-summary', dateRange],
    queryFn: () => api.getDashboardSummary(
      dateRange?.startDate,
      dateRange?.endDate
    ),
    enabled: true,
  });

  console.log("SUMMARY:", summary);

  const handleFilterChange = (startDate: string | undefined, endDate: string | undefined) => {
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
    } else {
      setDateRange(null);
    }
  };

  const balance = summary?.balance || 0;
  const isPositive = balance >= 0;

  return (
    <div className="min-h-screen bg-slate-50/70 space-y-6 p-6">

      {/* ── HERO HEADER ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="relative flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <WalletIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Beranda</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Keuangan Anda</h1>
            <p className="text-sm text-white/40 font-medium mt-1">Ringkasan pergerakan uang Anda</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/60">Live</span>
          </div>
        </div>

        <div className="relative pt-5 border-t border-white/10">
          <p className="text-xs text-white/30 font-bold uppercase tracking-widest mb-2">Saldo Bersih</p>
          {isSummaryLoading ? (
            <div className="h-10 w-48 bg-white/10 rounded-xl animate-pulse" />
          ) : (
            <div className="flex items-end gap-3 flex-wrap">
              <p className={`text-4xl font-bold tracking-tight ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatRupiah(balance)}
              </p>
              <span className={`mb-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isPositive
                  ? 'bg-emerald-400/20 text-emerald-400'
                  : 'bg-rose-400/20 text-rose-400'
                }`}>
                {isPositive
                  ? <TrendingUpIcon className="h-3 w-3" />
                  : <TrendingDownIcon className="h-3 w-3" />}
                {isPositive ? 'Surplus' : 'Defisit'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── DATE FILTER ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1">
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pemasukan"
          value={formatRupiah(summary?.totalIncome || 0)}
          icon={<TrendingUpIcon className="h-4 w-4 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          shadowColor="shadow-lg shadow-emerald-200"
          isLoading={isSummaryLoading}
        />
        <StatCard
          label="Pengeluaran"
          value={formatRupiah(summary?.totalExpense || 0)}
          icon={<TrendingDownIcon className="h-4 w-4 text-white" />}
          gradient="bg-gradient-to-br from-rose-500 to-red-600"
          shadowColor="shadow-lg shadow-rose-200"
          isLoading={isSummaryLoading}
        />
        <StatCard
          label="Saldo"
          value={formatRupiah(balance)}
          icon={<WalletIcon className="h-4 w-4 text-white" />}
          gradient={isPositive
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
            : 'bg-gradient-to-br from-orange-500 to-amber-600'}
          shadowColor={isPositive ? 'shadow-lg shadow-blue-200' : 'shadow-lg shadow-orange-200'}
          isLoading={isSummaryLoading}
        />
        <StatCard
          label="Transaksi"
          value={String(summary?.transactionCount || 0)}
          sub="total transaksi tercatat"
          icon={<ArrowRightLeftIcon className="h-4 w-4 text-white" />}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
          shadowColor="shadow-lg shadow-violet-200"
          isLoading={isSummaryLoading}
        />
      </div>

      {/* ── CHARTS ── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <CashFlowChart
            cashFlow={summary?.cashFlow || {}}
            isLoading={isSummaryLoading}
            dateRange={dateRange}
          />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-400 to-orange-400" />
          <ExpenseCategoryChart
            categoryBreakdown={summary?.categoryBreakdown || {}}
            isLoading={isSummaryLoading}
          />
        </div>
      </div>
    </div>
  );
}