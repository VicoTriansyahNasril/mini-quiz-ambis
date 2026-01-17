import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { HistoryResponse, HistoryDetailResponse } from '../types';

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

export const useQuizResult = (sessionId: string) => useQuery({
    queryKey: ['quiz-result', sessionId],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<HistoryDetailResponse>>(`/quiz/result/${sessionId}`);
        return data.data?.result || null;
    },
    enabled: !!sessionId,
});