'use client';

import React from 'react';
import { Send, Sparkles, Layout, MessageSquare, List, Clock } from 'lucide-react';

interface InputPanelProps {
    onGenerate: (data: {
        topic: string;
        platform: string;
        tone: string;
        contentType?: string;
        slideCount?: string;
        duration?: string;
    }) => void;
    isLoading: boolean;
}

const platforms = [
    { id: 'tiktok', name: 'TikTok' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'youtube', name: 'YouTube Shorts' },
];

const tones = [
    { id: 'professional', name: 'Profesional' },
    { id: 'casual', name: 'Santai' },
    { id: 'funny', name: 'Lucu/Sarkas' },
    { id: 'inspiring', name: 'Inspiratif' },
];

export default function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
    const [topic, setTopic] = React.useState('');
    const [platform, setPlatform] = React.useState('tiktok');
    const [tone, setTone] = React.useState('casual');
    const [contentType, setContentType] = React.useState('reels');
    const [slideCount, setSlideCount] = React.useState('4');
    const [duration, setDuration] = React.useState('30');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onGenerate({
            topic,
            platform,
            tone,
            contentType: platform === 'instagram' ? contentType : undefined,
            slideCount: (platform === 'instagram' && contentType === 'carousel') ? slideCount : undefined,
            duration: (platform === 'instagram' && contentType === 'reels') ? duration : undefined,
        });
    };

    return (
        <div className="pastel-card h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <Sparkles className="text-primary w-6 h-6 fill-primary" />
                    Idea Studio
                </h2>
                <p className="text-foreground/60 text-sm">Automasi konten AIDA dalam hitungan detik.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 pb-4">
                {/* Topic Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Topik Konten
                    </label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Misal: Serum untuk kulit berjerawat..."
                        className="w-full min-h-[100px] p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none text-sm"
                    />
                </div>

                {/* Platform Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Pilih Platform
                    </label>
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all cursor-pointer text-sm"
                    >
                        {platforms.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Instagram Specific Options */}
                {platform === 'instagram' && (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <List className="w-4 h-4" /> Tipe Konten
                            </label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm cursor-pointer"
                            >
                                <option value="reels">Reels</option>
                                <option value="carousel">Carousel</option>
                            </select>
                        </div>

                        {contentType === 'carousel' ? (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <Layout className="w-4 h-4" /> Jumlah Slide
                                </label>
                                <select
                                    value={slideCount}
                                    onChange={(e) => setSlideCount(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm cursor-pointer"
                                >
                                    <option value="2">2 Slide</option>
                                    <option value="4">4 Slide</option>
                                    <option value="8">8 Slide</option>
                                    <option value="10">10 Slide</option>
                                </select>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Durasi
                                </label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm cursor-pointer"
                                >
                                    <option value="30">30 Detik</option>
                                    <option value="40">40 Detik</option>
                                    <option value="60">60 Detik</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Tone Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Gaya Bahasa (Tone)
                    </label>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all cursor-pointer text-sm"
                    >
                        {tones.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className={`w-full pastel-button bg-primary text-foreground hover:shadow-lg flex items-center justify-center gap-2 py-4 ${isLoading || !topic.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? (
                            <div className="animate-spin">
                                <Sparkles className="w-5 h-5" />
                            </div>
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        {isLoading ? 'Sedang Memproses...' : 'Generate Magic'}
                    </button>
                </div>
            </form>
        </div>
    );
}

