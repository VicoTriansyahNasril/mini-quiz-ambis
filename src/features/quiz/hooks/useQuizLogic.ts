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

    const executeSubmit = useCallback(() => {
        if (isSubmittingRef.current) return;
        if (!session || !session.questions) return;

        const payload: Record<string, string> = {};

        session.questions.forEach((q) => {
            const qNum = q.question_number.toString();
            payload[qNum] = answers[qNum] || "";
        });

        isSubmittingRef.current = true;

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
        executeSubmit();
    }, [executeSubmit]);

    useEffect(() => {
        if (isExpiredOnLoad && !isSubmittingRef.current && session) {
            toast.error("Waktu sesi sudah habis. Menutup sesi...");
            executeSubmit();
        }
    }, [isExpiredOnLoad, executeSubmit, session]);

    return {
        session,
        isLoading,
        isError,
        isServerError,
        isSessionMismatch,
        isExpiredOnLoad,
        currentTime,
        isSubmitting,
        index,
        setIndex,
        isModalOpen,
        setIsModalOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        toggleFlag,
        setAnswer,
        handleManualSubmit: () => executeSubmit(),
        handleTimeout,
        answers,
        flags
    };
};