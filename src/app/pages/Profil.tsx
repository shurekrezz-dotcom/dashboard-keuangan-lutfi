import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    UserCircle2Icon,
    BriefcaseIcon,
    MapPinIcon,
    WalletIcon,
    PiggyBankIcon,
    CreditCardIcon,
    PencilIcon,
    CheckIcon,
    XIcon,
    Loader2Icon,
    UserIcon,
    BadgeCheckIcon,
    TrendingUpIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { api, UserProfile } from '../lib/api';
import { formatRupiah } from '../lib/utils';

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, color }: {
    icon: React.ReactNode; title: string; subtitle: string; color: string;
}) {
    return (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className={`p-2 ${color} rounded-xl`}>{icon}</div>
            <div>
                <h2 className="font-semibold text-slate-800">{title}</h2>
                <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
        </div>
    );
}

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    prefix?: string;
    disabled?: boolean;
    options?: string[];
}

function InputField({ label, value, onChange, type = 'text', placeholder, prefix, disabled, options }: InputFieldProps) {
    const baseClass = `
    w-full rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-medium text-slate-800
    outline-none transition-all duration-150 py-2.5
    focus:border-indigo-400 focus:bg-white focus:shadow-md focus:shadow-indigo-100/50
    disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-300
    ${prefix ? 'pl-14 pr-3' : 'px-3'}
  `;

    return (
        <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none select-none">
                        {prefix}
                    </span>
                )}
                {options ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={baseClass}
                    >
                        <option value="">— Pilih —</option>
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={baseClass}
                    />
                )}
            </div>
        </div>
    );
}

function Avatar({ name }: { name: string }) {
    const initials = name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?';
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-lg opacity-40 scale-110" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-black text-white tracking-tight">{initials}</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
                <BadgeCheckIcon className="h-3.5 w-3.5 text-white" />
            </div>
        </div>
    );
}

