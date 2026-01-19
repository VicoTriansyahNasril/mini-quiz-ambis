import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { Subtest, QuizSession, QuizResult } from '../types';
import { useQuizStore } from '../store/quizStore';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { parseApiError } from '@/lib/error-handler';

// [DOCS] Hook: Mengambil daftar kategori kuis (subtests) dari server.
export const useSubtests = () => useQuery({
    queryKey: ['subtests'],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<Subtest[]>>('/subtests');
        return data.data;
    },
});

// [DOCS] Hook: Memulai sesi kuis baru.
// Menangani error 409 (Conflict) jika user mencoba start saat masih ada sesi aktif.
export const useStartQuiz = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<QuizSession, AxiosError<ApiErrorResponse>, string>({
        mutationFn: async (subtestId) => {
            const { data } = await apiClient.get<ApiResponse<QuizSession>>(`/quiz/start/${subtestId}`);
            return data.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['activeSession'], data);
            router.push('/quiz/session');
        },
        onError: (error) => {
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

// [DOCS] Hook: Mengecek status sesi aktif saat ini.
// Digunakan untuk fitur Resume Capability.
export const useActiveSession = () => useQuery({
    queryKey: ['activeSession'],
    queryFn: async () => {
        try {
            const { data } = await apiClient.get<ApiResponse<QuizSession>>('/quiz/active');
            return data.data;
        } catch {
            return null;
        }
    },
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
});

// [DOCS] Hook: Mengirim jawaban kuis ke server.
// Menerima payload berupa map jawaban { "1": "A", "2": "" }.
// Menangani skenario error jika sesi sudah kadaluarsa (400/404/409) saat submit.
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
            resetAnswers();
            queryClient.invalidateQueries({ queryKey: ['history'] });
            queryClient.setQueryData(['activeSession'], null);

            toast.success(`Kuis Selesai! Skor: ${res.score}`);
            router.replace('/history');
        },
        onError: (error) => {
            if (error.response?.status === 400 || error.response?.status === 404 || error.response?.status === 409) {
                // [DOCS] Jika sesi error dari server, bersihkan state lokal agar user tidak stuck.
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