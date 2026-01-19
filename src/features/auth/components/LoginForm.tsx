'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginInput } from '../types';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogIn, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/lib/utils';
import { parseApiError } from '@/lib/error-handler';

export default function LoginForm() {
    const router = useRouter();
    const { mutate, isPending } = useLogin();
    // [DOCS] State untuk error global (misal: "Server Error") yang tidak terikat pada field input tertentu.
    const [globalError, setGlobalError] = useState<string | null>(null);

    // [DOCS] Inisialisasi React Hook Form dengan validasi Zod schema.
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    // [DOCS] Handler saat form disubmit.
    const onSubmit = (data: LoginInput) => {
        setGlobalError(null);

        mutate(data, {
            onSuccess: (response) => {
                // [DOCS] Simpan Access Token ke LocalStorage untuk dipakai di request berikutnya.
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.access_token);
                toast.success('Login Berhasil! Mengalihkan...');
                router.push('/dashboard');
            },
            onError: (error) => {
                const errorMessage = parseApiError(error);
                const status = error.response?.status;

                // [DOCS] Penanganan error spesifik untuk UX yang lebih baik:
                // 401 = Unauthorized (Password/Email salah).
                // 404 = Not Found (Email tidak terdaftar).
                if (status === 401) {
                    setError('root', { type: 'manual', message: errorMessage });
                    setError('email', { type: 'manual', message: ' ' });
                    setError('password', { type: 'manual', message: 'Email atau password salah.' });
                } else if (status === 404) {
                    setError('email', { type: 'manual', message: 'Email tidak terdaftar.' });
                } else {
                    setGlobalError(errorMessage);
                }

                toast.error(errorMessage);
            }
        });
    };

    return (
        <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
            {/* [DOCS] Background decorative elements (Blur effects) */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-56 h-56 bg-linear-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-8 text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-full mb-2">
                        <Sparkles size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Ambitious Learning</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text">
                        Selamat Datang Kembali
                    </h2>
                    <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                        Masuk untuk melanjutkan perjalanan belajar dan raih prestasi terbaikmu
                    </p>
                </div>

                {/* [DOCS] Alert Box untuk menampilkan error global jika ada */}
                {globalError && (
                    <div className="mb-6 bg-linear-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <p className="font-medium leading-relaxed">{globalError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            placeholder="contoh: nama@email.com"
                            type="email"
                            autoComplete="email"
                            // [DOCS] Menghubungkan input dengan React Hook Form
                            error={errors.email?.message || (errors.root ? " " : undefined)}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            placeholder="Masukkan kata sandi"
                            type="password"
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-[0.98] transition-all duration-200 relative overflow-hidden group"
                        >
                            {/* [DOCS] Animasi shimmer pada button */}
                            <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative flex items-center justify-center gap-2">
                                {isPending ? 'Memproses...' : 'Masuk Sekarang'}
                                {!isPending && <LogIn size={20} />}
                            </span>
                        </Button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Belum memiliki akun?{' '}
                        <Link
                            href="/register"
                            className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 font-bold hover:from-blue-700 hover:to-indigo-700 transition-all ml-1 inline-flex items-center gap-1 group"
                        >
                            Daftar Gratis
                            <span className="inline-block group-hover:translate-x-0.5 transition-transform">→</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}