// [DOCS] Hook ini berisi kumpulan fungsi React Query untuk berinteraksi dengan API Quiz.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { Subtest, QuizSession, QuizResult } from '../types';
import { useQuizStore } from '../store/quizStore';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { parseApiError } from '@/lib/error-handler';

// [DOCS] Fetch daftar subtest yang tersedia untuk ditampilkan di dashboard.
export const useSubtests = () => useQuery({
    queryKey: ['subtests'],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<Subtest[]>>('/subtests');
        return data.data;
    },
});

// [DOCS] Melakukan request untuk memulai sesi kuis baru.
export const useStartQuiz = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<QuizSession, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (subtestId) => {
            const { data } = await apiClient.get<ApiResponse<QuizSession>>(`/quiz/start/${subtestId}`);
            return data.data;
        },
        onSuccess: (data) => {
            // [DOCS] Simpan data sesi ke cache 'activeSession' agar bisa langsung dibaca hook lain.
            queryClient.setQueryData(['activeSession'], data);
            router.push('/quiz/session');
        },
        onError: (error) => {
            // [DOCS] Handle 409: Jika user sudah punya sesi aktif, tetap arahkan ke halaman sesi (Resume).
            if (error.response?.status === 409) {
                toast.info('Sesi aktif ditemukan. Melanjutkan...');
                router.push('/quiz/session');
            } else {
                const msg = parseApiError(error);
                toast.error(msg);
            }
        },
    });
};

// [DOCS] Mengecek apakah user memiliki sesi yang sedang berjalan (untuk fitur Resume).
export const useActiveSession = () => useQuery({
    queryKey: ['activeSession'],
    queryFn: async () => {
        try {
            const { data } = await apiClient.get<ApiResponse<QuizSession>>('/quiz/active');
            return data.data;
        } catch {
            return null; // [DOCS] Tidak ada sesi aktif
        }
    },
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
});

// [DOCS] Mengirim jawaban ke server untuk dinilai.
export const useSubmitQuiz = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { resetAnswers, markSessionAsFailed, sessionId } = useQuizStore();

    return useMutation<QuizResult, AxiosError<ApiErrorResponse>, Record<string, string>>({
        mutationFn: async (answers) => {
            const { data } = await apiClient.post<ApiResponse<QuizResult>>('/quiz/submit', { answers });
            return data.data;
        },
        onSuccess: (res) => {
            // [DOCS] Bersihkan draft lokal dan refresh data riwayat.
            resetAnswers();
            queryClient.invalidateQueries({ queryKey: ['history'] });
            queryClient.setQueryData(['activeSession'], null);

            toast.success(`Kuis Selesai! Skor: ${res.score}`);
            router.replace('/history');
        },
        onError: (error) => {
            // [DOCS] Handle error 400/404/409: Sesi expired atau tidak valid di server.
            // Memaksa client untuk reset state agar tidak terjebak di halaman kuis.
            if (error.response?.status === 400 || error.response?.status === 404 || error.response?.status === 409) {
                if (sessionId) {
                    markSessionAsFailed(sessionId);
                } else {
                    resetAnswers();
                }

                toast.warning('Sesi ditutup (Data tidak valid atau kadaluarsa).');
                queryClient.setQueryData(['activeSession'], null);
                router.replace('/history');
            } else {
                const msg = parseApiError(error);
                toast.error(msg);
            }
        },
    });
};