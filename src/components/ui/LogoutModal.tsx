'use client';

import { LogOut } from 'lucide-react';
import { Button } from './Button';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                <div className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300 delay-100">
                        <LogOut size={32} className="ml-1" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-black text-slate-900">Konfirmasi Keluar</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Apakah Anda yakin ingin keluar dari akun? Sesi Anda saat ini akan disimpan.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full bg-white hover:bg-slate-100 border-slate-200 text-slate-700 font-bold"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        className="w-full shadow-lg shadow-red-600/20 font-bold"
                    >
                        Ya, Keluar
                    </Button>
                </div>
            </div>
        </div>
    );
}