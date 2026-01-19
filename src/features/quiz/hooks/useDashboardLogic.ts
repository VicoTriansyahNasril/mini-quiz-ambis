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

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentTime(Date.now());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const isSessionExpired = activeSession && currentTime !== null
        ? new Date(activeSession.expires_at).getTime() < currentTime
        : false;

    const handleCleanSession = () => {
        if (!activeSession?.questions) return;

        const toastId = toast.loading("Membersihkan sesi...");
        const cleanAnswers: Record<string, string> = {};

        activeSession.questions.forEach((q) => {
            cleanAnswers[q.question_number] = "";
        });

        submitQuiz(cleanAnswers, {
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