import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubtests, useStartQuiz, useActiveSession, useSubmitQuiz } from './useQuiz';
import { useQuizStore } from '../store/quizStore';
import { STORAGE_KEYS } from '@/lib/utils';
import { toast } from 'sonner';

export const useDashboardLogic = () => {
    const router = useRouter();
    const { data: subtests, isLoading: loadingSubtests } = useSubtests();
    const { data: activeSession, isLoading: loadingSession } = useActiveSession();
    const { mutate: startQuiz, isPending: isStarting } = useStartQuiz();
    const { mutate: submitQuiz, isPending: isCleaning } = useSubmitQuiz();
    const { resetAnswers } = useQuizStore();

    const [currentTime, setCurrentTime] = useState<number | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentTime(Date.now());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const isSessionExpired = activeSession && currentTime !== null
        ? new Date(activeSession.expires_at).getTime() < currentTime
        : false;

    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        resetAnswers();
        router.replace('/login');
    };

    const handleCleanSession = () => {
        if (!activeSession?.questions) return;

        const toastId = toast.loading("Membersihkan sesi...");
        const dummyAnswers: Record<string, string> = {};

        activeSession.questions.forEach((q) => {
            const firstOption = q.options && q.options.length > 0 ? q.options[0] : "A";
            dummyAnswers[q.question_number] = firstOption;
        });

        submitQuiz(dummyAnswers, {
            onSuccess: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload();
            },
            onError: () => {
                toast.dismiss(toastId);
                resetAnswers();
                window.location.reload();
            }
        });
    };

    return {
        subtests,
        activeSession,
        isLoading: loadingSubtests || loadingSession,
        isStarting,
        isCleaning,
        isSessionExpired,
        handleLogout,
        handleCleanSession,
        handleStartQuiz: startQuiz,
        router
    };
};