import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 z-50 flex justify-center items-center shadow-sm h-14">
                <h1 className="font-bold text-lg text-slate-900">Mini Quiz Ambis</h1>
            </div>

            <header className="hidden md:block bg-white border-b sticky top-0 z-40 px-6 py-4 shadow-sm/50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                            <Hexagon size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="font-bold text-xl text-slate-900 tracking-tight">Mini Quiz</h1>
                    </Link>

                    <div>
                        <Navbar />
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-4 pt-20 md:p-8 md:pt-8">
                {children}
            </div>

            <div className="md:hidden">
                <Navbar />
            </div>
        </div>
    );
}