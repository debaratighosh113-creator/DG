import { Zap } from 'lucide-react';
import type { Skill } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';

const proficiencyColor: Record<string, string> = {
  Beginner: 'bg-amber-100 text-amber-700',
  Intermediate: 'bg-sky-100 text-sky-700',
  Advanced: 'bg-teal-100 text-teal-700',
};

const proficiencyWidth: Record<string, string> = {
  Beginner: 'w-1/3',
  Intermediate: 'w-2/3',
  Advanced: 'w-full',
};

export default function SkillsSection({ items }: { items: Skill[] }) {
  if (items.length === 0) return null;

  const categories = Array.from(new Set(items.map((s) => s.category)));

  return (
    <section id="skills" className="section-padding bg-white">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={<Zap className="h-5 w-5" />}
          title="Skills"
          subtitle="Clinical, technical, and communication competencies developed through practice."
        />

        <div className="mt-12 space-y-10">
          {categories.map((cat) => (
            <div key={cat}>
              <h3 className="mb-4 font-display text-lg font-semibold text-ink-800">{cat}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {items
                  .filter((s) => s.category === cat)
                  .map((s) => (
                    <div key={s.id} className="card p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink-800">{s.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            proficiencyColor[s.proficiency] ?? proficiencyColor.Intermediate
                          }`}
                        >
                          {s.proficiency}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                        <div
                          className={`h-full rounded-full bg-teal-500 transition-all ${
                            proficiencyWidth[s.proficiency] ?? proficiencyWidth.Intermediate
                          }`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
