import { useState } from 'react';
import { Award, BadgeCheck, Calendar, Eye } from 'lucide-react';
import type { Certification } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import DocumentViewer from '@/components/DocumentViewer';

export default function CertificationsSection({ items }: { items: Certification[] }) {
  const [viewing, setViewing] = useState<Certification | null>(null);

  if (items.length === 0) return null;
  return (
    <section id="certifications" className="section-padding bg-ink-50">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={<Award className="h-5 w-5" />}
          title="Certifications & Licenses"
          subtitle="Professional credentials and current certifications."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="card flex items-start gap-4 p-6 transition-all hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <BadgeCheck className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-ink-900">{c.name}</h3>
                {c.issuer && <p className="mt-0.5 text-sm text-ink-500">{c.issuer}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-400">
                  {c.issue_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Issued {c.issue_date}
                    </span>
                  )}
                  {c.expiry_date && (() => {
  const expiry = new Date(`${c.expiry_date}-01T23:59:59`);
  const expired = !Number.isNaN(expiry.getTime()) &&
    expiry.getTime() < Date.now();

  return (
    <span
      className={`inline-flex items-center gap-1 ${
        expired ? 'text-red-500' : ''
      }`}
    >
      <Calendar className="h-3.5 w-3.5" />
      {expired ? 'Expired' : 'Expires'} {c.expiry_date}
    </span>
  );
})()}
                  {c.credential_id && (
                    <span className="font-mono">ID: {c.credential_id}</span>
                  )}
                </div>

                {c.document_url && (
                  <button
                    onClick={() => setViewing(c)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-95"
                  >
                    <Eye className="h-4 w-4" />
                    View Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewing?.document_url && (
        <DocumentViewer
          url={viewing.document_url}
          title={viewing.name}
          onClose={() => setViewing(null)}
        />
      )}
    </section>
  );
}
