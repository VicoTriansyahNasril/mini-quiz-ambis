'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyForm() {
    const router = useRouter();

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 max-w-md w-full">
            <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 animate-in zoom-in duration-300">
                        <Mail size={40} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 border-4 border-white animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                        <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">Cek Email Anda</h2>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                    Kami telah mengirimkan tautan verifikasi. <br />
                    Silakan <b>klik tautan tersebut</b> untuk mengaktifkan akun.
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 shadow-lg shadow-blue-600/20"
                >
                    Saya Sudah Verifikasi, Login <ArrowRight size={18} className="ml-2" />
                </Button>

                <p className="text-xs text-center text-slate-400">
                    Tidak menerima email? Cek folder <b>Spam</b> atau <b>Promosi</b>.
                </p>
            </div>
        </div>
    );
}