import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { STORAGE_KEYS } from '@/lib/utils';
import { useQuizStore } from '@/features/quiz/store/quizStore';
import { toast } from 'sonner';

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { resetAnswers } = useQuizStore();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/auth/logout');
        },
        onSettled: () => {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            resetAnswers();
            queryClient.clear();
            toast.success('Berhasil keluar akun');
            router.replace('/login');
        },
    });
};