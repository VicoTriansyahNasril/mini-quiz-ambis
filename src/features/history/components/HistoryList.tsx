'use client';

// [DOCS] Komponen untuk menampilkan daftar kartu riwayat pengerjaan.
// Menangani loading state, error state, dan empty state.
import { useHistory } from '../hooks/useHistory';
import { Loader2, Calendar, Trophy, AlertCircle, CheckCircle2, Clock, ChevronRight, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function HistoryList() {
    const { data: history, isLoading, isError } = useHistory();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-lg">
                <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
                <p className="text-sm font-medium">Memuat riwayat pengerjaan...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-red-500 bg-linear-to-br from-red-50 to-rose-50 rounded-3xl border border-red-100 shadow-lg">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-bold text-lg">Gagal memuat data riwayat.</p>
                <p className="text-sm text-red-400 mt-2">Silakan coba lagi nanti</p>
            </div>
        );
    }

    // [DOCS] Tampilan jika user belum pernah mengerjakan kuis sama sekali.
    if (!Array.isArray(history) || history.length === 0) {
        return (
            <div className="text-center py-16 bg-linear-to-br from-slate-50 to-blue-50/30 rounded-3xl border-2 border-dashed border-slate-300 shadow-inner">
                <div className="mx-auto w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/30">
                    <Trophy size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-slate-900 font-black text-2xl mb-2">Belum Ada Riwayat</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Mulai kerjakan kuis pertamamu dan raih prestasi terbaik!</p>
                <Button onClick={() => router.push('/dashboard')} className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    Mulai Kuis Sekarang
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {history.map((item) => {
                // [DOCS] Logic visualisasi warna berdasarkan performa nilai (Hijau=Bagus, Merah=Kurang)
                const scoreColor = item.percentage >= 80
                    ? 'from-green-600 to-emerald-600'
                    : item.percentage >= 60
                        ? 'from-blue-600 to-indigo-600'
                        : 'from-orange-600 to-red-600';

                return (
                    <div
                        key={item.id}
                        className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:border-blue-200 transition-all duration-500 group hover:-translate-y-1 overflow-hidden"
                    >
                        {/* [DOCS] Efek hover background blur */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* [DOCS] Badge "Excellent" jika nilai >= 80 */}
                        {item.percentage >= 80 && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-amber-400 to-yellow-500 text-white rounded-full shadow-lg text-xs font-black">
                                <Award size={14} />
                                <span>EXCELLENT</span>
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full" />
                                        <h3 className="font-black text-slate-900 text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                                            {item.subtest_name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Calendar size={16} className="text-blue-600" />
                                        <span className="font-medium">
                                            {item.completed_at
                                                ? format(new Date(item.completed_at), 'dd MMM yyyy, HH:mm', { locale: id })
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Clock size={16} className="text-green-600" />
                                        <span className="font-medium">{Math.floor(item.total_time_seconds / 60)} menit</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                        <span className="text-green-700 text-sm font-bold">
                                            {item.correct_answers} / {item.total_questions} Benar
                                        </span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                                        <TrendingUp size={16} className="text-blue-600" />
                                        <span className="text-blue-700 text-sm font-bold">{item.percentage}% Akurasi</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 md:border-l md:border-slate-100 md:pl-8">
                                <div className="text-center">
                                    <span className="text-xs tracking-widest text-slate-400 uppercase font-black block mb-2">
                                        Skor Akhir
                                    </span>
                                    <div className={`text-5xl font-black text-transparent bg-clip-text bg-linear-to-br ${scoreColor} drop-shadow-sm`}>
                                        {item.score}
                                    </div>
                                    {/* [DOCS] Progress bar visual skor */}
                                    <div className="mt-3 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-linear-to-r ${scoreColor} transition-all duration-1000 rounded-full`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/history/${item.session_id}`)}
                                    variant="outline"
                                    className="h-12 w-12 p-0 rounded-2xl border-2 border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300 group-hover:scale-110"
                                >
                                    <ChevronRight size={24} />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}