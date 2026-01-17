import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const isPasswordType = type === 'password';
        const inputType = isPasswordType ? (isVisible ? 'text' : 'password') : type;

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className={cn(
                        "text-sm font-semibold block transition-colors",
                        error ? "text-red-600" : "text-slate-700"
                    )}>
                        {label}
                    </label>
                )}

                <div className="relative group">
                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            'flex w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 outline-none',
                            'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400',
                            'focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10',
                            error && 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500/10 placeholder:text-red-300',
                            isPasswordType && 'pr-12',
                            className
                        )}
                        {...props}
                    />

                    {isPasswordType && (
                        <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors focus:outline-none",
                                error
                                    ? "text-red-400 hover:bg-red-100 hover:text-red-600"
                                    : "text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                            )}
                            tabIndex={-1}
                        >
                            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-2 mt-1.5 animate-in slide-in-from-top-1 fade-in duration-300">
                        <AlertCircle size={14} className="text-red-600 shrink-0" />
                        <p className="text-xs text-red-600 font-medium">{error}</p>
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export { Input };