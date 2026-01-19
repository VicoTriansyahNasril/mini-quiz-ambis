import RegisterForm from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar Akun - Mini Quiz Ambis',
};

// [DOCS] Halaman Registrasi. Merender form pendaftaran.
export default function RegisterPage() {
    return <RegisterForm />;
}