'use client';

import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface Props {
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isFirst: boolean;
    isLast: boolean;
    isLoading: boolean;
    variant?: 'fixed' | 'static';
}

export default function QuizFooter({
    onPrev,
    onNext,
    onSubmit,
    isFirst,
    isLast,
    isLoading,
    variant = 'fixed'
}: Props) {

    if (variant === 'static') {
        return (
            <div className="hidden md:flex justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    disabled={isFirst}
                    className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 px-6"
                >
                    <ArrowLeft size={18} className="mr-2" /> Sebelumnya
                </Button>

                {isLast ? (
                    <Button
                        onClick={onSubmit}
                        isLoading={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 shadow-lg shadow-green-600/20"
                    >
                        Selesai <Send size={18} className="ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={onNext}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 shadow-lg shadow-slate-900/20"
                    >
                        Selanjutnya <ArrowRight size={18} className="ml-2" />
                    </Button>
                )}
            </div>
        );
    }

    return (
        <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
            <div className="flex justify-between items-center gap-3">
                <Button
                    variant="outline"
                    onClick={onPrev}
                    disabled={isFirst}
                    className="flex-1 bg-white border-slate-200"
                >
                    <ArrowLeft size={18} />
                </Button>

                {isLast ? (
                    <Button
                        onClick={onSubmit}
                        isLoading={isLoading}
                        className="flex-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                        Selesai <Send size={18} className="ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={onNext}
                        className="flex-2 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                        Lanjut <ArrowRight size={18} className="ml-2" />
                    </Button>
                )}
            </div>
        </footer>
    );
}