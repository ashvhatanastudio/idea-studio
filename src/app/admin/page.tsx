'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, Save, Copy } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pass = '';
        for (let i = 0; i < 8; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/user/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Gagal membuat user');
            }

            setMessage(`User "${username}" berhasil dibuat!`);
            setUsername('');
            setPassword('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="text-foreground/60">Kelola pengguna aplikasi.</p>
                    </div>
                </div>

                <div className="pastel-card p-8 max-w-lg">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-accent rounded-full"></span>
                        Buat User Baru
                    </h3>

                    <form onSubmit={handleCreateUser} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 outline-none"
                                placeholder="customer_01"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex justify-between">
                                Password
                                <button
                                    type="button"
                                    onClick={generateRandomPassword}
                                    className="text-xs text-accent hover:underline uppercase font-bold"
                                >
                                    Generate Random
                                </button>
                            </label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 outline-none font-mono"
                                placeholder="Min. 6 karakter"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                ⚠️ {error}
                            </div>
                        )}

                        {message && (
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 flex items-center gap-2">
                                ✅ {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full pastel-button bg-primary text-foreground hover:shadow-md flex items-center justify-center gap-2 py-3 font-bold mt-2 ${isLoading ? 'opacity-50' : 'hover:-translate-y-0.5'}`}
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? 'Menyimpan...' : 'Buat User'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
