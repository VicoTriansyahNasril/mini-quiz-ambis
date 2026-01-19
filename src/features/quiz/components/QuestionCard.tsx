'use client';

import { Question } from '../types';
import { useQuizStore } from '../store/quizStore';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
    question: Question;
}

export default function QuestionCard({ question }: Props) {
    const { answers, setAnswer } = useQuizStore();
    const selected = answers[question.question_number.toString()];

    const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
        <div className="relative bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-900/5 border border-white overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-linear-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-linear-to-tr from-purple-500/5 to-pink-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                        {question.question_text}
                    </h3>
                </div>

                <div className="space-y-3">
                    {question.options.map((option, idx) => {
                        const isSelected = selected === option;
                        const letter = optionLetters[idx];

                        return (
                            <button
                                key={option}
                                onClick={() => setAnswer(question.question_number.toString(), option)}
                                className={cn(
                                    "w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 group relative overflow-hidden",
                                    isSelected
                                        ? "border-blue-600 bg-linear-to-r from-blue-50 to-indigo-50 shadow-lg shadow-blue-600/20 scale-[1.02]"
                                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300",
                                    isSelected
                                        ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30"
                                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                )}>
                                    {letter}
                                </div>

                                <span className={cn(
                                    "flex-1 font-medium pt-2 transition-colors",
                                    isSelected ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                                )}>
                                    {option}
                                </span>

                                <div className="shrink-0 pt-2">
                                    {isSelected ? (
                                        <CheckCircle2 className="w-6 h-6 text-blue-600 animate-in zoom-in duration-300" strokeWidth={2.5} />
                                    ) : (
                                        <Circle className="w-6 h-6 text-slate-300 group-hover:text-slate-400" strokeWidth={2} />
                                    )}
                                </div>

                                {!isSelected && (
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}