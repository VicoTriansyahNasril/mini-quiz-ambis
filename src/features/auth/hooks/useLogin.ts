import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { LoginInput, AuthResponse } from '../types';
import { ApiResponse, ApiErrorResponse } from '@/types/api';

export const useLogin = () => {
    return useMutation<ApiResponse<AuthResponse>, AxiosError<ApiErrorResponse>, LoginInput>({
        mutationFn: async (credentials) => {
            const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
            return data;
        },
    });
};