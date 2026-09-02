import { Trophy } from 'lucide-react';
import type { Achievement } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';

export default function AchievementsSection({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;
  return (
    <section id="achievements" className="section-padding bg-ink-50">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={<Trophy className="h-5 w-5" />}
          title="Achievements"
          subtitle="Awards, honors, and recognition earned along the journey."
        />

        <div className="mt-12 relative space-y-6 before:absolute before:left-[22px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-ink-200">
          {items.map((a) => (
            <div key={a.id} className="relative flex gap-5">
              <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-ink-50 bg-teal-600 text-white">
                <Trophy className="h-5 w-5" />
              </span>
              <div className="card flex-1 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-ink-900">{a.title}</h3>
                  {a.date && <span className="shrink-0 text-xs font-medium text-ink-400">{a.date}</span>}
                </div>
                {a.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{a.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
