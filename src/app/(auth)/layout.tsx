import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// [DOCS] Layout khusus untuk halaman Authentication (Login, Register, Verify).
// Memusatkan konten di tengah layar (Center alignment).
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex flex-col items-center gap-4 group transition-opacity hover:opacity-90"
                    >
                        <div className="relative w-20 h-20 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm">
                            <Image
                                src="/Logo.png"
                                alt="Logo Mini Quiz"
                                fill
                                className="object-contain"
                                priority
                            />
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