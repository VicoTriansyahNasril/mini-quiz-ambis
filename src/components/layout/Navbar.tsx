'use client';

// [DOCS] Navbar Navigasi Utama.
// Bersifat responsif: Bottom Navigation (Mobile) & Top Navigation (Desktop).
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, History, User } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    // [DOCS] Sembunyikan navbar saat sedang mengerjakan kuis (Distraction Free Mode).
    const isQuizSession = pathname.startsWith('/quiz/session');

    if (isQuizSession) return null;

    const links = [
        { href: '/dashboard', label: 'Home', icon: Home },
        { href: '/history', label: 'Riwayat', icon: History },
        { href: '/profile', label: 'Akun', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 md:static md:border-none md:bg-transparent md:backdrop-blur-none z-50">
            <div className="flex justify-around md:justify-end md:gap-6 p-2 md:p-0 max-w-5xl mx-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    // [DOCS] Cek active state
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                                isActive
                                    ? "text-blue-600 bg-blue-50/50 font-bold"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium"
                            )}
                        >
                            <Icon size={isActive ? 22 : 20} />
                            <span className="text-[10px] md:text-sm">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}