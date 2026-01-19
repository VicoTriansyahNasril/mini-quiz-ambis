import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';
import { STORAGE_KEYS } from '@/lib/utils';
import { useQuizStore } from '@/features/quiz/store/quizStore';
import { toast } from 'sonner';

// [DOCS] Hook untuk menangani proses logout.
export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { resetAnswers } = useQuizStore();

    return useMutation({
        mutationFn: async () => {
            // [DOCS] Memberitahu backend untuk membatalkan token (blacklist).
            await apiClient.post('/auth/logout');
        },
        // [DOCS] onSettled dijalankan baik request sukses maupun gagal (cleanup client-side wajib jalan).
        onSettled: () => {
            // 1. Hapus token dari LocalStorage.
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            // 2. Reset state kuis (draft jawaban) di Zustand.
            resetAnswers();
            // 3. Bersihkan cache data server (React Query) agar data user lama tidak muncul.
            queryClient.clear();

            toast.success('Berhasil keluar akun');
            router.replace('/login');
        },
    });
};