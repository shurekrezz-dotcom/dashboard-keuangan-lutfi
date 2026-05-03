import { createBrowserRouter } from 'react-router';
import Layout from './Layout';
import Beranda from './pages/Beranda';
import Transaksi from './pages/Transaksi';
import Laporan from './pages/Laporan';
import Kategori from './pages/Kategori';
import Pengaturan from './pages/Pengaturan';
import Profil from './pages/Profil';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Beranda />,
      },
      {
        path: 'transaksi',
        element: <Transaksi />,
      },
      {
        path: 'laporan',
        element: <Laporan />,
      },
      {
        path: 'kategori',
        element: <Kategori />,
      },
      {
        path: 'pengaturan',
        element: <Pengaturan />,
      },
      {
        path: 'profil',
        element: <Profil />,
      },
    ],
  },
]);