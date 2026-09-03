import { useEffect, useState } from 'react';
import {
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import FileUpload from '@/components/admin/FileUpload';

export default function ProfileEditor({
  profile,
  onReload,
}: {
  profile: Profile | null;
  onReload: () => void;
}) {
  const [form, setForm] = useState<Partial<Profile>>(
    profile ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(profile ?? {});
    setSaved(false);
    setError(null);
  }, [profile]);

  const set = (key: keyof Profile, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    const fullName = String(form.full_name ?? '').trim();
    const tagline = String(form.tagline ?? '').trim();
    const bio = String(form.bio ?? '').trim();

    if (!fullName) {
      setError('Full name is required.');
      setSaving(false);
      return;
    }

    if (!tagline) {
      setError('Tagline is required.');
      setSaving(false);
      return;
    }

    if (!bio) {
      setError('Bio is required.');
      setSaving(false);
      return;
    }

    const payload: Partial<Profile> = {
      full_name: fullName,
      tagline,
      bio,
      hero_image: form.hero_image || null,
      email: form.email?.trim() || null,
      phone: form.phone?.trim() || null,
      location: form.location?.trim() || null,
      linkedin_url: form.linkedin_url?.trim() || null,
      resume_url: form.resume_url || null,
      accent_color: form.accent_color ?? 'teal',
    };

    try {
      let res;

      if (profile?.id) {
        res = await supabase
          .from('profile')
          .update(payload)
          .eq('id', profile.id);
      } else {
        res = await supabase
          .from('profile')
          .insert(payload);
      }

      if (res.error) {
        throw new Error(res.error.message);
      }

      setSaved(true);
      onReload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input
            className="input-field"
            value={form.full_name ?? ''}
            onChange={(e) =>
              set('full_name', e.target.value)
            }
            placeholder="Your full name"
          />
        </Field>

        <Field label="Tagline">
          <input
            className="input-field"
            value={form.tagline ?? ''}
            onChange={(e) =>
              set('tagline', e.target.value)
            }
            placeholder="Professional tagline"
          />
        </Field>
      </div>

      <Field label="Bio">
        <textarea
          rows={5}
          className="input-field resize-none"
          value={form.bio ?? ''}
          onChange={(e) =>
            set('bio', e.target.value)
          }
          placeholder="Professional introduction..."
        />
      </Field>

      <Field label="Hero image">
        <div className="space-y-3">
          <FileUpload
            value={form.hero_image}
            onChange={(url) =>
              set('hero_image', url)
            }
            folder="profile"
            label="Upload hero image"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMb={10}
          />

          <input
            className="input-field"
            value={form.hero_image ?? ''}
            onChange={(e) =>
              set('hero_image', e.target.value)
            }
            placeholder="/images/image.png or uploaded URL"
            aria-label="Hero image URL"
          />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location">
          <input
            className="input-field"
            value={form.location ?? ''}
            onChange={(e) =>
              set('location', e.target.value)
            }
            placeholder="City, State, Country"
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            className="input-field"
            value={form.email ?? ''}
            onChange={(e) =>
              set('email', e.target.value)
            }
            placeholder="your@email.com"
          />
        </Field>
      </div>

      <Field label="Phone">
        <input
          type="tel"
          className="input-field"
          value={form.phone ?? ''}
          onChange={(e) =>
            set('phone', e.target.value)
          }
          placeholder="Phone number"
        />
      </Field>

      <Field label="LinkedIn URL">
        <input
          type="url"
          className="input-field"
          value={form.linkedin_url ?? ''}
          onChange={(e) =>
            set('linkedin_url', e.target.value)
          }
          placeholder="https://linkedin.com/in/your-profile"
        />
      </Field>

      <Field label="CV / Resume">
        <div className="space-y-3">
          <FileUpload
            value={form.resume_url}
            onChange={(url) =>
              set('resume_url', url)
            }
            folder="documents"
            label="Upload CV / Resume"
            accept="application/pdf"
            maxSizeMb={10}
          />

          <input
            className="input-field"
            value={form.resume_url ?? ''}
            onChange={(e) =>
              set('resume_url', e.target.value)
            }
            placeholder="/documents/your-cv.pdf or uploaded URL"
            aria-label="CV or resume URL"
          />
        </div>
      </Field>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Save
              className="h-4 w-4"
              aria-hidden="true"
            />
          )}

          {saving ? 'Saving…' : 'Save profile'}
        </button>

        {saved && (
          <span className="text-sm font-medium text-teal-600">
            Saved! Portfolio updated.
          </span>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>

      {children}
    </div>
  );
}