// ── Default kosong ─────────────────────────────────────────────────────────────
const emptyProfile: UserProfile = {
    name: '', email: '', phone: '', birthDate: '', gender: '',
    address: '', city: '', occupation: '', company: '', education: '',
    monthlyIncome: 0, monthlyExpenseTarget: 0, monthlySavingsTarget: 0,
    maritalStatus: '', dependents: 0, bankName: '', accountNumber: '',
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Profil() {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<UserProfile | null>(null);

    // ── Fetch profil dari backend ─────────────────────────────
    const { data: profile, isLoading, isError } = useQuery<UserProfile>({
        queryKey: ['user-profile'],
        queryFn: api.getProfile,          // ← GET /api/profile (dengan Bearer token)
        staleTime: 5 * 60 * 1000,        // cache 5 menit
        retry: 1,
    });

    // ── Simpan profil ke backend ──────────────────────────────
    const mutation = useMutation({
        mutationFn: api.updateProfile,    // ← PUT /api/profile
        onSuccess: (saved) => {
            queryClient.setQueryData(['user-profile'], saved);
            toast.success('Profil berhasil disimpan');
            setIsEditing(false);
            setDraft(null);
        },
        onError: (err: any) => {
            toast.error(err?.message ?? 'Gagal menyimpan profil');
        },
    });

    const current: UserProfile = draft ?? profile ?? emptyProfile;

    const set = (key: keyof UserProfile) => (value: string) => {
        setDraft((prev) => ({
            ...current,
            ...prev,
            [key]: (key.includes('monthly') || key === 'dependents')
                ? Number(value)
                : value,
        }));
    };

    const startEdit = () => { setDraft({ ...current }); setIsEditing(true); };
    const cancelEdit = () => { setDraft(null); setIsEditing(false); };
    const saveEdit = () => { if (draft) mutation.mutate(draft); };

    // Progress kelengkapan profil
    const completionFields: (keyof UserProfile)[] = ['name', 'email', 'phone', 'occupation', 'monthlyIncome', 'city'];
    const filled = completionFields.filter((f) => !!current[f]).length;
    const pct = Math.round((filled / completionFields.length) * 100);

    // ── Loading & Error states ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2Icon className="h-8 w-8 text-indigo-400 animate-spin" />
                    <p className="text-sm text-slate-400">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-3xl">⚠️</p>
                    <p className="text-sm font-semibold text-slate-700">Gagal memuat profil</p>
                    <p className="text-xs text-slate-400">Periksa koneksi atau sesi login Anda</p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['user-profile'] })}
                        className="mt-3 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Coba lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/70 p-6 space-y-7">

            {/* ── HERO HEADER ── */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-400/10 rounded-full translate-y-1/2 -translate-x-1/3" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <Avatar name={current.name} />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Profil Pengguna</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight truncate">
                            {current.name || 'Nama belum diisi'}
                        </h1>
                        <p className="text-sm text-white/50 font-medium mt-0.5">
                            {current.occupation || 'Pekerjaan belum diisi'}
                            {current.company ? ` · ${current.company}` : ''}
                        </p>
                        {current.city && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <MapPinIcon className="h-3.5 w-3.5 text-white/40" />
                                <span className="text-xs text-white/40">{current.city}</span>
                            </div>
                        )}
                    </div>

                    {/* Edit / Save buttons */}
                    <div className="flex gap-2 shrink-0 self-start sm:self-center">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={cancelEdit}
                                    disabled={mutation.isPending}
                                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all"
                                >
                                    <XIcon className="h-3.5 w-3.5" />Batal
                                </button>
                                <button
                                    onClick={saveEdit}
                                    disabled={mutation.isPending}
                                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/30 transition-all"
                                >
                                    {mutation.isPending
                                        ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                                        : <CheckIcon className="h-3.5 w-3.5" />}
                                    Simpan
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={startEdit}
                                className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold rounded-xl transition-all"
                            >
                                <PencilIcon className="h-3.5 w-3.5" />Edit Profil
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar kelengkapan */}
                <div className="relative mt-5 pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50">Kelengkapan Profil</span>
                        <span className="text-xs font-black text-white/70 tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── FINANCIAL SUMMARY (read-only) ── */}
            {!isEditing && (
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: 'Pemasukan / Bulan',
                            value: formatRupiah(current.monthlyIncome),
                            icon: <TrendingUpIcon className="h-4 w-4 text-white" />,
                            gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
                            shadow: 'shadow-emerald-200',
                        },
                        {
                            label: 'Target Pengeluaran',
                            value: formatRupiah(current.monthlyExpenseTarget),
                            icon: <WalletIcon className="h-4 w-4 text-white" />,
                            gradient: 'bg-gradient-to-br from-rose-500 to-red-600',
                            shadow: 'shadow-rose-200',
                        },
                        {
                            label: 'Target Tabungan',
                            value: formatRupiah(current.monthlySavingsTarget),
                            icon: <PiggyBankIcon className="h-4 w-4 text-white" />,
                            gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
                            shadow: 'shadow-violet-200',
                        },
                    ].map((card) => (
                        <div key={card.label} className={`relative rounded-2xl overflow-hidden ${card.gradient} p-5 shadow-lg ${card.shadow}`}>
                            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{card.label}</span>
                                    <div className="p-1.5 bg-white/20 rounded-xl">{card.icon}</div>
                                </div>
                                <p className="text-lg font-black text-white tracking-tight">
                                    {card.value === 'Rp 0' ? '—' : card.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── SECTION 1: Identitas Diri ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                <SectionHeader
                    icon={<UserIcon className="h-5 w-5 text-blue-600" />}
                    title="Identitas Diri"
                    subtitle="Informasi pribadi dan kontak"
                    color="bg-blue-50"
                />
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                    <InputField label="Nama Lengkap" value={current.name} onChange={set('name')} placeholder="Masukkan nama lengkap" disabled={!isEditing} />
                    <InputField label="Email" value={current.email} onChange={set('email')} type="email" placeholder="nama@email.com" disabled={!isEditing} />
                    <InputField label="Nomor Telepon" value={current.phone} onChange={set('phone')} type="tel" placeholder="08xx-xxxx-xxxx" disabled={!isEditing} />
                    <InputField label="Tanggal Lahir" value={current.birthDate} onChange={set('birthDate')} type="date" disabled={!isEditing} />
                    <InputField label="Jenis Kelamin" value={current.gender} onChange={set('gender')} disabled={!isEditing} options={['Laki-laki', 'Perempuan']} />
                    <InputField label="Status Pernikahan" value={current.maritalStatus} onChange={set('maritalStatus')} disabled={!isEditing} options={['Lajang', 'Menikah', 'Cerai']} />
                    <InputField label="Kota / Kabupaten" value={current.city} onChange={set('city')} placeholder="Jakarta, Malang, dll." disabled={!isEditing} />
                    <div className="sm:col-span-2">
                        <InputField label="Alamat Lengkap" value={current.address} onChange={set('address')} placeholder="Jl. Contoh No.1, RT 01/RW 02" disabled={!isEditing} />
                    </div>
                </div>
            </div>

            {/* ── SECTION 2: Pekerjaan & Pendidikan ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                <SectionHeader
                    icon={<BriefcaseIcon className="h-5 w-5 text-amber-600" />}
                    title="Pekerjaan & Pendidikan"
                    subtitle="Data profesi dan latar pendidikan"
                    color="bg-amber-50"
                />
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                    <InputField label="Pekerjaan / Jabatan" value={current.occupation} onChange={set('occupation')} placeholder="Karyawan, Wirausaha, Freelancer…" disabled={!isEditing} />
                    <InputField label="Nama Perusahaan / Instansi" value={current.company} onChange={set('company')} placeholder="PT Contoh Maju" disabled={!isEditing} />
                    <InputField label="Pendidikan Terakhir" value={current.education} onChange={set('education')} disabled={!isEditing} options={['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3']} />
                    <InputField label="Jumlah Tanggungan" value={current.dependents} onChange={set('dependents')} type="number" placeholder="0" disabled={!isEditing} />
                </div>
            </div>

            {/* ── SECTION 3: Keuangan Bulanan ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <SectionHeader
                    icon={<WalletIcon className="h-5 w-5 text-emerald-600" />}
                    title="Keuangan Bulanan"
                    subtitle="Gaji dan target keuangan per bulan"
                    color="bg-emerald-50"
                />
                <div className="p-5 grid sm:grid-cols-3 gap-4">
                    <InputField label="Gaji / Pemasukan" value={current.monthlyIncome || ''} onChange={set('monthlyIncome')} type="number" placeholder="5000000" prefix="Rp" disabled={!isEditing} />
                    <InputField label="Target Pengeluaran" value={current.monthlyExpenseTarget || ''} onChange={set('monthlyExpenseTarget')} type="number" placeholder="3000000" prefix="Rp" disabled={!isEditing} />
                    <InputField label="Target Tabungan" value={current.monthlySavingsTarget || ''} onChange={set('monthlySavingsTarget')} type="number" placeholder="1000000" prefix="Rp" disabled={!isEditing} />
                </div>

                {/* Simulasi alokasi */}
                {current.monthlyIncome > 0 && (
                    <div className="mx-5 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulasi Alokasi</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            {[
                                { label: 'Pemasukan', val: current.monthlyIncome, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                                { label: 'Pengeluaran', val: current.monthlyExpenseTarget, color: 'text-rose-700 bg-rose-50 border-rose-200' },
                                { label: 'Tabungan', val: current.monthlySavingsTarget, color: 'text-violet-700 bg-violet-50 border-violet-200' },
                                {
                                    label: 'Sisa',
                                    val: current.monthlyIncome - current.monthlyExpenseTarget - current.monthlySavingsTarget,
                                    color: (current.monthlyIncome - current.monthlyExpenseTarget - current.monthlySavingsTarget) >= 0
                                        ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                                        : 'text-rose-700 bg-rose-50 border-rose-200',
                                },
                            ].map((item) => (
                                <div key={item.label} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${item.color}`}>
                                    <span className="opacity-70">{item.label}: </span>
                                    {formatRupiah(item.val)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── SECTION 4: Rekening Bank ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-violet-400 to-indigo-500" />
                <SectionHeader
                    icon={<CreditCardIcon className="h-5 w-5 text-violet-600" />}
                    title="Rekening Bank"
                    subtitle="Informasi rekening untuk referensi"
                    color="bg-violet-50"
                />
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                    <InputField label="Nama Bank" value={current.bankName} onChange={set('bankName')} placeholder="BCA, Mandiri, BNI…" disabled={!isEditing} />
                    <InputField label="Nomor Rekening" value={current.accountNumber} onChange={set('accountNumber')} placeholder="1234567890" disabled={!isEditing} />
                </div>
                <div className="mx-5 mb-5 flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="text-base flex-shrink-0">🔒</span>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Data rekening disimpan hanya sebagai referensi dan <strong>tidak digunakan</strong> untuk transaksi apapun.
                    </p>
                </div>
            </div>

            {/* ── Save button bawah (editing mode) ── */}
            {isEditing && (
                <div className="flex gap-3 pb-4">
                    <button
                        onClick={cancelEdit}
                        disabled={mutation.isPending}
                        className="flex-1 py-3.5 bg-white border-2 border-slate-200 text-slate-600 text-sm font-bold rounded-2xl hover:bg-slate-50 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={saveEdit}
                        disabled={mutation.isPending}
                        className="flex-[2] flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
                    >
                        {mutation.isPending
                            ? <><Loader2Icon className="h-4 w-4 animate-spin" />Menyimpan...</>
                            : <><CheckIcon className="h-4 w-4" />Simpan Profil</>}
                    </button>
                </div>
            )}
        </div>
    );
}