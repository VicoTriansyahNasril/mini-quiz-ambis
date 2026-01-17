'use client';

import { AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QuizSession } from '../../types';

interface Props {
    session: QuizSession | null | undefined;
    isExpired: boolean;
    isCleaning: boolean;
    onContinue: () => void;
    onClean: () => void;
}

export default function ActiveSessionBanner({ session, isExpired, isCleaning, onContinue, onClean }: Props) {
    if (!session) return null;

    if (isExpired) {
        return (
            <div className="bg-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <AlertCircle size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Sesi Terbengkalai Ditemukan</h3>
                        <p className="text-amber-50 text-sm mt-1">
                            Waktu sesi <b>{session.subtest_name}</b> sudah habis. Harap bersihkan sesi untuk memulai baru.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onClean}
                    isLoading={isCleaning}
                    className="bg-white text-amber-700 hover:bg-amber-50 border-none w-full md:w-auto"
                >
                    <Trash2 size={18} className="mr-2" /> Bersihkan Sesi
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertCircle size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Sesi Kuis Sedang Berlangsung</h3>
                    <p className="text-blue-100 text-sm mt-1">
                        Anda memiliki sesi <b>{session.subtest_name}</b> yang belum diselesaikan.
                    </p>
                </div>
            </div>
            <Button
                onClick={onContinue}
                className="bg-white text-blue-700 hover:bg-blue-50 border-none w-full md:w-auto"
            >
                Lanjutkan Mengerjakan <ArrowRight size={18} className="ml-2" />
            </Button>
        </div>
    );
}