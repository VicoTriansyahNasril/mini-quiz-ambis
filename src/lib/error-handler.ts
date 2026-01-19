// [DOCS] Utilitas untuk memparsing berbagai format error dari Backend.
// Backend bisa mengembalikan error string sederhana, object error, atau array validasi.
// Fungsi ini menstandarisasi outputnya menjadi string tunggal untuk Toast Notification.

import { AxiosError } from 'axios';
import { isObject } from '@/types/api';

export function parseApiError(error: unknown): string {
    if (error instanceof AxiosError) {
        if (!error.response) {
            return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        }

        const status = error.response.status;
        const data = error.response.data as unknown;

        // [DOCS] Pesan standar untuk status code umum.
        if (status === 409) return 'Data sudah terdaftar atau konflik.';
        if (status === 401) return 'Sesi habis atau kredensial salah.';
        if (status === 500) return 'Terjadi kesalahan internal pada server.';

        if (isObject(data)) {
            // [DOCS] Handle error validasi Laravel/Express (biasanya format: { errors: { email: ["Invalid"] } })
            if ('errors' in data && isObject(data.errors)) {
                const errors = data.errors as Record<string, unknown[]>;
                const firstField = Object.keys(errors)[0];
                if (firstField && Array.isArray(errors[firstField]) && errors[firstField].length > 0) {
                    return String(errors[firstField][0]);
                }
            }

            // [DOCS] Handle format error: { error: "Message" }
            if ('error' in data && typeof data.error === 'string') {
                return data.error;
            }

             // [DOCS] Handle format error: { message: "Message" }
            if ('message' in data && typeof data.message === 'string') {
                return data.message;
            }

            // [DOCS] Handle nested message object
            if ('message' in data && isObject(data.message)) {
                const nestedMessage = data.message;
                if ('message' in nestedMessage && typeof nestedMessage.message === 'string') {
                    return nestedMessage.message;
                }
            }
        }
    }

    if (error instanceof Error) return error.message;

    return 'Terjadi kesalahan yang tidak diketahui.';
}