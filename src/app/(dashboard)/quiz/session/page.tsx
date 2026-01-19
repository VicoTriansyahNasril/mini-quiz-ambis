'use client';

import { AlertTriangle, Flag, WifiOff, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import QuestionCard from '@/features/quiz/components/QuestionCard';
import QuestionNavigator from '@/features/quiz/components/QuestionNavigator';
import SubmitModal from '@/features/quiz/components/SubmitModal';
import QuizHeader from '@/features/quiz/components/QuizHeader';
import QuizFooter from '@/features/quiz/components/QuizFooter';
import MobileNavigator from '@/features/quiz/components/MobileNavigator';
import { useQuizLogic } from '@/features/quiz/hooks/useQuizLogic';

export default function QuizSessionPage() {
    const {
        session, isLoading, isError, isServerError, isSessionMismatch, isExpiredOnLoad, currentTime, isSubmitting,
        index, setIndex, isModalOpen, setIsModalOpen, isMobileNavOpen, setIsMobileNavOpen,
        toggleFlag, handleManualSubmit, handleTimeout, answers, flags
    } = useQuizLogic();

    if (isError) {
        if (isServerError) {
            return (
                <div className="h-dvh flex flex-col items-center justify-center bg-linear-to-br from-red-50 to-rose-50 p-6 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-red-900/10 border border-red-100 max-w-md">
                        <div className="bg-linear-to-br from-red-500 to-rose-600 p-4 rounded-2xl mb-6 inline-block">
                            <WifiOff className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Gangguan Server</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Terjadi kesalahan pada server (500). Mohon coba beberapa saat lagi.
                        </p>
                        <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                            Muat Ulang
                        </Button>
                    </div>
                </div>
            );
        }
        return null;
    }

    if (isLoading || isSessionMismatch || !session || isExpiredOnLoad || currentTime === null) {
        return (
            <div className="h-dvh flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-700" />

                <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-md w-full animate-in zoom-in duration-500">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40">
                            <Trophy size={48} className="text-white fill-white/20" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles size={16} className="text-yellow-900" />
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                        {isExpiredOnLoad ? 'Menyimpan Jawaban...' : 'Siap Ambis?'}
                    </h2>

                    <p className="text-slate-400 font-medium text-lg mb-8">
                        {isExpiredOnLoad
                            ? 'Sesi Anda telah berakhir.'
                            : 'Menyiapkan soal-soal terbaik untukmu...'}
                    </p>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden max-w-xs mx-auto">
                        <div className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 w-1/2 animate-[shimmer_1.5s_infinite_linear] rounded-full" style={{ width: '100%', transformOrigin: '0% 50%' }} />
                    </div>

                    <p className="text-xs text-slate-500 mt-4 font-mono">
                        Memuat data enkripsi...
                    </p>
                </div>

                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        );
    }

    const currentQuestion = session.questions[index];
    const isFlagged = !!flags[currentQuestion.question_number.toString()];
    const isAnswered = !!answers[currentQuestion.question_number.toString()];

    return (
        <div className="h-dvh bg-linear-to-br from-slate-50 via-blue-50/10 to-indigo-50/10 flex flex-col overflow-hidden">
            <div className="flex-none z-30">
                <QuizHeader
                    subtestName={session.subtest_name}
                    currentIndex={index}
                    totalQuestions={session.questions.length}
                    expiresAt={session.expires_at}
                    onTimeout={handleTimeout}
                    onOpenMobileNav={() => setIsMobileNavOpen(true)}
                />
                <div className="w-full bg-slate-200 h-1.5 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-500 ease-out shadow-lg shadow-blue-600/50"
                        style={{ width: `${((index + 1) / session.questions.length) * 100}%` }}
                    />
                    <div
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-transparent via-white/40 to-transparent w-20 animate-shimmer"
                        style={{
                            left: `${((index + 1) / session.questions.length) * 100 - 10}%`,
                            animation: 'shimmer 2s infinite'
                        }}
                    />
                </div>
            </div>

            <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 lg:col-span-9 space-y-4 pb-20 md:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-600/30">
                            <Sparkles size={16} />
                            <span className="font-bold text-sm">Soal {index + 1} dari {session.questions.length}</span>
                        </div>
                    </div>

                    <QuestionCard question={currentQuestion} />

                    {/* Action Bar */}
                    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-lg flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={() => toggleFlag(currentQuestion.question_number.toString())}
                            className={cn(
                                "text-sm h-10 border-2 transition-all duration-300 font-semibold",
                                isFlagged
                                    ? "text-amber-700 bg-linear-to-r from-amber-50 to-yellow-50 border-amber-300 hover:bg-amber-100 shadow-md shadow-amber-200/50"
                                    : "text-slate-500 border-slate-200 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            )}
                        >
                            <Flag size={16} className={cn("mr-2", isFlagged && "fill-amber-500 text-amber-500")} />
                            {isFlagged ? 'Ditandai Ragu' : 'Tandai Ragu'}
                        </Button>

                        {!isAnswered ? (
                            <div className="flex items-center gap-2 text-amber-600 text-sm font-bold px-4 py-2 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 animate-in fade-in shadow-md">
                                <AlertTriangle size={16} />
                                <span>Belum diisi</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-bold px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-in fade-in shadow-md">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span>Terjawab</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-4">
                    <QuestionNavigator
                        totalQuestions={session.questions.length}
                        currentIndex={index}
                        onNavigate={setIndex}
                    />
                </div>
            </main>

            <div className="flex-none z-20">
                <QuizFooter
                    variant="static"
                    onPrev={() => setIndex(p => Math.max(0, p - 1))}
                    onNext={() => setIndex(p => Math.min(session.questions.length - 1, p + 1))}
                    onSubmit={() => setIsModalOpen(true)}
                    isFirst={index === 0}
                    isLast={index === session.questions.length - 1}
                    isLoading={isSubmitting}
                />
            </div>

            <div className="md:hidden">
                <QuizFooter
                    variant="fixed"
                    onPrev={() => setIndex(p => Math.max(0, p - 1))}
                    onNext={() => setIndex(p => Math.min(session.questions.length - 1, p + 1))}
                    onSubmit={() => setIsModalOpen(true)}
                    isFirst={index === 0}
                    isLast={index === session.questions.length - 1}
                    isLoading={isSubmitting}
                />
            </div>

            <MobileNavigator
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                totalQuestions={session.questions.length}
                currentIndex={index}
                onNavigate={setIndex}
            />

            <SubmitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleManualSubmit}
                totalQuestions={session.questions.length}
                isSubmitting={isSubmitting}
            />

            <style jsx global>{`
                @keyframes shimmer {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}