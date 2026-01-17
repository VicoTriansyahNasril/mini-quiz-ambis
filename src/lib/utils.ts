import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const STORAGE_KEYS = {
    TOKEN: 'mq_access_token',
    QUIZ_DRAFT: 'mq_quiz_draft',
};