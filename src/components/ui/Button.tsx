import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// [DOCS] Interface props button, menambahkan variant visual dan state loading.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'outline' | 'ghost';
    isLoading?: boolean;
}

// [DOCS] Komponen Button Reusable.
// Mendukung state 'isLoading' (menampilkan spinner dan disable klik).
// Menggunakan forwardRef agar bisa digunakan dengan library lain jika perlu.
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {

        // [DOCS] Definisi style berdasarkan variant.
        const variants = {
            primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md',
            danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
            outline: 'border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-transparent',
            ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading} // [DOCS] Otomatis disabled saat loading
                className={cn(
                    'flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    className
                )}
                {...props}
            >
                {/* [DOCS] Tampilkan spinner jika sedang loading */}
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export { Button };