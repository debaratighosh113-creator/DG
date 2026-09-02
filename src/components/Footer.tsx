import { Heart, Lock } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer className="bg-ink-950 px-6 py-12 text-center text-ink-400 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-2 text-ink-200">
          <Heart className="h-5 w-5 text-teal-400" fill="currentColor" />
          <span className="font-display text-lg font-semibold">
            {profile?.full_name ?? 'Nursing Portfolio'}
          </span>
        </div>
        <p className="mt-3 text-sm">
          Dedicated to compassionate, evidence-based nursing care.
        </p>
        <a href="#/admin" className="mt-6 inline-flex items-center gap-1.5 text-xs text-ink-500 transition-colors hover:text-ink-300">
          <Lock className="h-3 w-3" />
          Admin
        </a>
      </div>
    </footer>
  );
}
