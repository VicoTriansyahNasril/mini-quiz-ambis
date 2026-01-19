// [DOCS] Menggunakan Zustand untuk state management client-side.
// Store ini berfungsi menyimpan jawaban sementara (draft) sebelum dikirim ke server.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/lib/utils';

interface QuizState {
    sessionId: string | null;
    failedSessionId: string | null;
    answers: Record<string, string>;
    flags: Record<string, boolean>;
    setSessionId: (id: string) => void;
    markSessionAsFailed: (id: string) => void;
    setAnswer: (id: string, value: string) => void;
    toggleFlag: (id: string) => void;
    resetAnswers: () => void;
}

export const useQuizStore = create<QuizState>()(
    // [DOCS] Middleware 'persist' menyimpan state ke localStorage.
    // Ini memungkinkan user me-refresh halaman tanpa kehilangan jawaban yang sudah dipilih.
    persist(
        (set) => ({
            sessionId: null,
            failedSessionId: null,
            answers: {},
            flags: {}, // [DOCS] Menyimpan status "Ragu-ragu"
            setSessionId: (id) => set({ sessionId: id, failedSessionId: null }),
            // [DOCS] Jika terjadi error fatal (misal 404/409), sesi ditandai gagal agar UI bisa reset.
            markSessionAsFailed: (id) => set({ failedSessionId: id, sessionId: null, answers: {}, flags: {} }),
            // [DOCS] Menyimpan jawaban dalam format object: { "1": "A", "2": "C" }
            setAnswer: (id, value) =>
                set((state) => ({ answers: { ...state.answers, [id]: value } })),
            // [DOCS] Toggle flag ragu-ragu untuk nomor soal tertentu
            toggleFlag: (id) =>
                set((state) => {
                    const newFlags = { ...state.flags };
                    if (newFlags[id]) delete newFlags[id];
                    else newFlags[id] = true;
                    return { flags: newFlags };
                }),
            // [DOCS] Membersihkan seluruh state lokal (dipanggil saat logout atau setelah submit sukses)
            resetAnswers: () => set({ sessionId: null, answers: {}, flags: {} }),
        }),
        { name: STORAGE_KEYS.QUIZ_DRAFT }
    )
);