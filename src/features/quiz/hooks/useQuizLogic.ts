import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveSession, useSubmitQuiz } from './useQuiz';
import { useQuizStore } from '../store/quizStore';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useQuizLogic = () => {
    const router = useRouter();
    const { data: session, isLoading, isError, error } = useActiveSession();
    const { mutate: submit, isPending: isSubmitting } = useSubmitQuiz();

    const {
        answers,
        flags,
        sessionId: storedSessionId,
        setSessionId,
        resetAnswers,
        toggleFlag,
        setAnswer
    } = useQuizStore();

    const [index, setIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<number | null>(null);
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => setCurrentTime(Date.now()), 0);
        return () => clearTimeout(timer);
    }, []);

    const isSessionMismatch = session?.session_id && storedSessionId !== session.session_id;
    const isExpiredOnLoad = session && currentTime !== null
        ? new Date(session.expires_at).getTime() < currentTime
        : false;
    const isServerError = error instanceof AxiosError && error.response && error.response.status >= 500;

    useEffect(() => {
        if (isSessionMismatch && session) {
            resetAnswers();
            setSessionId(session.session_id);
        }
    }, [isSessionMismatch, session, resetAnswers, setSessionId]);

    useEffect(() => {
        if (!isLoading && !session && !isError) {
            if (!isSubmittingRef.current) {
                toast.info('Tidak ada sesi kuis yang aktif.');
                resetAnswers();
                router.replace('/dashboard');
            }
        }
    }, [isLoading, session, isError, resetAnswers, router]);

    const executeSubmit = useCallback((forceSubmit = false) => {
        if (isSubmittingRef.current) return;

        const totalQuestions = session?.questions?.length || 0;
        const answeredCount = Object.keys(answers).length;

        if (!forceSubmit && answeredCount < totalQuestions) {
            toast.error(`Lengkapi ${totalQuestions - answeredCount} soal lagi sebelum mengumpulkan.`);
            return;
        }

        isSubmittingRef.current = true;
        const payload = Object.keys(answers).length === 0 ? { "0": "" } : answers;

        submit(payload, {
            onSuccess: () => {
                setIsModalOpen(false);
            },
            onError: (err) => {
                isSubmittingRef.current = false;
                setIsModalOpen(false);

                if (err.response?.status === 400 || err.response?.status === 404 || err.response?.status === 409) {
                    toast.warning("Sesi telah berakhir atau data tidak valid.");
                    resetAnswers();
                    router.replace('/history');
                }
            }
        });
    }, [answers, session, submit, router, resetAnswers]);

    const handleTimeout = useCallback(() => {
        toast.warning('Waktu habis! Mengirim jawaban...');
        setIsModalOpen(false);
        executeSubmit(true);
    }, [executeSubmit]);

    useEffect(() => {
        if (isExpiredOnLoad && !isSubmittingRef.current && session) {
            toast.error("Waktu sesi sudah habis. Menutup sesi...");
            executeSubmit(true);
        }
    }, [isExpiredOnLoad, executeSubmit, session]);

    return {
        // Data
        session,
        isLoading,
        isError,
        isServerError,
        isSessionMismatch,
        isExpiredOnLoad,
        currentTime,
        isSubmitting,

        // State UI
        index,
        setIndex,
        isModalOpen,
        setIsModalOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,

        // Actions
        toggleFlag,
        setAnswer,
        handleManualSubmit: () => executeSubmit(false),
        handleTimeout,
        answers,
        flags
    };
};