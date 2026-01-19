// [DOCS] Hook ini mengatur logika bisnis untuk halaman Dashboard.
// Menangani: Fetch daftar kuis, Cek sesi aktif, dan Logika pembersihan sesi (Clean Session).
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubtests, useStartQuiz, useActiveSession, useSubmitQuiz } from './useQuiz';
import { useQuizStore } from '../store/quizStore';
import { toast } from 'sonner';

export const useDashboardLogic = () => {
    const router = useRouter();
    const { data: subtests, isLoading: loadingSubtests } = useSubtests();
    const { data: activeSession, isLoading: loadingSession } = useActiveSession();
    const { mutate: startQuiz, isPending: isStarting } = useStartQuiz();
    const { mutate: submitQuiz, isPending: isCleaning } = useSubmitQuiz();
    const { resetAnswers } = useQuizStore();

    const [currentTime, setCurrentTime] = useState<number | null>(null);
    const [startingSubtestId, setStartingSubtestId] = useState<string | null>(null);

    // [DOCS] Mengambil waktu client saat ini untuk membandingkan dengan expires_at
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentTime(Date.now());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // [DOCS] Boolean untuk mengecek apakah sesi yang aktif sudah kadaluarsa waktunya
    const isSessionExpired = activeSession && currentTime !== null
        ? new Date(activeSession.expires_at).getTime() < currentTime
        : false;

    // [DOCS] Fungsi untuk membersihkan sesi yang "stuck" atau kadaluarsa.
    // Caranya dengan mengirim submit paksa berisi jawaban kosong agar backend menutup sesi tersebut.
    const handleCleanSession = () => {
        if (!activeSession?.questions) return;

        const toastId = toast.loading("Membersihkan sesi...");
        const dummyAnswers: Record<string, string> = {};

        // [DOCS] Isi dummy answer (opsi pertama) untuk sekadar memenuhi request submit
        activeSession.questions.forEach((q) => {
            const firstOption = q.options && q.options.length > 0 ? q.options[0] : "A";
            dummyAnswers[q.question_number] = firstOption;
        });

        submitQuiz(dummyAnswers, {
            onSuccess: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload(); // Refresh untuk mengambil state terbaru
            },
            onError: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload();
            }
        });
    };

    // [DOCS] Handler mulai kuis baru
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