'use client';

import React from 'react';
import InputPanel from '@/components/InputPanel';
import OutputPanel from '@/components/OutputPanel';
import { LogOut, UserCog } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);
  const [outputData, setOutputData] = React.useState<any>(null);

  const handleGenerate = async (params: {
    topic: string;
    platform: string;
    tone: string;
    contentType?: string;
    slideCount?: string;
    duration?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setOutputData(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error generating content. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen md:h-screen flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">idea studio</h1>
              <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">Dashboard</p>
            </div>
          </div>


          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold">Hallo, {session?.user?.name || 'User'}</p>
              <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-wider">
                {session?.user?.name === 'admin' ? 'Administrator' : 'Member'}
              </p>
            </div>

            {session?.user?.name === 'admin' && (
              <Link
                href="/admin"
                className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
                title="Admin Panel"
              >
                <UserCog className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2.5 rounded-xl bg-border/40 text-foreground/60 hover:bg-red-50 hover:text-red-500 transition-all border border-border/50"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-y-auto md:overflow-hidden">
          {/* Left Panel: Input */}
          <div className="w-full md:w-[400px] shrink-0">
            <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          {/* Right Panel: Output */}
          <div className="flex-1 h-full">
            <OutputPanel data={outputData} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
