import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { UserProfile, ProfileInput, PasswordInput } from '../types';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { parseApiError } from '@/lib/error-handler';

export const useGetProfile = () => useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
        const { data } = await apiClient.get<ApiResponse<UserProfile>>('/auth/profile');
        return data.data;
    },
});

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation<ApiResponse<null>, AxiosError<ApiErrorResponse>, ProfileInput>({
        mutationFn: async (data) => {
            const response = await apiClient.put<ApiResponse<null>>('/auth/profile', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profil berhasil diperbarui');
        },
        onError: (error) => {
            const message = parseApiError(error);
            toast.error(message);
        },
    });
};

export const useChangePassword = () => {
    return useMutation<ApiResponse<null>, AxiosError<ApiErrorResponse>, PasswordInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<ApiResponse<null>>('/auth/change-password', data);
            return response.data;
        },
        onSuccess: () => toast.success('Password berhasil diubah'),
        onError: (error) => {
            const message = parseApiError(error);
            toast.error(message);
        },
    });
};