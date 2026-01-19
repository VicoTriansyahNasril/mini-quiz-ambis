import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubtests, useStartQuiz, useActiveSession, useSubmitQuiz } from './useQuiz';
import { useQuizStore } from '../store/quizStore';
import { toast } from 'sonner';

// [DOCS] Hook ini mengatur logika bisnis untuk halaman Dashboard.
// Menangani: Fetch daftar kuis, Cek sesi aktif, dan Logika pembersihan sesi (Clean Session).
export const useDashboardLogic = () => {
    const router = useRouter();
    const { data: subtests, isLoading: loadingSubtests } = useSubtests();
    const { data: activeSession, isLoading: loadingSession } = useActiveSession();
    const { mutate: startQuiz, isPending: isStarting } = useStartQuiz();
    const { mutate: submitQuiz, isPending: isCleaning } = useSubmitQuiz();
    const { resetAnswers } = useQuizStore();

    const [currentTime, setCurrentTime] = useState<number | null>(null);
    const [startingSubtestId, setStartingSubtestId] = useState<string | null>(null);

    // [DOCS] Mengambil waktu client saat ini untuk membandingkan dengan expires_at.
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentTime(Date.now());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const isSessionExpired = activeSession && currentTime !== null
        ? new Date(activeSession.expires_at).getTime() < currentTime
        : false;

    // [DOCS] Fungsi untuk membersihkan sesi yang "stuck" atau kadaluarsa.
    // Mengirimkan payload jawaban kosong ("") untuk setiap soal agar backend
    // menutup sesi tersebut (status menjadi finished) tanpa memberikan nilai.
    const handleCleanSession = () => {
        if (!activeSession?.questions) return;

        const toastId = toast.loading("Membersihkan sesi...");
        const cleanAnswers: Record<string, string> = {};

        // [DOCS] Set semua jawaban menjadi string kosong.
        activeSession.questions.forEach((q) => {
            cleanAnswers[q.question_number] = "";
        });

        submitQuiz(cleanAnswers, {
            onSuccess: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload(); // Refresh agar status sesi di UI terupdate
            },
            onError: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload();
            }
        });
    };

    // [DOCS] Handler untuk memulai kuis baru dari daftar subtest.
    const handleStartQuiz = (id: string) => {
        setStartingSubtestId(id);
        startQuiz(id, {
            onSettled: () => {
                setStartingSubtestId(null);
            }
        });
    };

    return {
        subtests,
        activeSession,
        isLoading: loadingSubtests || loadingSession,
        isStarting,
        startingSubtestId,
        isCleaning,
        isSessionExpired,
        handleCleanSession,
        handleStartQuiz,
        router
    };
};