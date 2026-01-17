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
    persist(
        (set) => ({
            sessionId: null,
            failedSessionId: null,
            answers: {},
            flags: {},
            setSessionId: (id) => set({ sessionId: id, failedSessionId: null }),
            markSessionAsFailed: (id) => set({ failedSessionId: id, sessionId: null, answers: {}, flags: {} }),
            setAnswer: (id, value) =>
                set((state) => ({ answers: { ...state.answers, [id]: value } })),
            toggleFlag: (id) =>
                set((state) => {
                    const newFlags = { ...state.flags };
                    if (newFlags[id]) delete newFlags[id];
                    else newFlags[id] = true;
                    return { flags: newFlags };
                }),
            resetAnswers: () => set({ sessionId: null, answers: {}, flags: {} }),
        }),
        { name: STORAGE_KEYS.QUIZ_DRAFT }
    )
);