import { Loader2 } from 'lucide-react';

// [DOCS] Global Loading State untuk Next.js App Router.
// Muncul saat transisi antar halaman (server component loading).
export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Memuat aplikasi...</p>
        </div>
    );
}