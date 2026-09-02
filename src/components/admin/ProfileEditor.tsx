import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function ProfileEditor({
  profile,
  onReload,
}: {
  profile: Profile | null;
  onReload: () => void;
}) {
  const [form, setForm] = useState<Partial<Profile>>(profile ?? {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(profile ?? {});
    setSaved(false);
    setError(null);
  }, [profile]);

  const set = (key: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    setError(null);

    const payload: Partial<Profile> = {
      full_name: form.full_name ?? '',
      tagline: form.tagline ?? '',
      bio: form.bio ?? '',
      hero_image: form.hero_image || null,
      email: form.email || null,
      phone: form.phone || null,
      location: form.location || null,
      linkedin_url: form.linkedin_url || null,
      resume_url: form.resume_url || null,
      accent_color: form.accent_color ?? 'teal',
    };

    let res;
    if (profile?.id) {
      res = await supabase.from('profile').update(payload).eq('id', profile.id);
    } else {
      res = await supabase.from('profile').insert(payload);
    }

    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    onReload();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <input className="input-field" value={form.full_name ?? ''} onChange={(e) => set('full_name', e.target.value)} />
        </Field>
        <Field label="Tagline">
          <input className="input-field" value={form.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} />
        </Field>
      </div>
      <Field label="Bio">
        <textarea rows={3} className="input-field resize-none" value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Hero image URL">
          <input className="input-field" value={form.hero_image ?? ''} onChange={(e) => set('hero_image', e.target.value)} placeholder="/images/image.png" />
        </Field>
        <Field label="Location">
          <input className="input-field" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input className="input-field" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className="input-field" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="LinkedIn URL">
          <input className="input-field" value={form.linkedin_url ?? ''} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/…" />
        </Field>
        <Field label="CV / Resume URL">
          <input className="input-field" value={form.resume_url ?? ''} onChange={(e) => set('resume_url', e.target.value)} placeholder="/documents/DG_Nurse_CV-1.pdf" />
        </Field>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save profile
        </button>
        {saved && <span className="text-sm font-medium text-teal-600">Saved! Portfolio updated.</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      {children}
    </div>
  );
}
