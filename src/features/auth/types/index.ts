import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    name: z.string()
        .min(1, 'Nama lengkap wajib diisi')
        .min(3, 'Nama terlalu pendek'),
    email: z.string()
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),
    password: z.string()
        .min(8, 'Min. 8 karakter')
        .regex(/[A-Z]/, 'Wajib ada 1 huruf besar')
        .regex(/[0-9]/, 'Wajib ada 1 angka')
        .regex(/[^a-zA-Z0-9]/, 'Wajib ada 1 simbol unik'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const verifySchema = z.object({
    token: z.string().min(1, 'Token wajib diisi'),
});
export type VerifyInput = z.infer<typeof verifySchema>;

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}