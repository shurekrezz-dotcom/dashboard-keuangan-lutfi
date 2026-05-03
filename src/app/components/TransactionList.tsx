import { ScrollArea } from './ui/scroll-area';
import { Trash2Icon, ArrowUpRight, ArrowDownLeft, ReceiptText } from 'lucide-react';
import { formatRupiah, formatDate } from '../lib/utils';
import { Skeleton } from './ui/skeleton';
import type { Transaction } from '../lib/api';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
  isLoading?: boolean;
}

const categoryEmoji: Record<string, string> = {
  Gaji: '💼', Bonus: '🎁', Investasi: '📈', Freelance: '💻', Lainnya: '📌',
  Makanan: '🍜', Transportasi: '🚌', Belanja: '🛍️', Tagihan: '📄',
  Hiburan: '🎬', Kesehatan: '💊', Pendidikan: '📚',
};

export function TransactionList({
  transactions,
  onDelete,
  isLoading = false,
}: TransactionListProps) {

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 bg-white">
            <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-20 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
          <ReceiptText className="h-8 w-8 text-gray-300" />
        </div>
        <p className="font-semibold text-gray-700 text-sm">Belum ada transaksi</p>
        <p className="text-gray-400 text-xs mt-1">Mulai tambahkan transaksi pertama Anda</p>
      </div>
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
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Riwayat Transaksi</h2>
          <p className="text-xs text-gray-400 mt-0.5">{transactions.length} transaksi tercatat</p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
          {transactions.length} data
        </span>
      </div>

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
      <ScrollArea className="h-[420px] pr-1">
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
                      {/* Row atas: icon + info + tombol hapus */}
                      <div className="flex items-center gap-3">
                        {/* Emoji icon */}
                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-base shrink-0 ${isIncome ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                          <span>{emoji}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-800 truncate">{transaction.category}</span>
                            {isIncome
                              ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              : <ArrowDownLeft className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                          </div>
                          {transaction.description && (
                            <p className="text-[11px] text-gray-400 truncate">{transaction.description}</p>
                          )}
                          <p className="text-[11px] text-gray-400">{formatDate(transaction.date)}</p>
                        </div>

                        {/* Tombol hapus — selalu di pojok kanan atas */}
                        <button
                          onClick={() => onDelete(transaction.id)}
                          style={{ opacity: 1, visibility: 'visible', display: 'flex' }}
                          className="shrink-0 h-8 w-8 rounded-xl items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 active:scale-95 transition-all duration-150"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Row bawah: nominal */}
                      <div className="mt-2 pl-13 flex justify-end">
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
    </div>
  );
}