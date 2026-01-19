import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// [DOCS] Helper untuk menggabungkan class Tailwind secara kondisional dan aman (merge conflict).
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// [DOCS] Konstanta Key LocalStorage agar tidak ada typo/magic strings.
export const STORAGE_KEYS = {
    TOKEN: 'mq_access_token',
    QUIZ_DRAFT: 'mq_quiz_draft',
};