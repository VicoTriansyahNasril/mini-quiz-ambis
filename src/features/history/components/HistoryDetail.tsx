'use client';

import { useQuizResult } from '../hooks/useHistory';
import { Loader2, ArrowLeft, BarChart3, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import HistoryHeader from './HistoryHeader';
import HistoryStats from './HistoryStats';

interface Props {
    sessionId: string;
}

export default function HistoryDetail({ sessionId }: Props) {
    const router = useRouter();
    const { data: result, isLoading, isError } = useQuizResult(sessionId);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-sm font-medium animate-pulse">Sedang memuat analisis hasil...</p>
            </div>
        );
    }

    if (isError || !result) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center h-[60vh]">
                <div className="bg-red-50 p-6 rounded-full mb-6 animate-in zoom-in duration-300">
                    <BarChart3 size={48} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Data Tidak Ditemukan</h3>
                <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
                    Detail statistik untuk sesi ini tidak tersedia atau terjadi kesalahan saat mengambil data.
                </p>
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="px-8 border-slate-300 hover:bg-slate-50 text-slate-700"
                >
                    <ArrowLeft size={18} className="mr-2" /> Kembali ke Riwayat
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-12">
            <div className="flex items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-900 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Kembali
                </Button>
            </div>

            <HistoryHeader result={result} />

            <HistoryStats result={result} />

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                        <Timer size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-blue-600 font-medium mb-0.5">Kecepatan Rata-rata</p>
                        <p className="text-xl font-bold text-slate-900">
                            {result.average_time_per_question} <span className="text-sm font-normal text-slate-500">detik / soal</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Status Pengerjaan</p>
                        <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                            Selesai & Disimpan
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/dashboard')}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Ke Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}