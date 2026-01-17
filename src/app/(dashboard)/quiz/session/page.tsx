'use client';

import { Loader2, AlertTriangle, Flag, WifiOff } from 'lucide-react';
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
                <div className="h-dvh flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                        <WifiOff className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Gangguan Server</h2>
                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                        Terjadi kesalahan pada server (500). Mohon coba beberapa saat lagi.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">Muat Ulang</Button>
                </div>
            );
        }
        return null;
    }

    if (isLoading || isSessionMismatch || !session || isExpiredOnLoad || currentTime === null) {
        return (
            <div className="h-dvh flex flex-col items-center justify-center bg-slate-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
                <p className="text-slate-500 font-medium animate-pulse">
                    {isExpiredOnLoad ? 'Menyimpan jawaban...' : 'Memuat soal...'}
                </p>
            </div>
        );
    }

    const currentQuestion = session.questions[index];
    const isFlagged = !!flags[currentQuestion.question_number.toString()];
    const isAnswered = !!answers[currentQuestion.question_number.toString()];

    return (
        <div className="h-dvh bg-slate-50 flex flex-col overflow-hidden">
            <div className="flex-none z-30">
                <QuizHeader
                    subtestName={session.subtest_name}
                    currentIndex={index}
                    totalQuestions={session.questions.length}
                    expiresAt={session.expires_at}
                    onTimeout={handleTimeout}
                    onOpenMobileNav={() => setIsMobileNavOpen(true)}
                />
                <div className="w-full bg-slate-200 h-1">
                    <div
                        className="bg-blue-600 h-1 transition-all duration-300 ease-out"
                        style={{ width: `${((index + 1) / session.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 lg:col-span-9 space-y-4 pb-20 md:pb-0">
                    <QuestionCard question={currentQuestion} />

                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <Button
                            variant="ghost"
                            onClick={() => toggleFlag(currentQuestion.question_number.toString())}
                            className={cn(
                                "text-sm h-9 border transition-colors",
                                isFlagged
                                    ? "text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                                    : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <Flag size={16} className={cn("mr-2", isFlagged && "fill-yellow-500 text-yellow-500")} />
                            {isFlagged ? 'Ditandai Ragu' : 'Tandai Ragu'}
                        </Button>

                        {!isAnswered ? (
                            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100 animate-in fade-in">
                                <AlertTriangle size={14} />
                                <span>Belum diisi</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-green-600 text-xs font-bold px-3 py-1.5 bg-green-50 rounded-lg border border-green-100 animate-in fade-in">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
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
        </div>
    );
}