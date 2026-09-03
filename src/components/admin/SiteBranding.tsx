import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FileUpload from '@/components/admin/FileUpload';

type SiteSettings = {
  id: number;
  site_title: string;
  logo_url: string | null;
  favicon_url: string | null;
};

const DEFAULT_TITLE = 'Debarati Ghosh | GNM Nurse Portfolio';

export default function SiteBranding() {
  const [siteTitle, setSiteTitle] = useState(DEFAULT_TITLE);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      setLoading(true);
      setError(null);

      const { data, error: loadError } = await supabase
        .from('site_settings')
        .select('id, site_title, logo_url, favicon_url')
        .eq('id', 1)
        .maybeSingle();

      if (!mounted) return;

      if (loadError) {
        setError(loadError.message);
        setLoading(false);
        return;
      }

      const settings = data as SiteSettings | null;

      if (settings) {
        setSiteTitle(settings.site_title || DEFAULT_TITLE);
        setLogoUrl(settings.logo_url);
        setFaviconUrl(settings.favicon_url);
      }

      setLoading(false);
    };

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const saveSettings = async () => {
    setSaved(false);
    setError(null);

    const title = siteTitle.trim();

    if (title.length < 3) {
      setError('Site title must be at least 3 characters.');
      return;
    }

    if (title.length > 120) {
      setError('Site title must not exceed 120 characters.');
      return;
    }

    setSaving(true);

    try {
      const { error: saveError } = await supabase
        .from('site_settings')
        .upsert(
          {
            id: 1,
            site_title: title,
            logo_url: logoUrl,
            favicon_url: faviconUrl,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (saveError) {
        throw new Error(saveError.message);
      }

      setSiteTitle(title);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save branding settings.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2
          className="h-6 w-6 animate-spin text-teal-600"
          aria-label="Loading branding settings"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-ink-100 bg-ink-50 p-5">
        <p className="text-sm font-medium text-ink-700">
          Manage your website identity from here.
        </p>

        <p className="mt-1 text-sm text-ink-500">
          Changes will control the navbar logo, browser tab icon, and
          website title.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="site-title"
          className="block text-sm font-semibold text-ink-800"
        >
          Website Title
        </label>

        <input
          id="site-title"
          type="text"
          value={siteTitle}
          onChange={(event) => {
            setSiteTitle(event.target.value);
            setSaved(false);
          }}
          maxLength={120}
          placeholder={DEFAULT_TITLE}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        <p className="text-xs text-ink-400">
          This appears in the browser tab and search/social metadata.
        </p>
      </div>

      <div className="rounded-2xl border border-ink-100 p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          Navbar Logo
        </h3>

        <p className="mt-1 text-sm text-ink-500">
          This image appears in the top-left corner of your portfolio.
        </p>

        {logoUrl && (
          <div className="mt-5 flex items-center gap-4 rounded-xl bg-ink-50 p-4">
            <img
              src={logoUrl}
              alt="Current navbar logo"
              className="h-16 w-16 rounded-xl object-cover object-[50%_15%]"
            />

            <div>
              <p className="text-sm font-semibold text-ink-800">
                Current logo
              </p>

              <p className="mt-1 break-all text-xs text-ink-400">
                {logoUrl}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5">
          <FileUpload
            value={logoUrl}
            onChange={(url) => {
              setLogoUrl(url);
              setSaved(false);
            }}
            folder="branding/logo"
            label="Upload navbar logo"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMb={5}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 p-5">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          Browser Tab Photo
        </h3>

        <p className="mt-1 text-sm text-ink-500">
          This image appears beside the website title in the browser tab.
        </p>

        {faviconUrl && (
          <div className="mt-5 flex items-center gap-4 rounded-xl bg-ink-50 p-4">
            <img
              src={faviconUrl}
              alt="Current browser tab icon"
              className="h-16 w-16 rounded-xl object-cover object-[50%_15%]"
            />

            <div>
              <p className="text-sm font-semibold text-ink-800">
                Current favicon
              </p>

              <p className="mt-1 break-all text-xs text-ink-400">
                {faviconUrl}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5">
          <FileUpload
            value={faviconUrl}
            onChange={(url) => {
              setFaviconUrl(url);
              setSaved(false);
            }}
            folder="branding/favicon"
            label="Upload browser tab photo"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMb={5}
          />
        </div>

        <p className="mt-3 text-xs text-ink-400">
          For the best browser-tab result, use a square image with the
          face and upper body clearly visible.
        </p>
      </div>

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

      {saved && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
        >
          <CheckCircle2
            className="h-4 w-4"
            aria-hidden="true"
          />

          Branding settings saved successfully.
        </div>
      )}

      <button
        type="button"
        onClick={() => void saveSettings()}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
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

        {saving ? 'Saving…' : 'Save Branding'}
      </button>
    </div>
  );
}