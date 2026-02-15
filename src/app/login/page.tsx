'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Sparkles, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Username atau password salah.');
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <span className="text-4xl text-white">✨</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Idea Studio</h1>
                    <p className="text-foreground/60 mt-2">Silakan login untuk mengakses dashboard.</p>
                </div>

                <div className="pastel-card p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" /> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
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
                            className={`w-full pastel-button bg-primary text-foreground hover:shadow-lg flex items-center justify-center gap-2 py-4 font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                                }`}
                        >
                            {isLoading ? 'Sedang Memproses...' : 'Login Sekarang'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-foreground/40 mt-8 uppercase tracking-widest">
                    AI Powered Content Generator
                </p>
            </div>
        </div>
    );
}
