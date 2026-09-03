import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type SiteSettings = {
  id: number;
  site_title: string;
  logo_url: string | null;
  favicon_url: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  site_title: 'Debarati Ghosh | GNM Nurse Portfolio',
  logo_url: '/images/image.png',
  favicon_url: '/images/image.png',
};

export function useSiteSettings() {
  const [settings, setSettings] =
    useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, site_title, logo_url, favicon_url')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Failed to load site settings:', error);
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        id: data.id,
        site_title:
          data.site_title || DEFAULT_SETTINGS.site_title,
        logo_url: data.logo_url || DEFAULT_SETTINGS.logo_url,
        favicon_url:
          data.favicon_url || DEFAULT_SETTINGS.favicon_url,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    reload: loadSettings,
  };
}