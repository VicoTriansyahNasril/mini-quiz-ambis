import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { VerifyInput } from '../types';
import { ApiErrorResponse, ApiResponse } from '@/types/api';
import { parseApiError } from '@/lib/error-handler';

// [DOCS] Hook custom untuk memanggil endpoint POST /auth/verify-email.
export const useVerify = () => {
    const router = useRouter();

    return useMutation<ApiResponse<null>, AxiosError<ApiErrorResponse>, VerifyInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<ApiResponse<null>>('/auth/verify-email', data);
            return response.data;
        },
        // [DOCS] Setelah verifikasi sukses, langsung arahkan user ke halaman login.
        onSuccess: () => {
            toast.success('Akun terverifikasi! Silakan login.');
            router.push('/login');
        },
        onError: (error) => {
            const message = parseApiError(error);
            toast.error(message);
        },
    });
};