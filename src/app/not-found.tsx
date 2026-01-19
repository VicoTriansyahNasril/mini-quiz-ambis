import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

// [DOCS] Halaman 404 Custom.
// Memberikan tombol kembali ke Dashboard agar user tidak tersesat.
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full animate-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <SearchX size={32} />
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-2">404</h1>
                <h2 className="text-xl font-bold text-slate-700 mb-4">Halaman Tidak Ditemukan</h2>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                </p>

                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    <Home size={18} /> Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
}