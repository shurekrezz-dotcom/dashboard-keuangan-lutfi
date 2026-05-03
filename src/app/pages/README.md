# Halaman Dashboard Keuangan

Folder ini berisi semua halaman (pages) aplikasi Dashboard Personal Finance dalam bahasa Indonesia.

## Daftar Halaman

### 1. **Beranda.tsx** 📊
- **URL:** `/`
- **Deskripsi:** Halaman utama dashboard yang menampilkan ringkasan keuangan
- **Fitur:**
  - Filter periode waktu (harian, mingguan, bulanan, tahunan, custom)
  - Kartu statistik (Total Pemasukan, Total Pengeluaran, Saldo, Jumlah Transaksi)
  - Grafik Arus Kas (Area Chart pemasukan vs pengeluaran)
  - Grafik Kategori Pengeluaran (Pie Chart)

### 2. **Transaksi.tsx** 💸
- **URL:** `/transaksi`
- **Deskripsi:** Halaman untuk mengelola semua transaksi keuangan
- **Fitur:**
  - Form tambah transaksi baru (Pemasukan/Pengeluaran)
  - Daftar semua transaksi dengan detail lengkap
  - Filter transaksi berdasarkan periode
  - Hapus transaksi
  - Format mata uang Rupiah otomatis

### 3. **Laporan.tsx** 📈
- **URL:** `/laporan`
- **Deskripsi:** Halaman laporan keuangan lengkap dengan analisis mendalam
- **Fitur:**
  - Statistik detail (Total, Rata-rata, Tingkat Tabungan)
  - Grafik Arus Kas dengan trend analysis
  - Grafik Kategori Pengeluaran
  - Breakdown detail per kategori dengan progress bar
  - Perhitungan savings rate (tingkat tabungan)

### 4. **Kategori.tsx** 🏷️
- **URL:** `/kategori`
- **Deskripsi:** Halaman manajemen kategori transaksi
- **Fitur:**
  - Daftar kategori pemasukan (6 kategori)
  - Daftar kategori pengeluaran (9 kategori)
  - Tips penggunaan kategori
  - Visual indicator untuk setiap kategori

### 5. **Pengaturan.tsx** ⚙️
- **URL:** `/pengaturan`
- **Deskripsi:** Halaman pengaturan aplikasi
- **Fitur:**
  - Toggle notifikasi
  - Mode gelap (coming soon)
  - Backup otomatis (coming soon)
  - Ekspor data CSV (coming soon)
  - Hapus semua data (danger zone)
  - Informasi aplikasi (versi, build, tech stack)

## Navigasi

Semua halaman dapat diakses melalui navigation bar yang terletak di bagian atas aplikasi. Navigation bar menampilkan:
- Icon untuk setiap halaman
- Nama halaman dalam bahasa Indonesia
- Active state indicator (border biru di bawah)
- Responsive horizontal scroll untuk mobile

## Struktur Routing

```
/                  → Beranda (Dashboard utama)
/transaksi         → Halaman Transaksi
/laporan           → Halaman Laporan
/kategori          → Halaman Kategori
/pengaturan        → Halaman Pengaturan
```

## Teknologi

- **React Router**: Routing dan navigasi
- **React Query**: Data fetching dan caching
- **Recharts**: Visualisasi data chart
- **Shadcn/ui**: Komponen UI
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling

## Cara Menggunakan

Setiap halaman merupakan komponen React standalone yang di-export sebagai default export. Routing dikonfigurasi di `/src/app/routes.tsx` dan layout aplikasi di `/src/app/Layout.tsx`.

Untuk menambah halaman baru:
1. Buat file baru di folder `pages/` dengan nama dalam bahasa Indonesia
2. Tambahkan route di `routes.tsx`
3. Tambahkan item navigasi di `Layout.tsx`
