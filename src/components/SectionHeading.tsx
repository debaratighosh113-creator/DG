import type { ReactNode } from 'react';

type SectionHeadingProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export function SectionHeading({
  icon,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {/* Visual section label */}
      <div
        className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-semibold text-teal-700"
        aria-hidden="true"
      >
        <span className="shrink-0">
          {icon}
        </span>

        <span>{title}</span>
      </div>

      {/* Semantic section heading */}
      <h2 className="mt-4 font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-ink-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}