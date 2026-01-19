import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { LoginInput, AuthResponse } from '../types';
import { ApiResponse, ApiErrorResponse } from '@/types/api';

// [DOCS] Hook custom untuk memanggil endpoint POST /auth/login.
// Menggunakan useMutation karena operasi ini mengubah state di server/client (bukan sekadar fetch data).
export const useLogin = () => {
    return useMutation<ApiResponse<AuthResponse>, AxiosError<ApiErrorResponse>, LoginInput>({
        mutationFn: async (credentials) => {
            // Mengirim email & password ke API Proxy
            const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
            return data;
        },
    });
};