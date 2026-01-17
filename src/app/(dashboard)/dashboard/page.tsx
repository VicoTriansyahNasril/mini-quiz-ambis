'use client';

import { useDashboardLogic } from '@/features/quiz/hooks/useDashboardLogic';
import ActiveSessionBanner from '@/features/quiz/components/dashboard/ActiveSessionBanner';
import SubtestGrid from '@/features/quiz/components/dashboard/SubtestGrid';
import { LogOut, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
    const {
        isLoading,
        activeSession,
        subtests,
        isSessionExpired,
        isCleaning,
        isStarting,
        handleLogout,
        handleCleanSession,
        handleStartQuiz,
        router
    } = useDashboardLogic();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-900 p-2 rounded-lg text-white">
                        <Trophy size={20} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Mini Quiz Ambis</h1>
                </div>

                <Button variant="danger" onClick={handleLogout} className="px-4 text-sm h-10">
                    <LogOut size={16} className="mr-2" /> Keluar
                </Button>
            </header>

            <main className="max-w-5xl mx-auto space-y-8">
                <ActiveSessionBanner
                    session={activeSession}
                    isExpired={isSessionExpired}
                    isCleaning={isCleaning}
                    onContinue={() => router.push('/quiz/session')}
                    onClean={handleCleanSession}
                />

                <SubtestGrid
                    subtests={subtests}
                    isStarting={isStarting}
                    hasActiveSession={!!activeSession}
                    onStart={handleStartQuiz}
                />
            </main>
        </div>
    );
}