'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../types';
import { useRegister } from '../hooks/useRegister';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function RegisterForm() {
    // [DOCS] Menggunakan hook register yang sudah dibuat sebelumnya.
    const { mutate, isPending } = useRegister();

    // [DOCS] Setup form dengan validasi schema register (validasi password kuat ada di sini).
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        mode: 'onTouched', // Validasi mentrigger saat field disentuh/blur
    });

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h2>
            </div>

            {/* [DOCS] Form submission langsung memanggil fungsi mutate */}
            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
                <Input
                    label="Nama Lengkap"
                    placeholder="Contoh: Kucing Manis"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="nama@email.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 8 karakter"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3"
                        isLoading={isPending}
                    >
                        Daftar Sekarang <ArrowRight size={18} className="ml-2" />
                    </Button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors">
                        Login Disini
                    </Link>
                </p>
            </div>
        </div>
    );
}