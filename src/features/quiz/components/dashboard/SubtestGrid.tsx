'use client';

import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Subtest } from '../../types';

interface Props {
    subtests: Subtest[] | undefined;
    isStarting: boolean;
    hasActiveSession: boolean;
    onStart: (id: string) => void;
}

export default function SubtestGrid({ subtests, isStarting, hasActiveSession, onStart }: Props) {
    if (!subtests) return null;

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subtests.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between h-full">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                            {item.description || 'Uji pemahaman dan kemampuan Anda pada topik ini.'}
                        </p>
                    </div>

                    <Button
                        onClick={() => onStart(item.id)}
                        isLoading={isStarting}
                        disabled={hasActiveSession}
                        className="w-full bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={18} className="mr-2" />
                        {hasActiveSession ? 'Selesaikan Sesi Aktif' : 'Mulai Kuis Baru'}
                    </Button>
                </div>
            ))}
        </div>
    );
}