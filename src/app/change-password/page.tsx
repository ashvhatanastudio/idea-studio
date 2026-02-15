'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Lock, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { update } = useSession();
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        if (password !== confirmPassword) {
            setError('Password tidak sama');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Gagal mengubah password');
            }

            // Update session to reflect the change (isTemporaryPassword: false)
            await update({ isTemporaryPassword: false });

            // Redirect to dashboard
            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Ganti Password</h1>
                    <p className="text-foreground/60 mt-2">Demi keamanan, Anda wajib mengganti password sementara.</p>
                </div>

                <div className="pastel-card p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Password Baru
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Check className="w-4 h-4" /> Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full pastel-button bg-accent text-white hover:shadow-lg flex items-center justify-center gap-2 py-4 font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                                }`}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
