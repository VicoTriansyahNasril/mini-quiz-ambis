'use client';

import { X } from 'lucide-react';
import QuestionNavigator from './QuestionNavigator';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    totalQuestions: number;
    currentIndex: number;
    onNavigate: (index: number) => void;
}

export default function MobileNavigator({ isOpen, onClose, totalQuestions, currentIndex, onNavigate }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Navigasi Soal</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto">
                    <QuestionNavigator
                        totalQuestions={totalQuestions}
                        currentIndex={currentIndex}
                        onNavigate={(idx) => {
                            onNavigate(idx);
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}