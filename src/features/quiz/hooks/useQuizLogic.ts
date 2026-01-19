// [DOCS] Logic Controller utama untuk halaman pengerjaan kuis.
// Memisahkan logika bisnis (timer, navigasi, submit) dari tampilan UI.
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

    // [DOCS] Mengambil waktu sekarang di client untuk validasi expired
    useEffect(() => {
        const timer = setTimeout(() => setCurrentTime(Date.now()), 0);
        return () => clearTimeout(timer);
    }, []);

    // [DOCS] Deteksi jika ID sesi dari server berbeda dengan di storage lokal
    const isSessionMismatch = session?.session_id && storedSessionId !== session.session_id;
    // [DOCS] Deteksi jika waktu sudah habis saat halaman dimuat
    const isExpiredOnLoad = session && currentTime !== null
        ? new Date(session.expires_at).getTime() < currentTime
        : false;
    const isServerError = error instanceof AxiosError && error.response && error.response.status >= 500;

    // [DOCS] Sinkronisasi ID sesi jika terjadi mismatch
    useEffect(() => {
        if (isSessionMismatch && session) {
            resetAnswers();
            setSessionId(session.session_id);
        }
    }, [isSessionMismatch, session, resetAnswers, setSessionId]);

    // [DOCS] Redirect ke dashboard jika tidak ada sesi aktif
    useEffect(() => {
        if (!isLoading && !session && !isError) {
            if (!isSubmittingRef.current) {
                toast.info('Tidak ada sesi kuis yang aktif.');
                resetAnswers();
                router.replace('/dashboard');
            }
        }
    }, [isLoading, session, isError, resetAnswers, router]);

    // [DOCS] Fungsi eksekusi submit jawaban
    const executeSubmit = useCallback((forceSubmit = false) => {
        if (isSubmittingRef.current) return;

        const totalQuestions = session?.questions?.length || 0;
        const answeredCount = Object.keys(answers).length;

        // [DOCS] Cegah submit jika jawaban belum lengkap, kecuali dipaksa (timer habis)
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

    // [DOCS] Handler otomatis saat timer habis
    const handleTimeout = useCallback(() => {
        toast.warning('Waktu habis! Mengirim jawaban...');
        setIsModalOpen(false);
        executeSubmit(true);
    }, [executeSubmit]);

    // [DOCS] Trigger submit otomatis jika terdeteksi expired saat load
    useEffect(() => {
        if (isExpiredOnLoad && !isSubmittingRef.current && session) {
            toast.error("Waktu sesi sudah habis. Menutup sesi...");
            executeSubmit(true);
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
        handleManualSubmit: () => executeSubmit(false),
        handleTimeout,
        answers,
        flags
    };
};