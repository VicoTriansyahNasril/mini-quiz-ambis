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

    // [DOCS] Mengambil waktu sekarang di client untuk validasi expired real-time.
    useEffect(() => {
        const timer = setTimeout(() => setCurrentTime(Date.now()), 0);
        return () => clearTimeout(timer);
    }, []);

    const isSessionMismatch = session?.session_id && storedSessionId !== session.session_id;
    const isExpiredOnLoad = session && currentTime !== null
        ? new Date(session.expires_at).getTime() < currentTime
        : false;
    const isServerError = error instanceof AxiosError && error.response && error.response.status >= 500;

    // [DOCS] Sinkronisasi ID sesi server dengan local storage.
    // Jika user berpindah sesi (misal dari Matematika ke Logika), reset jawaban lokal.
    useEffect(() => {
        if (isSessionMismatch && session) {
            resetAnswers();
            setSessionId(session.session_id);
        }
    }, [isSessionMismatch, session, resetAnswers, setSessionId]);

    // [DOCS] Redirect ke dashboard jika tidak ada sesi aktif yang ditemukan.
    // Mencegah akses langsung ke halaman kuis tanpa melalui proses Start.
    useEffect(() => {
        if (!isLoading && !session && !isError) {
            if (!isSubmittingRef.current) {
                toast.info('Tidak ada sesi kuis yang aktif.');
                resetAnswers();
                router.replace('/dashboard');
            }
        }
    }, [isLoading, session, isError, resetAnswers, router]);

    // [DOCS] Logika utama pengiriman jawaban ke server.
    // Fungsi ini menyusun payload jawaban user. Jika ada soal yang belum dijawab,
    // akan otomatis diisi string kosong ("") agar sesuai format API backend.
    const executeSubmit = useCallback(() => {
        if (isSubmittingRef.current) return;
        if (!session || !session.questions) return;

        // [DOCS] Membangun payload lengkap: { "1": "A", "2": "", "3": "B" }
        const payload: Record<string, string> = {};

        session.questions.forEach((q) => {
            const qNum = q.question_number.toString();
            // Gunakan jawaban user jika ada, atau string kosong jika belum diisi.
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

                // [DOCS] Handle jika sesi ternyata sudah kadaluarsa/tidak valid di sisi server.
                if (err.response?.status === 400 || err.response?.status === 404 || err.response?.status === 409) {
                    toast.warning("Sesi telah berakhir atau data tidak valid.");
                    resetAnswers();
                    router.replace('/history');
                }
            }
        });
    }, [answers, session, submit, router, resetAnswers]);

    // [DOCS] Handler otomatis saat timer habis.
    // Langsung memanggil executeSubmit tanpa interaksi user.
    const handleTimeout = useCallback(() => {
        toast.warning('Waktu habis! Mengirim jawaban...');
        setIsModalOpen(false);
        executeSubmit();
    }, [executeSubmit]);

    // [DOCS] Trigger submit otomatis jika saat halaman dimuat sesi sudah expired.
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