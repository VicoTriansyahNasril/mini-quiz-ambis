import { Suspense } from 'react';
import VerifyForm from '@/features/auth/components/VerifyForm';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Verifikasi Email - Mini Quiz Ambis',
};

// [DOCS] Halaman Verifikasi Email.
// Menggunakan Suspense karena komponen di dalamnya mungkin mengakses parameter URL (useSearchParams).
export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <VerifyForm />
        </Suspense>
    );
}