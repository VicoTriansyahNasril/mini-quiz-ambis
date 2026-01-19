import LoginForm from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

// [DOCS] Konfigurasi Metadata untuk SEO & Tab Browser.
export const metadata: Metadata = {
    title: 'Login - Mini Quiz Ambis',
};

// [DOCS] Halaman Login. Merender form login.
export default function LoginPage() {
    return <LoginForm />;
}