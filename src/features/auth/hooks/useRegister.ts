import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import apiClient from '@/lib/axios';
import { RegisterInput } from '../types';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { parseApiError } from '@/lib/error-handler';

// [DOCS] Hook custom untuk memanggil endpoint POST /auth/register.
export const useRegister = () => {
    const router = useRouter();

    return useMutation<ApiResponse<null>, AxiosError<ApiErrorResponse>, RegisterInput>({
        mutationFn: async (data) => {
            const response = await apiClient.post<ApiResponse<null>>('/auth/register', data);
            return response.data;
        },
        // [DOCS] Jika sukses, arahkan user ke halaman verifikasi email.
        onSuccess: () => {
            toast.success('Registrasi berhasil! Silakan cek email Anda.');
            router.push('/verify');
        },
        // [DOCS] Jika gagal, tampilkan pesan error yang diparsing dari API.
        onError: (error) => {
            const message = parseApiError(error);
            toast.error(message);
        },
    });
};