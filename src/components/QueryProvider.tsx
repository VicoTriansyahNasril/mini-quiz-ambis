'use client';

// [DOCS] Provider untuk TanStack Query (React Query).
// Mengatur konfigurasi default caching dan refetching.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1, // [DOCS] Coba request ulang 1x jika gagal
                refetchOnWindowFocus: false, // [DOCS] Matikan auto-refresh saat ganti tab (hemat bandwidth)
            },
        },
    }));

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}