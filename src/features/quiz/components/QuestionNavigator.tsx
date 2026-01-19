'use client';

// [DOCS] Komponen grid navigasi nomor soal.
// Menampilkan indikator visual: Nomor saat ini, Sudah dijawab (Hijau), Ragu (Kuning).
import { useQuizStore } from '../store/quizStore';
import { cn } from '@/lib/utils';
import { Flag, CheckCircle2 } from 'lucide-react';

interface Props {
    totalQuestions: number;
    currentIndex: number;
    onNavigate: (index: number) => void;
}

export default function QuestionNavigator({ totalQuestions, currentIndex, onNavigate }: Props) {
    const { answers, flags } = useQuizStore();

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Peta Soal</h3>

            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                    const questionNum = (idx + 1).toString();
                    const isAnswered = !!answers[questionNum];
                    const isFlagged = !!flags[questionNum];
                    const isCurrent = idx === currentIndex;

                    return (
                        <button
                            key={idx}
                            onClick={() => onNavigate(idx)}
                            className={cn(
                                "h-10 w-full rounded-lg text-sm font-bold flex items-center justify-center relative transition-all border-2",
                                // [DOCS] Logic pewarnaan tombol berdasarkan state
                                isCurrent ? "border-blue-600 ring-2 ring-blue-100 z-10" : "border-transparent",
                                isFlagged
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    : isAnswered
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {idx + 1}
                            {isFlagged && (
                                <div className="absolute -top-1 -right-1">
                                    <Flag size={10} className="fill-yellow-600 text-yellow-600" />
                                </div>
                            )}
                            {isAnswered && !isFlagged && (
                                <div className="absolute -top-1 -right-1">
                                    <CheckCircle2 size={10} className="fill-green-600 text-green-600 bg-white rounded-full" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" /> Sudah Dijawab
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" /> Ragu-ragu
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" /> Belum Diisi
                </div>
            </div>
        </div>
    );
}