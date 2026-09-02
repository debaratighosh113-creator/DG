import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';

import type {
  Achievement,
  Certification,
  ClinicalExperience,
  Education,
  Profile,
  Project,
  Skill,
} from '@/lib/types';

export type PortfolioData = {
  profile: Profile | null;
  education: Education[];
  clinical: ClinicalExperience[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  achievements: Achievement[];
};

type UsePortfolioDataOptions = {
  realtime?: boolean;
};

const EMPTY_DATA: PortfolioData = {
  profile: null,
  education: [],
  clinical: [],
  skills: [],
  certifications: [],
  projects: [],
  achievements: [],
};

export function usePortfolioData(
  options: UsePortfolioDataOptions = {}
) {
  const {
    realtime = false,
  } = options;

  const [data, setData] =
    useState<PortfolioData>(EMPTY_DATA);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const requestInProgress =
    useRef(false);

  const reloadTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const load = useCallback(async () => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;

    setError(null);

    try {
      const [
        profileResult,
        educationResult,
        clinicalResult,
        skillsResult,
        certificationsResult,
        projectsResult,
        achievementsResult,
      ] = await Promise.all([
        supabase
          .from('profile')
          .select('*')
          .maybeSingle(),

        supabase
          .from('education')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),

        supabase
          .from('clinical_experience')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),

        supabase
          .from('skills')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),

        supabase
          .from('certifications')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),

        supabase
          .from('projects')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),

        supabase
          .from('achievements')
          .select('*')
          .order('sort_order', {
            ascending: true,
          }),
      ]);

      const errors = [
        profileResult.error,
        educationResult.error,
        clinicalResult.error,
        skillsResult.error,
        certificationsResult.error,
        projectsResult.error,
        achievementsResult.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        throw new Error(
          errors[0]?.message ||
            'Unable to load portfolio data.'
        );
      }

      const nextData: PortfolioData = {
        profile:
          (profileResult.data as Profile | null) ??
          null,

        education:
          (educationResult.data ??
            []) as Education[],

        clinical:
          (clinicalResult.data ??
            []) as ClinicalExperience[],

        skills:
          (skillsResult.data ??
            []) as Skill[],

        certifications:
          (certificationsResult.data ??
            []) as Certification[],

        projects:
          (projectsResult.data ??
            []) as Project[],

        achievements:
          (achievementsResult.data ??
            []) as Achievement[],
      };

      /*
       * Only replace existing data after ALL queries
       * have succeeded.
       *
       * This prevents partially loaded/stale portfolio
       * states from being displayed.
       */
      setData(nextData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load portfolio data.'
      );
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, []);

  const scheduleReload = useCallback(() => {
    if (reloadTimer.current) {
      clearTimeout(reloadTimer.current);
    }

    reloadTimer.current = setTimeout(() => {
      reloadTimer.current = null;

      void load();
    }, 150);
  }, [load]);

  useEffect(() => {
    void load();

    /*
     * Realtime is intentionally disabled for the public
     * portfolio. Admin enables it explicitly.
     */
    if (!realtime) {
      return;
    }

    const channel = supabase
      .channel('admin-portfolio-changes')

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'education',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clinical_experience',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skills',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certifications',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        scheduleReload
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements',
        },
        scheduleReload
      )

      .subscribe();

    return () => {
      if (reloadTimer.current) {
        clearTimeout(reloadTimer.current);
        reloadTimer.current = null;
      }

      void supabase.removeChannel(channel);
    };
  }, [
    load,
    realtime,
    scheduleReload,
  ]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}