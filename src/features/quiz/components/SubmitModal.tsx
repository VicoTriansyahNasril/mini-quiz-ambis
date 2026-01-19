'use client';

// [DOCS] Modal konfirmasi sebelum submit kuis.
// Menampilkan ringkasan: Terjawab, Ragu-ragu, dan Kosong.
import { Button } from '@/components/ui/Button';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    totalQuestions: number;
    isSubmitting: boolean;
}

export default function SubmitModal({ isOpen, onClose, onConfirm, totalQuestions, isSubmitting }: Props) {
    const { answers, flags } = useQuizStore();

    if (!isOpen) return null;

    // [DOCS] Hitung statistik pengerjaan saat ini.
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = Object.keys(flags).length;
    const unansweredCount = totalQuestions - answeredCount;

    const isComplete = unansweredCount === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Konfirmasi Submit</h2>
                        <p className="text-sm text-slate-500 mt-1">Cek kembali status pengerjaan Anda.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                            <div className="text-xs text-green-700 font-medium mt-1">Terjawab</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                            <div className="text-2xl font-bold text-yellow-600">{flaggedCount}</div>
                            <div className="text-xs text-yellow-700 font-medium mt-1">Ragu-ragu</div>
                        </div>
                        <div className={`p-3 rounded-xl border ${unansweredCount > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`text-2xl font-bold ${unansweredCount > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                                {unansweredCount}
                            </div>
                            <div className={`text-xs font-medium mt-1 ${unansweredCount > 0 ? 'text-red-700' : 'text-slate-600'}`}>
                                Kosong
                            </div>
                        </div>
                    </div>

                    {/* [DOCS] Tampilkan peringatan jika masih ada soal kosong */}
                    {!isComplete ? (
                        <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                            <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={20} />
                            <div className="text-sm">
                                <p className="font-bold text-red-900">Belum Selesai!</p>
                                <p className="mt-1 leading-relaxed">
                                    Anda masih memiliki <b>{unansweredCount} soal</b> yang belum diisi.
                                    Mohon lengkapi semua jawaban sebelum mengumpulkan.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                            <CheckCircle2 className="shrink-0 mt-0.5 text-blue-600" size={20} />
                            <div className="text-sm">
                                <p className="font-bold text-blue-900">Siap Dikumpulkan</p>
                                <p className="mt-1 leading-relaxed">
                                    Semua soal telah terjawab. Apakah Anda yakin ingin mengakhiri sesi ini?
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="w-full bg-white hover:bg-slate-100">
                        {isComplete ? 'Cek Lagi' : 'Lengkapi Jawaban'}
                    </Button>

                    <Button
                        onClick={onConfirm}
                        isLoading={isSubmitting}
                        // [DOCS] Disable tombol submit jika belum lengkap (requirement: force completion)
                        disabled={!isComplete}
                        className={`w-full ${!isComplete ? 'opacity-50 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                        {isComplete ? 'Ya, Kumpulkan' : 'Belum Lengkap'}
                    </Button>
                </div>
            </div>
        </div>
    );
}