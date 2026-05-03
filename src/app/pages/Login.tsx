import { useState } from 'react';
import {
    MailIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    ArrowRightIcon,
    WalletIcon,
    Loader2Icon,
} from 'lucide-react';
import { api } from '../lib/api';

// ── Reusable Field ─────────────────────────────────────────
interface FieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    icon: React.ReactNode;
    error?: string;
    disabled?: boolean;
    rightEl?: React.ReactNode;
    autoComplete?: string;
}

function Field({
    label, type, value, onChange, placeholder, icon,
    error, disabled, rightEl, autoComplete,
}: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={[
                        'w-full pl-10 py-3 rounded-xl border-2 text-sm font-medium outline-none transition-all duration-150',
                        rightEl ? 'pr-11' : 'pr-4',
                        error
                            ? 'border-rose-300 bg-rose-50 text-rose-800 placeholder-rose-300'
                            : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-300 focus:border-indigo-400 focus:bg-white focus:shadow-md focus:shadow-indigo-100/60',
                        disabled ? 'opacity-60 cursor-not-allowed' : '',
                    ].join(' ')}
                />
                {rightEl && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>
                )}
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold pl-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ── Login Page ─────────────────────────────────────────────
interface LoginProps {
    onLoginSuccess: () => void;
    onSwitchToRegister?: () => void;
}

export default function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [emailErr, setEmailErr] = useState('');
    const [passErr, setPassErr] = useState('');
    const [globalErr, setGlobalErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        let ok = true;
        setEmailErr(''); setPassErr(''); setGlobalErr('');

        if (!email.trim()) {
            setEmailErr('Email tidak boleh kosong.'); ok = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailErr('Format email tidak valid.'); ok = false;
        }
        if (!password) {
            setPassErr('Password tidak boleh kosong.'); ok = false;
        } else if (password.length < 6) {
            setPassErr('Password minimal 6 karakter.'); ok = false;
        }
        return ok;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await api.login({ email, password });
            onLoginSuccess();
        } catch (err: any) {
            setGlobalErr(err.message || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col items-center justify-center p-4">

            {/* Background decorations */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-100/50 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-50/40 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">

                {/* ── Branding ── */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-30 scale-110" />
                            <div className="relative p-4 bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 rounded-2xl shadow-xl">
                                <WalletIcon className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Keuangan Anda</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Aplikasi manajemen keuangan pribadi</p>
                </div>

                {/* ── Card ── */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500" />

                    <div className="p-7 space-y-6">
                        <div className="text-center">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Masuk ke Akun</h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Silakan masukkan email dan password Anda
                            </p>
                        </div>

                        {/* Global error */}
                        {globalErr && (
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
                                <span className="text-base flex-shrink-0">⚠️</span>
                                <p className="text-sm text-rose-700 font-semibold">{globalErr}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <Field
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(v) => { setEmail(v); setEmailErr(''); setGlobalErr(''); }}
                                placeholder="nama@email.com"
                                icon={<MailIcon className="h-4 w-4" />}
                                error={emailErr}
                                disabled={isLoading}
                                autoComplete="email"
                            />

                            <Field
                                label="Password"
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={(v) => { setPassword(v); setPassErr(''); setGlobalErr(''); }}
                                placeholder="Masukkan password Anda"
                                icon={<LockIcon className="h-4 w-4" />}
                                error={passErr}
                                disabled={isLoading}
                                autoComplete="current-password"
                                rightEl={
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((s) => !s)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPass
                                            ? <EyeOffIcon className="h-4 w-4" />
                                            : <EyeIcon className="h-4 w-4" />}
                                    </button>
                                }
                            />

                            <div className="flex justify-end -mt-1">
                                <button
                                    type="button"
                                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                                >
                                    Lupa password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><Loader2Icon className="h-4 w-4 animate-spin" />Masuk...</>
                                ) : (
                                    <>Masuk<ArrowRightIcon className="h-4 w-4" /></>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-slate-400 font-medium">
                            Belum punya akun?{' '}
                            <button
                                onClick={onSwitchToRegister}
                                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                Daftar sekarang
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                    Dengan masuk, Anda menyetujui kebijakan privasi kami.
                </p>
            </div>
        </div>
    );
}