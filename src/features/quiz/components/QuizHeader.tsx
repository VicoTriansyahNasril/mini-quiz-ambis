'use client';

import QuizTimer from './QuizTimer';

interface Props {
    subtestName: string;
    currentIndex: number;
    totalQuestions: number;
    expiresAt: string;
    onTimeout: () => void;
    onOpenMobileNav: () => void;
}

// [DOCS] Header kuis sticky berisi Nama Kuis, Nomor Soal, dan Timer.
export default function QuizHeader({
    subtestName,
    currentIndex,
    totalQuestions,
    expiresAt,
    onTimeout,
    onOpenMobileNav
}: Props) {
    return (
        <header className="bg-white border-b px-4 py-3 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex flex-col overflow-hidden mr-4">
                    <h1 className="font-bold text-slate-900 text-sm md:text-lg truncate">
                        {subtestName}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>Soal {currentIndex + 1} / {totalQuestions}</span>
                        <span className="hidden md:inline">• Sesi Ujian</span>
                        {/* [DOCS] Tombol trigger Mobile Navigation Drawer */}
                        <button
                            onClick={onOpenMobileNav}
                            className="md:hidden text-blue-600 font-bold ml-2 underline"
                        >
                            Lihat Peta Soal
                        </button>
                    </div>
                </div>
                <QuizTimer expiresAt={expiresAt} onExpire={onTimeout} />
            </div>
        </header>
    );
}