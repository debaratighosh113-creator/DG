import { FolderOpen, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';

export default function ProjectsSection({ items }: { items: Project[] }) {
  if (items.length === 0) return null;
  return (
    <section id="projects" className="section-padding bg-white">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          icon={<FolderOpen className="h-5 w-5" />}
          title="Projects"
          subtitle="Academic and community initiatives in nursing and public health."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((p) => (
            <article key={p.id} className="card group overflow-hidden transition-all hover:shadow-md">
              {p.image && (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{p.title}</h3>
                {p.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.description}</p>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700"
                  >
                    View project <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
