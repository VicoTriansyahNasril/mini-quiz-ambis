'use client';

import { AlertCircle, ArrowRight, Trash2, Zap } from 'lucide-react';
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
            <div className="relative bg-linear-to-r from-amber-500 to-orange-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-amber-500/30 overflow-hidden animate-in slide-in-from-top-4 duration-500">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-75" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg">
                            <AlertCircle size={32} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-black mb-2 flex items-center gap-2">
                                Sesi Kadaluarsa
                                <span className="inline-block px-2 py-1 bg-white/20 rounded-lg text-xs font-black">EXPIRED</span>
                            </h3>
                            <p className="text-amber-50 text-sm md:text-base leading-relaxed">
                                Waktu untuk <span className="font-bold text-white">{session.subtest_name}</span> telah habis. Bersihkan sesi ini untuk memulai kuis baru.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={onClean}
                        isLoading={isCleaning}
                        className="bg-white text-amber-700 hover:bg-amber-50 border-none w-full md:w-auto font-black px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <Trash2 size={20} className="mr-2" /> Bersihkan Sesi
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-blue-600/30 overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse delay-75" />
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse delay-150" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                    <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg animate-pulse">
                        <Zap size={32} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-black">Sesi Aktif Terdeteksi</h3>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-400/90 text-green-900 rounded-full text-xs font-black shadow-lg">
                                <span className="w-2 h-2 bg-green-900 rounded-full animate-pulse" />
                                LIVE
                            </span>
                        </div>
                        <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-3">
                            Anda memiliki sesi <span className="font-bold text-white px-2 py-0.5 bg-white/20 rounded">{session.subtest_name}</span> yang sedang berlangsung.
                        </p>
                        <p className="text-blue-200 text-xs font-medium">Lanjutkan sekarang untuk menyelesaikan kuis Anda!</p>
                    </div>
                </div>
                <Button
                    onClick={onContinue}
                    className="bg-white text-blue-700 hover:bg-blue-50 border-none w-full md:w-auto font-black px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                >
                    <span className="flex items-center gap-2">
                        Lanjutkan Mengerjakan
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Button>
            </div>
        </div>
    );
}