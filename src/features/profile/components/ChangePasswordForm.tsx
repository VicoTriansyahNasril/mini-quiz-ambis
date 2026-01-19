'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, PasswordInput } from '../types';
import { useChangePassword } from '../hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// [DOCS] Form ganti password sederhana.
export default function ChangePasswordForm() {
    const { mutate, isPending } = useChangePassword();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordInput>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = (data: PasswordInput) => {
        // [DOCS] Reset form setelah sukses update password
        mutate(data, { onSuccess: () => reset() });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <Input
                label="Password Lama"
                type="password"
                error={errors.old_password?.message}
                {...register('old_password')}
            />
            <Input
                label="Password Baru"
                type="password"
                error={errors.new_password?.message}
                {...register('new_password')}
            />
            <Button type="submit" variant="outline" isLoading={isPending}>Update Password</Button>
        </form>
    );
}