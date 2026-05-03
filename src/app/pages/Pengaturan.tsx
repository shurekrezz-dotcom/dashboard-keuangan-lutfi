import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  SettingsIcon,
  InfoIcon,
  AlertCircleIcon,
  Trash2Icon,
  BellIcon,
  MoonIcon,
  DatabaseIcon,
  DownloadIcon,
  ShieldAlertIcon,
  CodeIcon,
  CalendarIcon,
  ServerIcon,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

import { api } from '../lib/api';
import { toast } from 'sonner';

// ── Toggle Row ──────────────────────────────────────────────────────────────
interface ToggleRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

function ToggleRow({ icon, iconBg, label, description, checked, onChange, disabled, badge }: ToggleRowProps) {
  return (
    <div className={`flex items-center justify-between py-4 transition-opacity ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-xl`}>{icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-semibold text-slate-800 cursor-pointer">{label}</Label>
            {badge && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-400 rounded-full border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function Pengaturan() {
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ====================
  // DELETE ALL MUTATION (FIXED)
  // Dibungkus arrow function agar `this` binding pada `api` tidak hilang
  // ====================
  const deleteAllMutation = useMutation<number>({
    mutationFn: () => api.deleteAllTransactions(),
    onSuccess: (deletedCount) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success(`Berhasil menghapus ${deletedCount} transaksi`);
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Gagal menghapus data');
    },
  });

  const appInfo = [
    { icon: <InfoIcon className="h-4 w-4 text-slate-400" />, label: 'Versi', value: '1.0.0' },
    { icon: <CalendarIcon className="h-4 w-4 text-slate-400" />, label: 'Build', value: '2026.04.17' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 space-y-7">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-slate-500 rounded-2xl blur-md opacity-30" />
          <div className="relative p-3.5 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl shadow-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
          <p className="text-sm text-slate-400 font-medium">Konfigurasi aplikasi sesuai preferensi Anda</p>
        </div>
      </div>

      {/* APP PREFERENCES */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Preferensi Aplikasi</h2>
          <p className="text-xs text-slate-400 mt-0.5">Atur tampilan dan perilaku aplikasi</p>
        </div>
        <div className="px-5 divide-y divide-slate-100">
          <ToggleRow
            icon={<BellIcon className="h-4 w-4 text-blue-600" />}
            iconBg="bg-blue-50"
            label="Notifikasi"
            description="Tampilkan notifikasi saat menambah atau menghapus transaksi"
            checked={notifications}
            onChange={setNotifications}
          />
          <ToggleRow
            icon={<MoonIcon className="h-4 w-4 text-slate-500" />}
            iconBg="bg-slate-100"
            label="Mode Gelap"
            description="Menggunakan tema gelap"
            checked={darkMode}
            onChange={setDarkMode}
            disabled
            badge="Segera"
          />
          <ToggleRow
            icon={<DatabaseIcon className="h-4 w-4 text-slate-500" />}
            iconBg="bg-slate-100"
            label="Backup Otomatis"
            description="Backup data setiap hari secara otomatis"
            checked={autoBackup}
            onChange={setAutoBackup}
            disabled
            badge="Segera"
          />
        </div>
      </div>

      {/* DATA MANAGEMENT */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Manajemen Data</h2>
          <p className="text-xs text-slate-400 mt-0.5">Kelola data transaksi Anda</p>
        </div>

        <div className="p-5 space-y-4">
          {/* EXPORT */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <DownloadIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Ekspor Data</h3>
                <p className="text-xs text-slate-400">Download semua transaksi dalam format CSV</p>
              </div>
            </div>
            <Button
              variant="outline"
              disabled
              size="sm"
              className="rounded-xl text-xs font-semibold text-slate-400 border-slate-200"
            >
              Download CSV
            </Button>
          </div>

          {/* DANGER ZONE */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl mt-0.5">
                <ShieldAlertIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-700">Zona Berbahaya</h3>
                <p className="text-xs text-red-400 mt-0.5">
                  Tindakan di bawah ini <strong>tidak dapat dibatalkan</strong>. Lanjutkan dengan hati-hati.
                </p>
              </div>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold shadow-sm shadow-red-200"
                >
                  <Trash2Icon className="h-3.5 w-3.5 mr-1.5" />
                  Hapus Semua Data
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <AlertCircleIcon className="h-5 w-5" />
                    </div>
                    Hapus semua data transaksi?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2 pt-1">
                    <p className="text-slate-600">
                      Semua transaksi akan dihapus secara permanen dari sistem.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-600 font-semibold">Tindakan ini tidak dapat dibatalkan!</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAllMutation.mutate()}
                    disabled={deleteAllMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    {deleteAllMutation.isPending ? 'Menghapus...' : 'Ya, Hapus Semua'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-violet-50 rounded-xl">
            <InfoIcon className="h-5 w-5 text-violet-600" />
          </div>
          <h2 className="font-semibold text-slate-800">Tentang Aplikasi</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {appInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                {item.icon}
                <div>
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
            <div className="mt-0.5 p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <InfoIcon className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              Aplikasi untuk mengelola keuangan pribadi secara mudah dan aman.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}