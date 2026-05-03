// ============================================================
// lib/api.ts  –  semua endpoint terintegrasi
// Base URL backend Laravel/CI di XAMPP
// ============================================================

export const BASE_URL = 'https://app-344191b0-45f0-4353-b784-e128130e2f95.cleverapps.io/api';

// ── Helper: ambil token dari localStorage ──────────────────
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

// ============================================================
// TYPES
// ============================================================

export type TransactionAPI = {
  id: number;
  name: string;
  nominal: number;
  created_at?: string;
};

export type Transaction = {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
};

export type DashboardSummaryAPI = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  cashFlow: Record<string, { income: number; expense: number }>;
  categoryBreakdown: Record<string, number>;
};

// ── Auth ───────────────────────────────────────────────────
export type LoginPayload = { email: string; password: string };

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

// ── Profil ─────────────────────────────────────────────────
export interface UserProfile {
  // Identitas
  name: string;
  email: string;
  phone: string;
  birthDate: string;        // → birth_date di DB
  gender: 'Laki-laki' | 'Perempuan' | '';
  address: string;
  city: string;

  // Pekerjaan & Pendidikan
  occupation: string;
  company: string;
  education: 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'S2' | 'S3' | '';

  // Keuangan
  monthlyIncome: number;          // → monthly_income
  monthlyExpenseTarget: number;   // → monthly_expense_target
  monthlySavingsTarget: number;   // → monthly_savings_target

  // Keluarga
  maritalStatus: 'Lajang' | 'Menikah' | 'Cerai' | '';
  dependents: number;

  // Bank
  bankName: string;
  accountNumber: string;
}

// ── Mapper: snake_case (DB) → camelCase (frontend) ─────────
export function mapProfileFromAPI(raw: Record<string, any>): UserProfile {
  return {
    name: raw.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    birthDate: raw.birth_date ?? '',
    gender: raw.gender ?? '',
    address: raw.address ?? '',
    city: raw.city ?? '',
    occupation: raw.occupation ?? '',
    company: raw.company ?? '',
    education: raw.education ?? '',
    monthlyIncome: Number(raw.monthly_income ?? 0),
    monthlyExpenseTarget: Number(raw.monthly_expense_target ?? 0),
    monthlySavingsTarget: Number(raw.monthly_savings_target ?? 0),
    maritalStatus: raw.marital_status ?? '',
    dependents: Number(raw.dependents ?? 0),
    bankName: raw.bank_name ?? '',
    accountNumber: raw.account_number ?? '',
  };
}

// ── Mapper: camelCase (frontend) → snake_case (DB/API) ─────
export function mapProfileToAPI(data: UserProfile): Record<string, any> {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    birth_date: data.birthDate,
    gender: data.gender,
    address: data.address,
    city: data.city,
    occupation: data.occupation,
    company: data.company,
    education: data.education,
    monthly_income: data.monthlyIncome,
    monthly_expense_target: data.monthlyExpenseTarget,
    monthly_savings_target: data.monthlySavingsTarget,
    marital_status: data.maritalStatus,
    dependents: data.dependents,
    bank_name: data.bankName,
    account_number: data.accountNumber,
  };
}

// ============================================================
// AUTH FUNCTIONS
// ============================================================

/**
 * Login – POST /api/auth/login
 * Backend harus return { token, user: { id, name, email } }
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Email atau password salah');
  }
  const data: AuthResponse = await res.json();
  // Simpan token & user ke localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
};

/**
 * Logout – POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch {
    // Abaikan error jaringan saat logout
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
  }
};

/**
 * Ambil user yang sedang login dari localStorage
 */
export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Cek apakah user sudah login
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

// ============================================================
// PROFILE FUNCTIONS
// ============================================================

/**
 * GET /api/profile
 * Backend mengembalikan data profil user yang sedang login
 */
export const getProfile = async (): Promise<UserProfile> => {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengambil data profil');
  const raw = await res.json();
  return mapProfileFromAPI(raw);
};

/**
 * PUT /api/profile
 * Simpan/update profil user
 */
export const updateProfile = async (data: UserProfile): Promise<UserProfile> => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(mapProfileToAPI(data)),
  });
  if (!res.ok) throw new Error('Gagal menyimpan profil');
  const raw = await res.json();
  return mapProfileFromAPI(raw);
};

// ============================================================
// TRANSACTION HELPER
// ============================================================

export function parseTransaction(t: TransactionAPI): Transaction {
  const prefixMatch = t.name.match(/^\[(income|expense)\]\s*/);
  const type: 'income' | 'expense' = prefixMatch
    ? (prefixMatch[1] as 'income' | 'expense')
    : 'expense';
  const category = prefixMatch ? t.name.replace(prefixMatch[0], '') : t.name;
  return {
    id: t.id,
    type,
    category,
    amount: t.nominal,
    description: '',
    date: t.created_at ?? new Date().toISOString(),
  };
}

// ============================================================
// TRANSACTION FUNCTIONS
// ============================================================

export const getTransactions = async (
  startDate?: string,
  endDate?: string
): Promise<TransactionAPI[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${BASE_URL}/transactions${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error('Gagal mengambil data transaksi');
  return res.json();
};

export const createTransaction = async (data: {
  name: string;
  nominal: number;
}): Promise<TransactionAPI> => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Gagal membuat transaksi');
  return res.json();
};

export const deleteAllTransactions = async (): Promise<number> => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus semua transaksi');
  const text = await res.text();
  return text ? JSON.parse(text) : 0;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus transaksi');
};

export const getDashboardSummary = async (
  startDate?: string,
  endDate?: string
): Promise<DashboardSummaryAPI> => {
  const rawList = await getTransactions(startDate, endDate);
  const list = rawList.map(parseTransaction);

  let totalIncome = 0;
  let totalExpense = 0;
  const cashFlow: Record<string, { income: number; expense: number }> = {};
  const categoryBreakdown: Record<string, number> = {};

  for (const t of list) {
    const monthKey = t.date.split('T')[0].substring(0, 7);
    if (!cashFlow[monthKey]) cashFlow[monthKey] = { income: 0, expense: 0 };

    if (t.type === 'income') {
      totalIncome += t.amount;
      cashFlow[monthKey].income += t.amount;
    } else {
      totalExpense += t.amount;
      cashFlow[monthKey].expense += t.amount;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] ?? 0) + t.amount;
    }
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: list.length,
    cashFlow,
    categoryBreakdown,
  };
};

// ============================================================
// API OBJECT
// ============================================================

export const api = {
  // Auth
  login,
  logout,
  getAuthUser,
  isAuthenticated,
  // Profil
  getProfile,
  updateProfile,
  // Transaksi
  getTransactions,
  createTransaction,
  deleteTransaction,
  deleteAllTransactions,
  getDashboardSummary,
};