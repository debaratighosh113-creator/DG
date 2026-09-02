import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Send,
  CheckCircle2,
} from 'lucide-react';
import type { Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { SectionHeading } from '@/components/SectionHeading';

type FormState = {
  name: string;
  email: string;
  message: string;
  website: string; // honeypot
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

const NAME_MIN = 2;
const NAME_MAX = 80;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

export default function ContactSection({
  profile,
}: {
  profile: Profile | null;
}) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (
    key: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (status === 'sent' || status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const validate = (): string | null => {
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < NAME_MIN) {
      return `Name must be at least ${NAME_MIN} characters.`;
    }

    if (name.length > NAME_MAX) {
      return `Name must not exceed ${NAME_MAX} characters.`;
    }

    if (!email) {
      return 'Email address is required.';
    }

    if (email.length > 254) {
      return 'Email address is too long.';
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (message.length < MESSAGE_MIN) {
      return `Message must be at least ${MESSAGE_MIN} characters.`;
    }

    if (message.length > MESSAGE_MAX) {
      return `Message must not exceed ${MESSAGE_MAX} characters.`;
    }

    return null;
  };

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (status === 'sending') return;

    // Honeypot: real users never see/fill this field.
    if (form.website.trim()) {
      setStatus('sent');
      setForm({
        name: '',
        email: '',
        message: '',
        website: '',
      });
      return;
    }

    const validationError = validate();

    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    const { error } = await supabase.rpc(
  'submit_contact_message',
  {
    p_name: form.name.trim(),
    p_email: form.email.trim().toLowerCase(),
    p_message: form.message.trim(),
  }
);

    if (error) {
      setStatus('error');
      setErrorMessage(
        'Unable to send your message. Please try again later.'
      );
      return;
    }

    setStatus('sent');

    setForm({
      name: '',
      email: '',
      message: '',
      website: '',
    });
  };

  return (
    <section
      id="contact"
      className="section-padding bg-white"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          icon={<Mail className="h-5 w-5" />}
          title="Contact"
          subtitle="Let's connect — whether for opportunities, mentorship, or collaboration."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {profile?.email && (
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
            )}

            {profile?.phone && (
              <ContactRow
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone}`}
              />
            )}

            {profile?.location && (
              <ContactRow
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={profile.location}
              />
            )}

            {profile?.linkedin_url && (
              <ContactRow
                icon={<Linkedin className="h-5 w-5" />}
                label="LinkedIn"
                value={profile.linkedin_url}
                href={profile.linkedin_url}
              />
            )}

            {profile?.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-2"
              >
                Download CV
              </a>
            )}
          </div>

          <form
            onSubmit={submit}
            className="card space-y-4 p-6"
            noValidate
          >
            {/* Honeypot field for simple bots */}
            <div
              className="absolute -left-[9999px]"
              aria-hidden="true"
            >
              <label htmlFor="website">
                Website
              </label>

              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) =>
                  updateField(
                    'website',
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Name
              </label>

              <input
                id="contact-name"
                name="name"
                type="text"
                className="input-field"
                value={form.name}
                onChange={(e) =>
                  updateField(
                    'name',
                    e.target.value
                  )
                }
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                autoComplete="name"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Email
              </label>

              <input
                id="contact-email"
                name="email"
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    'email',
                    e.target.value
                  )
                }
                maxLength={254}
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Message
              </label>

              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="input-field resize-none"
                value={form.message}
                onChange={(e) =>
                  updateField(
                    'message',
                    e.target.value
                  )
                }
                minLength={MESSAGE_MIN}
                maxLength={MESSAGE_MAX}
                required
                aria-required="true"
              />

              <p className="mt-1 text-right text-xs text-ink-400">
                {form.message.length}/{MESSAGE_MAX}
              </p>
            </div>

            {status === 'sent' && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Thank you! Your message has been sent.
              </div>
            )}

            {status === 'error' && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {errorMessage ||
                  'Something went wrong. Please try again.'}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full"
            >
              <Send className="h-4 w-4" />

              {status === 'sending'
                ? 'Sending…'
                : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="card flex items-center gap-4 p-4 transition-all hover:shadow-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
          {label}
        </p>

        <p className="break-words text-sm font-semibold text-ink-800">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) return content;

  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      {...(isExternal
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
      className="block"
    >
      {content}
    </a>
  );
}