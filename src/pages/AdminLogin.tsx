import { useState } from 'react';
import { Lock, ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminLogin() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-md">
        <a
          href="#top"
          className="mb-6 inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </a>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Heart className="h-6 w-6" fill="white" />
            </span>

            <div>
              <h1 className="font-display text-xl font-semibold text-white">
                Admin Panel
              </h1>

              <p className="text-sm text-ink-400">
                Sign in to manage your portfolio
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-medium text-ink-300"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-ink-700 bg-ink-800 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-ink-300"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                minLength={6}
                required
                className="w-full rounded-xl border border-ink-700 bg-ink-800 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              {loading ? 'Please wait…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-500">
            Authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}