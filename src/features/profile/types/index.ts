import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({
    old_password: z.string().min(1, 'Password lama wajib diisi'),
    new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
});
export type PasswordInput = z.infer<typeof passwordSchema>;

export interface UserProfile {
    name: string;
    email: string;
}