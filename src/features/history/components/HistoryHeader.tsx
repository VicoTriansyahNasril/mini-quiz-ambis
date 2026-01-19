import { Trophy } from 'lucide-react';
import { HistoryItem } from '../types';

// [DOCS] Header besar menampilkan Skor Akhir.
// Menggunakan styling dekoratif (background blur & gradient).
export default function HistoryHeader({ result }: { result: HistoryItem }) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12 text-center text-white">
                <h2 className="text-lg md:text-xl font-medium text-slate-300 tracking-wide mb-1">
                    Hasil Pengerjaan
                </h2>
                <h1 className="text-2xl md:text-4xl font-bold mb-8 leading-tight">
                    {result.subtest_name}
                </h1>

                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <span className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 drop-shadow-sm">
                            {result.score}
                        </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mt-4">
                        <Trophy size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold tracking-wide">SKOR AKHIR</span>
                    </div>
                </div>
            </div>
        </div>
    );
}