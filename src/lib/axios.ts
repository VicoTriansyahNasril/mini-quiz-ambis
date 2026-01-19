// [DOCS] Konfigurasi Axios Client Global.
// File ini sangat penting karena menangani Auth Header Injection & Auto Logout.

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from './utils';

const apiClient = axios.create({
    baseURL: '/api/proxy', // [DOCS] Semua request diarahkan ke Proxy Next.js
    headers: { 'Content-Type': 'application/json' },
});

// [DOCS] Request Interceptor: Otomatis menyisipkan Bearer Token ke setiap request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// [DOCS] Response Interceptor: Menangani error global.
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // [DOCS] Jika response 401 (Unauthorized), artinya token expired/invalid.
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const currentPath = window.location.pathname;

            // [DOCS] Cegah loop redirect jika sudah di halaman auth.
            const isAuthPage =
                currentPath.startsWith('/login') ||
                currentPath.startsWith('/register') ||
                currentPath.startsWith('/verify');

            if (!isAuthPage) {
                // [DOCS] Hapus token dan paksa user login ulang.
                localStorage.removeItem(STORAGE_KEYS.TOKEN);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;