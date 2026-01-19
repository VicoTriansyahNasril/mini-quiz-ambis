'use client';

import { useDashboardLogic } from '@/features/quiz/hooks/useDashboardLogic';
import ActiveSessionBanner from '@/features/quiz/components/dashboard/ActiveSessionBanner';
import SubtestGrid from '@/features/quiz/components/dashboard/SubtestGrid';
import { Trophy, Loader2, Sparkles, Target } from 'lucide-react';

export default function DashboardPage() {
    const {
        isLoading,
        activeSession,
        subtests,
        isSessionExpired,
        isCleaning,
        isStarting,
        startingSubtestId,
        handleCleanSession,
        handleStartQuiz,
        router
    } = useDashboardLogic();

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-slate-600 font-medium animate-pulse">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 p-4 md:p-6">
            <header className="max-w-6xl mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-indigo-600/5 rounded-3xl blur-3xl" />
                <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-900/5 border border-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                                <Trophy size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                    Mini Quiz <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Ambis</span>
                                </h1>
                                <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2 justify-center md:justify-start">
                                    <Sparkles size={14} className="text-amber-500" />
                                    Platform kuis untuk mencapai prestasi terbaik
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-8">
                <ActiveSessionBanner
                    session={activeSession}
                    isExpired={isSessionExpired}
                    isCleaning={isCleaning}
                    onContinue={() => router.push('/quiz/session')}
                    onClean={handleCleanSession}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl">
                                <Target size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kuis</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{subtests?.length || 0}</p>
                    </div>

                    <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-blue-600/30 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Trophy size={20} />
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-wider opacity-90">Status</h3>
                        </div>
                        <p className="text-2xl font-black">{activeSession ? 'Aktif' : 'Siap Mulai'}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl">
                                <Sparkles size={20} className="text-purple-600" />
                            </div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Level</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900">Ambitious</p>
                    </div>
                </div>

                {/* Subtest Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-900">Pilih Kategori Kuis</h2>
                    </div>

                    <SubtestGrid
                        subtests={subtests}
                        isStarting={isStarting}
                        startingSubtestId={startingSubtestId}
                        hasActiveSession={!!activeSession}
                        onStart={handleStartQuiz}
                    />
                </div>
            </main>
        </div>
    );
}