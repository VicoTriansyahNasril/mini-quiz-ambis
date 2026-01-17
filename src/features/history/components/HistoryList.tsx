'use client';

import { useHistory } from '../hooks/useHistory';
import { Loader2, Calendar, Trophy, AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function HistoryList() {
    const { data: history, isLoading, isError } = useHistory();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-sm">Memuat riwayat...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={32} className="mb-2" />
                <p className="font-medium">Gagal memuat data riwayat.</p>
            </div>
        );
    }

    if (!Array.isArray(history) || history.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                    <Trophy size={24} />
                </div>
                <h3 className="text-slate-900 font-medium">Belum ada riwayat</h3>
                <p className="text-slate-500 text-sm">Yuk mulai kerjakan kuis pertamamu!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <div
                    key={item.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                                {item.subtest_name}
                            </h3>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>
                                        {item.completed_at
                                            ? format(new Date(item.completed_at), 'dd MMM yyyy, HH:mm', { locale: id })
                                            : '-'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>{Math.floor(item.total_time_seconds / 60)} menit</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                    <CheckCircle2 size={12} />
                                    {item.correct_answers} / {item.total_questions} Benar
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                    {item.percentage}% Akurasi
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 md:border-l md:border-slate-100 md:pl-6">
                            <div className="text-right">
                                <span className="text-[10px] tracking-wider text-slate-400 uppercase font-bold block mb-1">
                                    Skor Akhir
                                </span>
                                <div className="text-3xl font-black text-slate-900">
                                    {item.score}
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push(`/history/${item.session_id}`)}
                                variant="outline"
                                className="h-10 w-10 p-0 rounded-full border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}