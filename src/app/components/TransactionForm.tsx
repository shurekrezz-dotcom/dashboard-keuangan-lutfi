import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, CalendarDays, FileText, Tag, Banknote, Plus } from 'lucide-react';

export function TransactionForm({ onSubmit }: any) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories =
    type === 'income'
      ? ['Gaji', 'Bonus', 'Investasi', 'Freelance', 'Lainnya']
      : ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya'];

  const handleSubmit = async () => {
    if (!category || !amount || !date) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        category,
        amount: Number(amount),
        description,
        date,
      });

      setCategory('');
      setAmount('');
      setDescription('');

      toast.success('Transaksi berhasil ditambahkan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isIncome = type === 'income';

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="mb-1">
        <h2 className="text-base font-bold text-gray-800 tracking-tight">Tambah Transaksi</h2>
        <p className="text-xs text-gray-400 mt-0.5">Catat pemasukan atau pengeluaran Anda</p>
      </div>

      {/* Type Toggle — pill style */}
      <div className="relative flex rounded-xl bg-gray-100 p-1 gap-1">
        <button
          type="button"
          onClick={() => { setType('income'); setCategory(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${isIncome
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <TrendingUp className="h-4 w-4" />
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => { setType('expense'); setCategory(''); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${!isIncome
            ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <TrendingDown className="h-4 w-4" />
          Pengeluaran
        </button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="space-y-4"
      >
        {/* Amount — hero input */}
        <div className={`rounded-xl p-4 ${isIncome ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
          <Label className={`text-xs font-semibold uppercase tracking-wider ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
            Jumlah
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xl font-bold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>Rp</span>
            <input
              type="number"
              className="flex-1 bg-transparent text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-300 w-full"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Kategori */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Tag className="h-3 w-3" /> Kategori
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11 rounded-xl bg-white border-gray-200 text-sm font-medium focus:ring-2 focus:ring-offset-0 focus:ring-gray-200">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((cat: string) => (
                <SelectItem key={cat} value={cat} className="rounded-lg text-sm">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tanggal */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <CalendarDays className="h-3 w-3" /> Tanggal
          </Label>
          <Input
            type="date"
            className="h-11 rounded-xl bg-white border-gray-200 text-sm font-medium focus:ring-2 focus:ring-offset-0 focus:ring-gray-200"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <FileText className="h-3 w-3" /> Catatan
          </Label>
          <Input
            className="h-11 rounded-xl bg-white border-gray-200 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-offset-0 focus:ring-gray-200"
            placeholder="Opsional — tulis catatan di sini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${isIncome
            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200'
            : 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Menyimpan...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </span>
          )}
        </button>
      </form>
    </div>
  );
}