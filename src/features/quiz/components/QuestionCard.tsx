'use client';

import { Question } from '../types';
import { useQuizStore } from '../store/quizStore';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface Props {
    question: Question;
}

export default function QuestionCard({ question }: Props) {
    const { answers, setAnswer } = useQuizStore();
    const selected = answers[question.question_number.toString()];

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg md:text-xl font-medium text-slate-900 mb-6 leading-relaxed">
                {question.question_text}
            </h3>
            <div className="space-y-3">
                {question.options.map((option) => (
                    <button
                        key={option}
                        onClick={() => setAnswer(question.question_number.toString(), option)}
                        className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group",
                            selected === option
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-100 hover:border-slate-300 text-slate-700"
                        )}
                    >
                        <span className="font-medium">{option}</span>
                        {selected === option && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </button>
                ))}
            </div>
        </div>
    );
}