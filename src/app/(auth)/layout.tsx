import { ReactNode } from 'react';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-90"
                    >
                        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-md shadow-blue-600/10 transition-transform duration-300 group-hover:scale-105">
                            <Hexagon size={28} strokeWidth={2.5} />
                        </div>
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            Mini Quiz
                        </span>
                    </Link>
                </div>

                {children}
            </div>
        </div>
    );
}