import { useState, useEffect, useCallback } from 'react';
import { LogOut, ExternalLink, LayoutGrid, User, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { usePortfolioData } from '@/lib/usePortfolioData';
import CrudEditor, { type FieldDef } from '@/components/admin/CrudEditor';
import ProfileEditor from '@/components/admin/ProfileEditor';
import MessagesPanel from '@/components/admin/MessagesPanel';
import AdminLogin from '@/pages/AdminLogin';
import {
  educationFields,
  clinicalFields,
  skillsFields,
  certificationsFields,
  projectsFields,
  achievementsFields,
} from '@/components/admin/fieldDefs';
import type { ContactMessage } from '@/lib/types';

type Tab =
  | 'profile'
  | 'education'
  | 'clinical'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'achievements'
  | 'messages';

const tabs: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'education', label: 'Education' },
  { id: 'clinical', label: 'Clinical' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'messages', label: 'Messages' },
];

export default function Admin() {
  const { session, loading, signOut } = useAuth();

  const [tab, setTab] = useState<Tab>('profile');
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const { data, reload } = usePortfolioData({
  realtime: true,
});

  const loadMessages = useCallback(async () => {
    if (!session) {
      setMessages([]);
      return;
    }

    const { data: msgs, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
      return;
    }

    setMessages((msgs ?? []) as ContactMessage[]);
  }, [session]);

  useEffect(() => {
    if (!session) {
      setMessages([]);
      return;
    }

    loadMessages();

    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages',
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, loadMessages]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-teal-600" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <LayoutGrid className="h-5 w-5" />
            </span>

            <div>
              <p className="font-display text-base font-semibold text-ink-900">
                Admin Dashboard
              </p>

              <p className="text-xs text-ink-400">
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </a>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink-100 px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-ink-200"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex gap-2 overflow-x-auto rounded-xl border border-ink-100 bg-white p-2 lg:flex-col">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-teal-600 text-white'
                      : 'text-ink-600 hover:bg-ink-100'
                  }`}
                >
                  <TabIcon id={t.id} />

                  {t.label}

                  {t.id === 'messages' &&
                    messages.some((m) => !m.read) && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white lg:bg-white lg:text-teal-600">
                        {messages.filter((m) => !m.read).length}
                      </span>
                    )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8">
            {tab === 'profile' && (
              <Section
                title="Profile"
                subtitle="Your name, bio, contact info, and hero image shown across the portfolio."
              >
                <ProfileEditor
                  profile={data.profile}
                  onReload={reload}
                />
              </Section>
            )}

            {tab === 'education' && (
              <Section
                title="Education"
                subtitle="Schools and programs you've attended."
              >
                <CrudEditor
                  table="education"
                  label="Education"
                  fields={educationFields}
                  items={
                    data.education as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    degree: '',
                    school: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                    marksheet_url: '',
                    sort_order: data.education.length,
                  })}
                />
              </Section>
            )}

            {tab === 'clinical' && (
              <Section
                title="Clinical Experience"
                subtitle="Rotations and placements with patient care hours."
              >
                <CrudEditor
                  table="clinical_experience"
                  label="Clinical Experience"
                  fields={clinicalFields}
                  items={
                    data.clinical as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    facility: '',
                    unit: '',
                    start_date: '',
                    end_date: '',
                    hours: null,
                    description: '',
                    skills_practiced: '',
                    sort_order: data.clinical.length,
                  })}
                />
              </Section>
            )}

            {tab === 'skills' && (
              <Section
                title="Skills"
                subtitle="Clinical, technical, and communication competencies."
              >
                <CrudEditor
                  table="skills"
                  label="Skills"
                  fields={skillsFields as FieldDef[]}
                  items={
                    data.skills as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    name: '',
                    category: 'Clinical',
                    proficiency: 'Intermediate',
                    sort_order: data.skills.length,
                  })}
                />
              </Section>
            )}

            {tab === 'certifications' && (
              <Section
                title="Certifications"
                subtitle="Licenses and professional credentials."
              >
                <CrudEditor
                  table="certifications"
                  label="Certifications"
                  fields={certificationsFields}
                  items={
                    data.certifications as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    name: '',
                    issuer: '',
                    issue_date: '',
                    expiry_date: '',
                    credential_id: '',
                    document_url: '',
                    sort_order: data.certifications.length,
                  })}
                />
              </Section>
            )}

            {tab === 'projects' && (
              <Section
                title="Projects"
                subtitle="Academic and community health initiatives."
              >
                <CrudEditor
                  table="projects"
                  label="Projects"
                  fields={projectsFields}
                  items={
                    data.projects as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    title: '',
                    description: '',
                    link: '',
                    image: '',
                    sort_order: data.projects.length,
                  })}
                />
              </Section>
            )}

            {tab === 'achievements' && (
              <Section
                title="Achievements"
                subtitle="Awards, honors, and scholarships."
              >
                <CrudEditor
                  table="achievements"
                  label="Achievements"
                  fields={achievementsFields}
                  items={
                    data.achievements as unknown as Record<string, unknown>[]
                  }
                  onReload={reload}
                  emptyItem={() => ({
                    title: '',
                    date: '',
                    description: '',
                    sort_order: data.achievements.length,
                  })}
                />
              </Section>
            )}

            {tab === 'messages' && (
              <Section
                title="Messages"
                subtitle="Submissions from your contact form."
              >
                <MessagesPanel
                  messages={messages}
                  onReload={loadMessages}
                />
              </Section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink-900">
        {title}
      </h2>

      <p className="mb-6 mt-1 text-sm text-ink-500">
        {subtitle}
      </p>

      {children}
    </div>
  );
}

function TabIcon({ id }: { id: Tab }) {
  const cls = 'h-4 w-4';

  switch (id) {
    case 'profile':
      return <User className={cls} />;

    case 'messages':
      return <MessageSquare className={cls} />;

    default:
      return <LayoutGrid className={cls} />;
  }
}