import { Stethoscope, Clock, Activity } from 'lucide-react';
import type { ClinicalExperience } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';

export default function ClinicalSection({ items }: { items: ClinicalExperience[] }) {
  if (items.length === 0) return null;
  return (
    <section id="clinical" className="section-padding bg-ink-50">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          icon={<Stethoscope className="h-5 w-5" />}
          title="Clinical Experience"
          subtitle="Hands-on patient care across diverse clinical settings."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="card overflow-hidden p-6 transition-all hover:shadow-md md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink-900">{c.facility}</h3>
                  <p className="mt-1 text-sm font-medium text-teal-700">{c.unit}</p>
                </div>
                {c.hours != null && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
                    <Clock className="h-3.5 w-3.5" />
                    {c.hours} hrs
                  </span>
                )}
              </div>

              <div className="mt-3 text-sm text-ink-400">
                {c.start_date} — {c.end_date}
              </div>

              {c.description && (
                <p className="mt-4 text-sm leading-relaxed text-ink-600">{c.description}</p>
              )}

              {c.skills_practiced && (
                <div className="mt-5 border-t border-ink-100 pt-4">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <Activity className="h-3.5 w-3.5" />
                    Skills practiced
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.skills_practiced.split(',').map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
