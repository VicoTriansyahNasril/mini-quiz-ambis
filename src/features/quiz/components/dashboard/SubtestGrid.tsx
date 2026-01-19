'use client';

import { Play, Lock, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Subtest } from '../../types';

interface Props {
    subtests: Subtest[] | undefined;
    isStarting: boolean;
    startingSubtestId: string | null;
    hasActiveSession: boolean;
    onStart: (id: string) => void;
}

export default function SubtestGrid({ subtests, isStarting, startingSubtestId, hasActiveSession, onStart }: Props) {
    if (!subtests) return null;

    const gradients = [
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-emerald-600',
        'from-orange-500 to-red-600',
        'from-cyan-500 to-blue-600',
        'from-violet-500 to-purple-600',
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subtests.map((item, index) => {
                const isThisLoading = isStarting && startingSubtestId === item.id;

                return (
                    <div
                        key={item.id}
                        className="group relative bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    >
                        <div className={`h-32 bg-linear-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                            <div className="relative h-full flex items-center justify-center">
                                <div className="text-white text-center p-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-2">
                                        <Sparkles size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Quiz {index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                    {item.description || 'Uji pemahaman dan kemampuan Anda pada topik ini dengan kuis interaktif yang menantang.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span>Tersedia</span>
                                </div>
                                <span>•</span>
                                <span>{item.question_count || 10} Soal</span>
                            </div>

                            <Button
                                onClick={() => onStart(item.id)}
                                disabled={hasActiveSession || isStarting}
                                className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 ${hasActiveSession
                                    ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                                    : 'bg-linear-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 active:scale-95'
                                    }`}
                            >
                                {isThisLoading ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Menyiapkan...
                                    </>
                                ) : hasActiveSession ? (
                                    <>
                                        <Lock size={18} className="mr-2" />
                                        Selesaikan Sesi Aktif
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} className="mr-2" />
                                        Mulai Kuis Sekarang
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}