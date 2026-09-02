import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        setSession(null);
      } else {
        setSession(data.session);
      }

      setLoading(false);
    };

    void loadSession();

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) {
          return;
        }

        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string
  ) => {
    const {
      error,
    } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return {
      error: error?.message ?? null,
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /*
   * Authorization is based on Supabase app_metadata.
   *
   * Do NOT use user-editable metadata for admin access.
   */
  const isAdmin =
    session?.user?.app_metadata?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
 * This hook intentionally lives in the same module as the
 * context provider. The ESLint rule cannot determine that
 * this non-component export is a stable React hook, so the
 * warning is disabled specifically for this export.
 */
/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}