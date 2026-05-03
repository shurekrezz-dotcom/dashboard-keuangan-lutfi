import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  WalletIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  FileTextIcon,
  TagIcon,
  SettingsIcon,
  UserCircle2Icon,
  LogOutIcon,
} from 'lucide-react';
import { api, getAuthUser } from './lib/api';
import { toast } from 'sonner';

const navigation = [
  { name: 'Beranda', href: '/', icon: LayoutDashboardIcon },
  { name: 'Transaksi', href: '/transaksi', icon: ReceiptIcon },
  { name: 'Laporan', href: '/laporan', icon: FileTextIcon },
  { name: 'Kategori', href: '/kategori', icon: TagIcon },
  { name: 'Pengaturan', href: '/pengaturan', icon: SettingsIcon },
  { name: 'Profil', href: '/profil', icon: UserCircle2Icon },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = getAuthUser();

  // Dengarkan event logout dari App.tsx
  useEffect(() => {
    const handler = () => navigate('/');
    window.addEventListener('app:logout', handler);
    return () => window.removeEventListener('app:logout', handler);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.logout();
      toast.success('Berhasil keluar');
      // Trigger App.tsx untuk set loggedIn = false
      window.dispatchEvent(new Event('app:logout'));
      // Hard reload agar state React bersih total
      setTimeout(() => window.location.reload(), 300);
    } catch {
      toast.error('Gagal logout, coba lagi');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <WalletIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Dashboard Keuangan
                </h1>
                <p className="text-xs text-gray-500 leading-tight">
                  Kelola keuangan pribadi Anda
                </p>
              </div>
            </div>

            {/* User info + Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Nama user — hanya tampil di layar sedang ke atas */}
              {authUser?.name && (
                <Link
                  to="/profil"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-white">
                      {authUser.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 max-w-[120px] truncate">
                    {authUser.name}
                  </span>
                </Link>
              )}

              {/* Tombol Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-xl transition-all duration-150"
                title="Keluar"
              >
                <LogOutIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Navigasi ────────────────────────────────────────────── */}
      <nav className="bg-white border-b sticky top-[57px] z-10">
        <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
          <div className="flex space-x-0.5 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors flex-shrink-0
                    ${isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="w-full px-0 sm:px-4 py-6 overflow-x-hidden">
        <div className="max-w-5xl mx-auto w-full min-w-0">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-white border-t mt-12">
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-5">
          <p className="text-center text-sm text-gray-400">
            Dashboard Personal Finance © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}