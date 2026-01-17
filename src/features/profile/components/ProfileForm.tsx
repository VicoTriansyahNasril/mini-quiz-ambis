'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileInput } from '../types';
import { useGetProfile, useUpdateProfile } from '../hooks/useProfile';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Save, Pencil, X } from 'lucide-react';

export default function ProfileForm() {
    const { data: profile, isLoading } = useGetProfile();
    const { mutate, isPending } = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-900 text-lg">Informasi Pribadi</h3>
                {!isEditing && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="h-9 px-4 text-xs bg-white hover:bg-slate-50"
                    >
                        <Pencil size={14} className="mr-2" /> Edit Data
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit((data) => {
                mutate(data, { onSuccess: () => setIsEditing(false) });
            })} className="space-y-5">

                <div className="relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                    {isEditing ? (
                        <Input error={errors.name?.message} {...register('name')} />
                    ) : (
                        <p className="text-slate-900 font-medium text-lg border-b border-slate-100 pb-2">{profile?.name}</p>
                    )}
                </div>

                <div className="relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
                    {isEditing ? (
                        <Input type="email" error={errors.email?.message} {...register('email')} />
                    ) : (
                        <p className="text-slate-900 font-medium text-lg border-b border-slate-100 pb-2">{profile?.email}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="flex gap-3 pt-2 animate-in fade-in slide-in-from-top-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset(profile);
                                setIsEditing(false);
                            }}
                            className="flex-1 bg-white"
                        >
                            <X size={16} className="mr-2" /> Batal
                        </Button>
                        <Button type="submit" isLoading={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            <Save size={16} className="mr-2" /> Simpan
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}