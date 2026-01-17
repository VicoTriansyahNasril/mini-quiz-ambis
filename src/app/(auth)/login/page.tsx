import LoginForm from '@/features/auth/components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Mini Quiz Ambis',
};

export default function LoginPage() {
    return <LoginForm />;
}