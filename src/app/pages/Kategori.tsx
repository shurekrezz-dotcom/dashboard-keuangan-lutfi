import { useState } from 'react';
import { TagIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, LightbulbIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

// Default categories untuk income dan expense
const defaultIncomeCategories = [
  { name: 'Gaji', emoji: '💼' },
  { name: 'Freelance', emoji: '💻' },
  { name: 'Bonus', emoji: '🎁' },
  { name: 'Investasi', emoji: '📈' },
  { name: 'Bisnis', emoji: '🏢' },
  { name: 'Lainnya', emoji: '📂' },
];

const defaultExpenseCategories = [
  { name: 'Makanan & Minuman', emoji: '🍽️' },
  { name: 'Transportasi', emoji: '🚗' },
  { name: 'Belanja', emoji: '🛍️' },
  { name: 'Hiburan', emoji: '🎬' },
  { name: 'Tagihan', emoji: '📋' },
  { name: 'Kesehatan', emoji: '🏥' },
  { name: 'Pendidikan', emoji: '📚' },
  { name: 'Investasi', emoji: '💰' },
  { name: 'Lainnya', emoji: '📂' },
];

const tips = [
  {
    title: 'Kategori Pemasukan',
    desc: 'Gunakan untuk mencatat sumber pendapatan seperti gaji, bonus, atau hasil investasi.',
  },
  {
    title: 'Kategori Pengeluaran',
    desc: 'Gunakan untuk mencatat berbagai jenis pengeluaran agar mudah dianalisis.',
  },
  {
    title: 'Kategori "Lainnya"',
    desc: 'Gunakan untuk transaksi yang tidak masuk kategori lain.',
  },
  {
    title: 'Konsistensi',
    desc: 'Gunakan kategori yang sama untuk jenis transaksi serupa agar laporan lebih akurat.',
  },
];

export default function Kategori() {
  const [incomeCategories] = useState(defaultIncomeCategories);
  const [expenseCategories] = useState(defaultExpenseCategories);

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 space-y-7">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-md opacity-40" />
            <div className="relative p-3.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg">
              <TagIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kategori</h1>
            <p className="text-sm text-slate-400 font-medium">Kelola kategori transaksi Anda</p>
          </div>
        </div>

        {/* Category count badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="text-xs font-semibold text-emerald-700">{incomeCategories.length} Pemasukan</span>
          </div>
          <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full">
            <span className="text-xs font-semibold text-rose-700">{expenseCategories.length} Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
        <div className="mt-0.5 p-1.5 bg-blue-100 rounded-lg">
          <LightbulbIcon className="h-4 w-4 text-blue-600" />
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong className="font-semibold">Info:</strong> Kategori berikut tersedia untuk mengorganisir transaksi Anda.
          Gunakan kategori ini saat menambahkan transaksi baru.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Income Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <ArrowUpCircleIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Kategori Pemasukan</h2>
                <p className="text-xs text-slate-400">Untuk transaksi pendapatan</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              {incomeCategories.length}
            </span>
          </div>
          <div className="p-4 space-y-2">
            {incomeCategories.map((category, index) => (
              <div
                key={category.name}
                className="group flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-xl transition-all duration-200 cursor-default"
              >
                <span className="text-lg leading-none">{category.emoji}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-800 transition-colors">
                  {category.name}
                </span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-400 to-red-500" />
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 rounded-xl">
                <ArrowDownCircleIcon className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">Kategori Pengeluaran</h2>
                <p className="text-xs text-slate-400">Untuk transaksi pengeluaran</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
              {expenseCategories.length}
            </span>
          </div>
          <div className="p-4 space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.name}
                className="group flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all duration-200 cursor-default"
              >
                <span className="text-lg leading-none">{category.emoji}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-rose-800 transition-colors">
                  {category.name}
                </span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-400 to-indigo-500" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-violet-50 rounded-xl">
            <LightbulbIcon className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="font-semibold text-slate-800">Tips Penggunaan Kategori</h2>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{tip.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}