import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, TrendingUpIcon } from 'lucide-react';
import { formatRupiah } from '../lib/utils';
import { Skeleton } from './ui/skeleton';

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
