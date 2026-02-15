'use client';

import React from 'react';
import { Copy, Check, Download, Hash, FileText, Zap, Sparkles, List } from 'lucide-react';

interface OutputData {
    title_suggestions: string[];
    aida_script: {
        attention: string[];
        interest: string;
        desire: string[];
        action: string;
    };
    content_plan?: string[];
    metadata: {
        caption: string;
        hashtags: string[];
    };
}

interface OutputPanelProps {
    data: OutputData | null;
    isLoading: boolean;
}

export default function OutputPanel({ data, isLoading }: OutputPanelProps) {
    const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const handleDownload = () => {
        if (!data) return;
        const content = `
TITLE SUGGESTIONS:
${data.title_suggestions.join('\n')}

AIDA SCRIPT:
Attention (Hooks):
${data.aida_script.attention.join('\n')}

Interest:
${data.aida_script.interest}

Desire:
${data.aida_script.desire.map(d => `- ${d}`).join('\n')}

Action:
${data.aida_script.action}

${data.content_plan ? `CONTENT PLAN (POINTS):\n${data.content_plan.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n` : ''}

CAPTION & HASHTAGS:
${data.metadata.caption}

Hashtags:
${data.metadata.hashtags.join(' ')}
    `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idea-studio-content.txt`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="h-full pastel-card flex items-center justify-center bg-background/50 border-dashed border-2">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="text-primary w-8 h-8 fill-primary" />
                    </div>
                    <p className="text-foreground/40 font-medium">Sedang meracik konten terbaik untukmu...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full pastel-card flex items-center justify-center bg-background/50 border-dashed border-2">
                <div className="text-center max-w-xs">
                    <div className="w-16 h-16 bg-border/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="text-foreground/20 w-8 h-8" />
                    </div>
                    <p className="text-foreground/40 font-medium italic">Hasil akan muncul di sini setelah kamu klik 'Generate Magic'.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Zap className="text-accent w-5 h-5 fill-accent" />
                        Output Result
                    </h3>
                    <button
                        onClick={handleDownload}
                        className="pastel-button bg-accent text-foreground text-sm flex items-center gap-2 hover:shadow-md"
                    >
                        <Download className="w-4 h-4" /> Export .TXT
                    </button>
                </div>

                {/* Title Suggestions */}
                <Section
                    title="Viral Title Suggestions"
                    icon={<FileText className="w-4 h-4" />}
                    content={data.title_suggestions.join('\n')}
                    onCopy={() => copyToClipboard(data.title_suggestions.join('\n'), 'titles')}
                    isCopied={copiedSection === 'titles'}
                >
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {data.title_suggestions.map((t, i) => (
                            <li key={i} className="text-foreground/80">{t}</li>
                        ))}
                    </ul>
                </Section>

                {/* Hooks (Attention) */}
                <Section
                    title="Attention (Scroll-Stopping Hooks)"
                    icon={<Zap className="w-4 h-4 text-primary" />}
                    content={data.aida_script.attention.join('\n')}
                    onCopy={() => copyToClipboard(data.aida_script.attention.join('\n'), 'hooks')}
                    isCopied={copiedSection === 'hooks'}
                >
                    <div className="grid grid-cols-1 gap-2">
                        {data.aida_script.attention.map((h, i) => (
                            <div key={i} className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-sm italic">
                                "{h}"
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Interest & Desire */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Section
                        title="Interest"
                        content={data.aida_script.interest}
                        onCopy={() => copyToClipboard(data.aida_script.interest, 'interest')}
                        isCopied={copiedSection === 'interest'}
                    >
                        <p className="text-sm text-foreground/80 leading-relaxed">{data.aida_script.interest}</p>
                    </Section>
                    <Section
                        title="Desire (Solutions)"
                        content={data.aida_script.desire.join('\n')}
                        onCopy={() => copyToClipboard(data.aida_script.desire.join('\n'), 'desire')}
                        isCopied={copiedSection === 'desire'}
                    >
                        <ul className="space-y-1">
                            {data.aida_script.desire.map((d, i) => (
                                <li key={i} className="text-sm text-foreground/80 flex gap-2">
                                    <span className="text-success font-bold">•</span> {d}
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>

                {/* Action (CTA) */}
                <Section
                    title="Action (CTA)"
                    content={data.aida_script.action}
                    onCopy={() => copyToClipboard(data.aida_script.action, 'action')}
                    isCopied={copiedSection === 'action'}
                >
                    <p className="text-sm font-bold text-foreground bg-success/10 p-3 rounded-lg border border-success/20">
                        {data.aida_script.action}
                    </p>
                </Section>

                {/* Content Plan (Point-by-point) */}
                {data.content_plan && (
                    <Section
                        title="Content Plan (Step-by-step)"
                        icon={<List className="w-4 h-4 text-accent" />}
                        content={data.content_plan.join('\n')}
                        onCopy={() => copyToClipboard(data.content_plan?.join('\n') || '', 'plan')}
                        isCopied={copiedSection === 'plan'}
                    >
                        <ul className="space-y-3">
                            {data.content_plan.map((p, i) => (
                                <li key={i} className="text-sm text-foreground/80 flex gap-3 p-3 bg-accent/5 rounded-xl border border-accent/10">
                                    <span className="flex-shrink-0 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent">
                                        {i + 1}
                                    </span>
                                    <span className="leading-relaxed">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Caption & Hashtags */}
                <Section
                    title="Caption & Hashtags"
                    icon={<Hash className="w-4 h-4 text-secondary" />}
                    content={`${data.metadata.caption}\n\n${data.metadata.hashtags.join(' ')}`}
                    onCopy={() => copyToClipboard(`${data.metadata.caption}\n\n${data.metadata.hashtags.join(' ')}`, 'caption')}
                    isCopied={copiedSection === 'caption'}
                >
                    <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                        <p className="text-sm text-foreground/80 mb-4 whitespace-pre-wrap">{data.metadata.caption}</p>
                        <div className="flex flex-wrap gap-1">
                            {data.metadata.hashtags.map((h, i) => (
                                <span key={i} className="text-xs text-secondary font-medium">{h}</span>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
}

function Section({ title, icon, content, onCopy, isCopied, children }: any) {
    return (
        <div className="bg-card rounded-2xl border border-border p-5 relative group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-foreground/50">
                    {icon}
                    {title}
                </h4>
                <button
                    onClick={onCopy}
                    className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-success text-foreground' : 'bg-border/50 text-foreground/40 hover:bg-border hover:text-foreground'
                        }`}
                >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            {children}
        </div>
    );
}
