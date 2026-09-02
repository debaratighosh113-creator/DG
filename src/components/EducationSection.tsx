import { useState } from 'react';
import { GraduationCap, Building2, CalendarDays, Eye } from 'lucide-react';
import type { Education } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import DocumentViewer from '@/components/DocumentViewer';

export default function EducationSection({ items }: { items: Education[] }) {
  const [viewing, setViewing] = useState<Education | null>(null);

  if (items.length === 0) return null;
  return (
    <section id="education" className="section-padding bg-white">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={<GraduationCap className="h-5 w-5" />}
          title="Education"
          subtitle="Academic foundations in nursing and health sciences."
        />

        <div className="mt-12 space-y-6">
          {items.map((edu) => (
            <div
              key={edu.id}
              className="card group flex flex-col gap-4 p-6 transition-all hover:shadow-md md:flex-row md:items-start md:gap-6 md:p-8"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold text-ink-900">{edu.degree}</h3>
                <p className="mt-1 text-sm font-medium text-teal-700">{edu.school}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-400">
                  <CalendarDays className="h-4 w-4" />
                  {edu.start_date} — {edu.end_date}
                </div>
                {edu.description && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{edu.description}</p>
                )}

                {edu.marksheet_url && (
                  <button
                    onClick={() => setViewing(edu)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-95"
                  >
                    <Eye className="h-4 w-4" />
                    View Marksheet
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewing?.marksheet_url && (
        <DocumentViewer
          url={viewing.marksheet_url}
          title={`${viewing.degree} — Marksheet`}
          onClose={() => setViewing(null)}
        />
      )}
    </section>
  );
}
