import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/DashboardComponents';
import { api, parseTransaction, TransactionAPI } from '../lib/api';
import { toast } from 'sonner';
import type { Transaction } from '../lib/api';

export default function Transaksi() {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, isError } =
    useQuery<TransactionAPI[]>({
      queryKey: ['transactions'],
      queryFn: () => api.getTransactions(),
    });

  const createTransactionMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaksi berhasil ditambahkan');
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaksi berhasil dihapus');
    },
  });

  const handleCreateTransaction = async (data: any) => {
    // Simpan type sebagai prefix agar bisa di-parse saat fetch
    await createTransactionMutation.mutateAsync({
      name: `[${data.type}] ${data.category}`,
      nominal: data.amount,
    });
  };

  const handleDeleteTransaction = async (id: number) => {
    await deleteTransactionMutation.mutateAsync(id);
  };

  const mappedTransactions: Transaction[] = transactions.map(parseTransaction);

  return (
    <div className="bg-gray-50 w-full min-w-0 min-h-screen">
      <div className="w-full min-w-0 px-3 sm:px-6 py-5 space-y-6">

        {/* ── Page Header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl px-5 sm:px-8 py-6 sm:py-8">
          {/* Decorative blobs */}
          <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-12 h-20 w-40 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">Manajemen Keuangan</p>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Transaksi
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Catat dan kelola semua aktivitas keuangan Anda
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-2xl">🧾</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-white/80 font-medium">
                  {mappedTransactions.filter(t => t.type === 'income').length} Pemasukan
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="text-xs text-white/80 font-medium">
                  {mappedTransactions.filter(t => t.type === 'expense').length} Pengeluaran
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs text-white/80 font-medium">
                  {mappedTransactions.length} Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-4 w-full min-w-0 items-start">

          {/* Form Panel */}
          <div className="w-full min-w-0 lg:sticky lg:top-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full">
              <TransactionForm onSubmit={handleCreateTransaction} />
            </div>
          </div>

          {/* List Panel */}
          <div className="w-full min-w-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                  <span className="h-5 w-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                  <span className="text-sm">Memuat transaksi...</span>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-3xl mb-3">⚠️</span>
                  <p className="text-sm font-semibold text-gray-700">Gagal memuat data</p>
                  <p className="text-xs text-gray-400 mt-1">Periksa koneksi Anda dan coba lagi</p>
                </div>
              ) : (
                <TransactionList
                  transactions={mappedTransactions}
                  onDelete={(id) => handleDeleteTransaction(Number(id))}
                  isLoading={deleteTransactionMutation.isPending}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}