import { useState } from 'react';
import {
  Trash2,
  Mail,
  MailOpen,
  Circle,
} from 'lucide-react';

import type { ContactMessage } from '@/lib/types';
import { supabase } from '@/lib/supabase';

type MessagesPanelProps = {
  messages: ContactMessage[];
  onReload: () => void;
};

export default function MessagesPanel({
  messages,
  onReload,
}: MessagesPanelProps) {
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const toggleRead = async (
    message: ContactMessage
  ) => {
    if (updatingId || deletingId) return;

    setError(null);
    setUpdatingId(message.id);

    try {
      const { error: updateError } = await supabase
        .from('contact_messages')
        .update({
          read: !message.read,
        })
        .eq('id', message.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      onReload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update the message.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const remove = async (id: string) => {
    if (updatingId || deletingId) return;

    const confirmed = window.confirm(
      'Delete this message? This cannot be undone.'
    );

    if (!confirmed) return;

    setError(null);
    setDeletingId(id);

    try {
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      onReload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete the message.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const unread = messages.filter(
    (message) => !message.read
  ).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          Messages
        </h3>

        {unread > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            <Circle
              className="h-2 w-2 fill-current"
              aria-hidden="true"
            />
            {unread} new
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-400">
          No messages yet. Submissions from the contact
          form will appear here.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const isUpdating =
              updatingId === message.id;

            const isDeleting =
              deletingId === message.id;

            const isBusy =
              Boolean(updatingId) ||
              Boolean(deletingId);

            return (
              <div
                key={message.id}
                className={`rounded-xl border p-4 transition-colors ${
                  message.read
                    ? 'border-ink-100 bg-white'
                    : 'border-teal-200 bg-teal-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-900">
                        {message.name}
                      </p>

                      {!message.read && (
                        <span className="rounded-full bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          New
                        </span>
                      )}
                    </div>

                    <a
                      href={`mailto:${message.email}`}
                      className="break-all text-sm text-teal-600 hover:underline"
                    >
                      {message.email}
                    </a>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
                      {message.message}
                    </p>

                    <p className="mt-2 text-xs text-ink-400">
                      {formatDate(message.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        toggleRead(message)
                      }
                      disabled={isBusy}
                      className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
                      title={
                        message.read
                          ? 'Mark unread'
                          : 'Mark read'
                      }
                      aria-label={
                        message.read
                          ? `Mark message from ${message.name} as unread`
                          : `Mark message from ${message.name} as read`
                      }
                    >
                      {isUpdating ? (
                        <span
                          className="block h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-transparent"
                          aria-hidden="true"
                        />
                      ) : message.read ? (
                        <MailOpen
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      ) : (
                        <Mail
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        remove(message.id)
                      }
                      disabled={isBusy}
                      className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      title="Delete message"
                      aria-label={`Delete message from ${message.name}`}
                    >
                      {isDeleting ? (
                        <span
                          className="block h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-transparent"
                          aria-hidden="true"
                        />
                      ) : (
                        <Trash2
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleString();
}