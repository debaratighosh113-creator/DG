import { useEffect } from 'react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EducationSection from '@/components/EducationSection';
import ClinicalSection from '@/components/ClinicalSection';
import SkillsSection from '@/components/SkillsSection';
import CertificationsSection from '@/components/CertificationsSection';
import ProjectsSection from '@/components/ProjectsSection';
import AchievementsSection from '@/components/AchievementsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

import { usePortfolioData } from '@/lib/usePortfolioData';
import { useSiteSettings } from '@/lib/useSiteSettings';

function setMeta(
  attr: 'name' | 'property',
  key: string,
  content: string
) {
  let element = document.querySelector(
    `meta[${attr}="${key}"]`
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(url: string) {
  let canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

function setFavicon(url: string) {
  const existingIcons = document.querySelectorAll(
    'link[rel="icon"]'
  );

  existingIcons.forEach((icon) => {
    icon.remove();
  });

  const favicon = document.createElement('link');

  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = url;

  document.head.appendChild(favicon);
}

function getAbsoluteUrl(
  value: string | null | undefined
): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(
      value,
      window.location.origin
    ).href;
  } catch {
    return null;
  }
}

function removeEmptyProperties(
  object: Record<string, unknown>
) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ''
    )
  );
}

export default function Portfolio() {
  const {
    data,
    loading,
    error,
  } = usePortfolioData();

  const {
    settings,
    loading: settingsLoading,
  } = useSiteSettings();

  const profile = data.profile;

  const name =
    profile?.full_name?.trim() ||
    'GNM Nursing Portfolio';

  useEffect(() => {
    const title =
      settings.site_title.trim() ||
      (profile?.full_name?.trim()
        ? `${profile.full_name.trim()} | GNM Nursing Portfolio`
        : 'GNM Nursing Portfolio');

    const description =
      profile?.bio?.trim() ||
      'GNM Nursing portfolio showcasing clinical training, education, skills, certifications, and patient-centered care.';

    /*
     * Keep the profile hero image for SEO/social sharing.
     */
    const imageUrl =
      getAbsoluteUrl(profile?.hero_image) ??
      `${window.location.origin}/images/image.png`;

    /*
     * Use the admin-controlled favicon.
     */
    const faviconUrl =
      getAbsoluteUrl(settings.favicon_url) ??
      `${window.location.origin}/images/image.png`;

    /*
     * The canonical URL represents the actual
     * portfolio origin without query parameters or hashes.
     */
    const canonicalUrl =
      window.location.origin + '/';

    /*
     * Browser title.
     */
    document.title = title;

    /*
     * Browser favicon.
     */
    setFavicon(faviconUrl);

    /*
     * Standard metadata.
     */
    setMeta(
      'name',
      'description',
      description
    );

    setMeta(
      'name',
      'author',
      name
    );

    /*
     * Open Graph metadata.
     */
    setMeta(
      'property',
      'og:title',
      title
    );

    setMeta(
      'property',
      'og:description',
      description
    );

    setMeta(
      'property',
      'og:image',
      imageUrl
    );

    setMeta(
      'property',
      'og:url',
      canonicalUrl
    );

    setMeta(
      'property',
      'og:type',
      'profile'
    );

    /*
     * Twitter metadata.
     */
    setMeta(
      'name',
      'twitter:title',
      title
    );

    setMeta(
      'name',
      'twitter:description',
      description
    );

    setMeta(
      'name',
      'twitter:image',
      imageUrl
    );

    /*
     * Canonical URL.
     */
    setCanonical(canonicalUrl);

    /*
     * Structured data for search engines.
     */
    let jsonLd = document.getElementById(
      'person-jsonld'
    ) as HTMLScriptElement | null;

    if (!jsonLd) {
      jsonLd = document.createElement(
        'script'
      );

      jsonLd.id = 'person-jsonld';
      jsonLd.type = 'application/ld+json';

      document.head.appendChild(jsonLd);
    }

    const structuredData =
      removeEmptyProperties({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name:
          profile?.full_name?.trim() ||
          undefined,
        jobTitle:
          'GNM Nursing Professional',
        description:
          profile?.bio?.trim() ||
          undefined,
        image: imageUrl,
        email: profile?.email
          ? `mailto:${profile.email.trim()}`
          : undefined,
        telephone:
          profile?.phone?.trim() ||
          undefined,
        url: canonicalUrl,
        address:
          profile?.location?.trim()
            ? {
                '@type':
                  'PostalAddress',
                addressLocality:
                  profile.location.trim(),
                addressCountry: 'IN',
              }
            : undefined,
        sameAs: [
          profile?.linkedin_url?.trim() || undefined,
          'https://www.instagram.com/debarati_311/',
          'https://www.facebook.com/rajashree.ghosh.33633',
          'https://www.facebook.com/profile.php?id=100087452551747',
        ].filter(Boolean),
      });

    jsonLd.textContent =
      JSON.stringify(structuredData);

    return () => {
      /*
       * Keep metadata during client-side navigation.
       */
    };
  }, [
    profile,
    name,
    settings.site_title,
    settings.favicon_url,
    settingsLoading,
  ]);

  if (loading || settingsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div
          className="flex flex-col items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-teal-600"
            aria-hidden="true"
          />

          <p className="text-sm text-ink-500">
            Loading portfolio…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
        <div
          className="max-w-md text-center"
          role="alert"
        >
          <p className="font-display text-2xl font-semibold text-ink-900">
            Something went wrong
          </p>

          <p className="mt-2 text-sm text-ink-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar name={name} />

      <main>
        <Hero profile={profile} />

        <section
          id="about"
          className="section-padding bg-ink-50"
          aria-labelledby="about-heading"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p
              id="about-heading"
              className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600"
            >
              Career objective
            </p>

            <p className="mt-5 font-display text-3xl font-semibold leading-snug text-ink-900 md:text-4xl">
              {profile?.bio?.trim() ||
                'Compassionate nursing professional dedicated to evidence-based, patient-centered care.'}
            </p>

            <p className="mt-6 text-sm font-medium uppercase tracking-widest text-ink-500">
              Open to Staff Nurse opportunities
            </p>
          </div>
        </section>

        <EducationSection
          items={data.education}
        />

        <ClinicalSection
          items={data.clinical}
        />

        <SkillsSection
          items={data.skills}
        />

        <CertificationsSection
          items={data.certifications}
        />

        <ProjectsSection
          items={data.projects}
        />

        <AchievementsSection
          items={data.achievements}
        />

        <ContactSection
          profile={profile}
        />
      </main>

      <Footer profile={profile} />
    </div>
  );
}