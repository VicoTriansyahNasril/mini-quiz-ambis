'use client';

import ProfileForm from '@/features/profile/components/ProfileForm';
import ChangePasswordForm from '@/features/profile/components/ChangePasswordForm';
import { User, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { STORAGE_KEYS } from '@/lib/utils';
import { useQuizStore } from '@/features/quiz/store/quizStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const { resetAnswers } = useQuizStore();

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar dari akun?')) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            resetAnswers();
            router.replace('/login');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-blue-600 to-indigo-600" />

                <div className="relative pt-16">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto p-1.5 shadow-lg mb-4">
                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User size={40} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola data diri dan keamanan akun Anda</p>
                </div>
            </div>

            <div className="grid gap-6">
                <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Data Diri</h2>
                    </div>
                    <ProfileForm />
                </section>

                <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                        <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Keamanan</h2>
                    </div>
                    <ChangePasswordForm />
                </section>

                <div className="pt-8 flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 px-8 py-3 h-auto"
                    >
                        <LogOut size={18} className="mr-2" /> Keluar dari Aplikasi
                    </Button>
                </div>
            </div>
        </div>
    );
}