/**
 * Format angka menjadi format Rupiah
 * @param amount - Jumlah dalam angka
 * @returns String format Rupiah (e.g., "Rp 1.000.000")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format tanggal ke format bulan-tahun
 */
export function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get date range for period presets
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'year' | 'all'): { startDate: string; endDate: string } | null {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  let startDate: string;

  switch (period) {
    case 'today':
      startDate = endDate;
      break;
    case 'week':
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      startDate = weekAgo.toISOString().split('T')[0];
      break;
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      startDate = monthAgo.toISOString().split('T')[0];
      break;
    case 'year':
      const yearAgo = new Date(today);
      yearAgo.setFullYear(today.getFullYear() - 1);
      startDate = yearAgo.toISOString().split('T')[0];
      break;
    case 'all':
      return null;
    default:
      return null;
  }

  return { startDate, endDate };
}

/**
 * Format period key based on date range
 */
export function formatPeriodKey(periodKey: string, daysDiff: number): string {
  if (daysDiff <= 31) {
    // Daily format: DD MMM
    const date = new Date(periodKey);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  } else if (daysDiff <= 365) {
    // Monthly format: MMM YYYY
    return formatMonthYear(periodKey);
  } else {
    // Yearly format: YYYY
    return periodKey;
  }
}