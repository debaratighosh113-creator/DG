import {
  MapPin,
  Mail,
  ArrowDown,
  Stethoscope,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import type { Profile } from '@/lib/types';

export default function Hero({
  profile,
}: {
  profile: Profile | null;
}) {
  const [imageError, setImageError] = useState(false);

  const configuredImage =
    profile?.hero_image?.trim() || '';

  const heroImage =
    configuredImage && !imageError
      ? configuredImage
      : '/images/image.png';

  const displayName =
    profile?.full_name?.trim() || 'Nursing Professional';

  const tagline =
    profile?.tagline?.trim() || 'Nursing Professional';

  const bio =
    profile?.bio?.trim() ||
    'Compassionate nursing professional dedicated to evidence-based, patient-centered care.';

  const resumeUrl =
    profile?.resume_url?.trim() ||
    '/documents/DG_Nurse_CV-1.pdf';

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-ink-50 pt-24"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 md:px-12 lg:grid-cols-2 lg:pt-24">
        <div className="animate-fadeUp">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
            <Stethoscope
              className="h-4 w-4"
              aria-hidden="true"
            />

            {tagline}
          </span>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-5xl font-semibold leading-tight text-ink-900 md:text-6xl lg:text-7xl"
          >
            {displayName}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            {bio}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500">
            {profile?.location?.trim() && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  className="h-4 w-4 text-teal-600"
                  aria-hidden="true"
                />

                <span>
                  {profile.location.trim()}
                </span>
              </span>
            )}

            {profile?.email?.trim() && (
              <a
                href={`mailto:${profile.email.trim()}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-teal-700"
                aria-label={`Email ${displayName}`}
              >
                <Mail
                  className="h-4 w-4 text-teal-600"
                  aria-hidden="true"
                />

                <span>
                  {profile.email.trim()}
                </span>
              </a>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="btn-primary"
            >
              Get in touch
            </a>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              aria-label={`Download CV of ${displayName}`}
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="relative flex animate-fadeIn items-center justify-center lg:justify-self-end">
          <div className="relative z-10 overflow-hidden rounded-[2rem] border-8 border-white bg-ink-100 shadow-2xl shadow-ink-300/30">
            <img
              src={heroImage}
              alt={`${displayName} professional nursing portrait`}
              className="h-[380px] w-[340px] object-cover object-top md:h-[480px] md:w-[400px]"
              onError={() => {
                if (!imageError) {
                  setImageError(true);
                }
              }}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white p-4 shadow-xl md:left-auto md:right-2 md:translate-x-0">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700"
              aria-hidden="true"
            >
              <Heart
                className="h-5 w-5"
                fill="currentColor"
              />
            </span>

            <div>
              <p className="text-sm font-semibold text-ink-900">
                Patient-first
              </p>

              <p className="text-xs text-ink-500">
                Evidence-based care
              </p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-ink-400 transition-colors hover:text-teal-600 md:flex"
        aria-label="Scroll to about section"
      >
        <span className="text-xs uppercase tracking-widest">
          Scroll
        </span>

        <ArrowDown
          className="h-4 w-4 animate-bounce"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}