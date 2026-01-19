// [DOCS] Hooks untuk mengambil data riwayat pengerjaan kuis.
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { HistoryResponse, HistoryDetailResponse } from '../types';

// [DOCS] Mengambil daftar semua riwayat kuis user.
// Limit diset hardcode ke 20 sesuai kebutuhan MVP.
export const useHistory = () => useQuery({
    queryKey: ['history'],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<HistoryResponse>>('/quiz/history?limit=20');
        if (data && data.data && Array.isArray(data.data.results)) {
            return data.data.results;
        }
        return [];
    },
});

// [DOCS] Mengambil detail hasil pengerjaan spesifik berdasarkan Session ID.
// Digunakan di halaman detail riwayat.
export const useQuizResult = (sessionId: string) => useQuery({
    queryKey: ['quiz-result', sessionId],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<HistoryDetailResponse>>(`/quiz/result/${sessionId}`);
        return data.data?.result || null;
    },
    enabled: !!sessionId, // [DOCS] Query hanya jalan jika sessionId tersedia
});