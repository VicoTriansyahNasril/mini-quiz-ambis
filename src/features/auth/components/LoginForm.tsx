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
import { LogIn, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/lib/utils';
import { parseApiError } from '@/lib/error-handler';

export default function LoginForm() {
    const router = useRouter();
    const { mutate, isPending } = useLogin();
    const [globalError, setGlobalError] = useState<string | null>(null);

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

    const onSubmit = (data: LoginInput) => {
        setGlobalError(null);

        mutate(data, {
            onSuccess: (response) => {
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.access_token);
                toast.success('Login Berhasil! Mengalihkan...');
                router.push('/dashboard');
            },
            onError: (error) => {
                const errorMessage = parseApiError(error);
                const status = error.response?.status;

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
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-white ring-1 ring-slate-100 backdrop-blur-xl">
            <div className="mb-8 text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Selamat Datang
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                    Masukkan akun Anda untuk melanjutkan belajar.
                </p>
            </div>

            {globalError && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <p className="font-medium leading-relaxed">{globalError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="space-y-4">
                    <Input
                        label="Email Address"
                        placeholder="contoh: nama@email.com"
                        type="email"
                        autoComplete="email"
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

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                    >
                        {isPending ? 'Memproses...' : 'Masuk Sekarang'}
                        {!isPending && <LogIn size={20} className="ml-2" />}
                    </Button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    Belum memiliki akun?{' '}
                    <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors ml-1">
                        Daftar Gratis
                    </Link>
                </p>
            </div>
        </div>
    );
}