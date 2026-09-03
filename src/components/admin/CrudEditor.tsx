import { useState, type ReactNode } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import FileUpload from '@/components/admin/FileUpload';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

type CrudEditorProps = {
  table: string;
  label: string;
  fields: FieldDef[];
  items: Record<string, unknown>[];
  onReload: () => void;
  emptyItem: () => Record<string, unknown>;
};

export default function CrudEditor({
  table,
  label,
  fields,
  items,
  onReload,
  emptyItem,
}: CrudEditorProps) {
  const [editing, setEditing] = useState<Record<string, unknown> | null>(
    null
  );
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setEditing(emptyItem());
    setIsNew(true);
    setError(null);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditing({ ...item });
    setIsNew(false);
    setError(null);
  };

  const close = () => {
    if (saving) return;

    setEditing(null);
    setError(null);
  };

  const validate = (): string | null => {
    if (!editing) {
      return 'No item selected.';
    }

    for (const field of fields) {
      const value = editing[field.key];

      const empty =
        value === undefined ||
        value === null ||
        String(value).trim() === '';

      if (field.required && empty) {
        return `${field.label} is required.`;
      }

      if (empty) continue;

      if (field.type === 'number') {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return `${field.label} must be a valid number.`;
  }

  if (!Number.isInteger(numberValue)) {
    return `${field.label} must be a whole number.`;
  }

  if (numberValue < 0) {
    return `${field.label} must be 0 or greater.`;
  }

  if (
    field.min !== undefined &&
    numberValue < field.min
  ) {
    return `${field.label} must be at least ${field.min}.`;
  }

  if (
    field.max !== undefined &&
    numberValue > field.max
  ) {
    return `${field.label} must not exceed ${field.max}.`;
  }
}

      if (field.type === 'select' && field.options) {
        if (!field.options.includes(String(value))) {
          return `${field.label} has an invalid value.`;
        }
      }
    }

    return null;
  };

  const buildPayload = (): Record<string, unknown> => {
    if (!editing) return {};

    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      const value = editing[field.key];

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
      ) {
        payload[field.key] = null;
        continue;
      }

      if (field.type === 'number') {
        payload[field.key] = Number(value);
      } else if (typeof value === 'string') {
        payload[field.key] = value.trim();
      } else {
        payload[field.key] = value;
      }
    }

    return payload;
  };

  const save = async () => {
    if (!editing || saving) return;

    setError(null);

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload();

      const result = isNew
        ? await supabase.from(table).insert(payload)
        : await supabase
            .from(table)
            .update(payload)
            .eq('id', editing.id);

      if (result.error) {
        throw new Error(result.error.message);
      }

      setEditing(null);
      setError(null);

      onReload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save this item. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (deletingId || movingId || saving) return;

    const confirmed = window.confirm(
      'Delete this item? This cannot be undone.'
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      onReload();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Unable to delete this item. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Reorders two adjacent records through a single PostgreSQL RPC.
   *
   * Both sort-order changes happen inside one database transaction.
   */
  const move = async (
    item: Record<string, unknown>,
    direction: -1 | 1
  ) => {
    if (movingId || deletingId || saving) return;

    const index = items.findIndex(
      (current) => current.id === item.id
    );

    if (index < 0) return;

    const swap = items[index + direction];

    if (!swap) return;

    const itemId = String(item.id);
    const swapId = String(swap.id);

    const itemOrder = Number(item.sort_order);
    const swapOrder = Number(swap.sort_order);

    if (
      !Number.isInteger(itemOrder) ||
      !Number.isInteger(swapOrder) ||
      itemOrder < 0 ||
      swapOrder < 0
    ) {
      window.alert(
        'Unable to reorder because the sort order is invalid.'
      );
      return;
    }

    setMovingId(itemId);
    setError(null);

    try {
      const { error: reorderError } = await supabase.rpc(
        'reorder_portfolio_items',
        {
          p_table_name: table,
          p_first_id: itemId,
          p_second_id: swapId,
          p_first_order: itemOrder,
          p_second_order: swapOrder,
        }
      );

      if (reorderError) {
        throw new Error(reorderError.message);
      }

      onReload();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Unable to reorder this item. Please try again.'
      );

      onReload();
    } finally {
      setMovingId(null);
    }
  };

  const setField = (key: string, value: unknown) => {
    setEditing((previous) =>
      previous
        ? {
            ...previous,
            [key]: value,
          }
        : previous
    );

    setError(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          {label}{' '}
          <span className="text-sm font-normal text-ink-400">
            ({items.length})
          </span>
        </h3>

        <button
          type="button"
          onClick={openNew}
          disabled={
            Boolean(editing) ||
            Boolean(movingId) ||
            Boolean(deletingId)
          }
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Add ${label}`}
        >
          <Plus
            className="h-4 w-4"
            aria-hidden="true"
          />
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-400">
          No entries yet. Click &quot;Add&quot; to create one.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const id = String(item.id);

            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4"
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(item, -1)}
                    disabled={
                      index === 0 ||
                      Boolean(movingId) ||
                      Boolean(deletingId) ||
                      Boolean(editing)
                    }
                    className="rounded p-1 text-ink-300 hover:bg-ink-50 hover:text-ink-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move ${itemLabel(
                      label,
                      item
                    )} up`}
                  >
                    <ArrowUp
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => move(item, 1)}
                    disabled={
                      index === items.length - 1 ||
                      Boolean(movingId) ||
                      Boolean(deletingId) ||
                      Boolean(editing)
                    }
                    className="rounded p-1 text-ink-300 hover:bg-ink-50 hover:text-ink-600 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move ${itemLabel(
                      label,
                      item
                    )} down`}
                  >
                    <ArrowDown
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-900">
                    {itemLabel(label, item)}
                  </p>

                  <p className="truncate text-xs text-ink-400">
                    {itemSublabel(label, item)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  disabled={
                    Boolean(editing) ||
                    Boolean(movingId) ||
                    Boolean(deletingId)
                  }
                  className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Edit ${itemLabel(
                    label,
                    item
                  )}`}
                >
                  <Pencil
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => remove(id)}
                  disabled={
                    Boolean(editing) ||
                    Boolean(movingId) ||
                    Boolean(deletingId)
                  }
                  className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Delete ${itemLabel(
                    label,
                    item
                  )}`}
                >
                  <Trash2
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <Modal
          onClose={close}
          title={isNew ? `Add ${label}` : `Edit ${label}`}
        >
          <div className="space-y-4">
            {fields.map((field) => {
              const value = editing[field.key];
              const fieldId = `crud-${table}-${field.key}`;

              return (
                <div key={field.key}>
                  <label
                    htmlFor={
                      field.type === 'file'
                        ? undefined
                        : fieldId
                    }
                    className="mb-1.5 block text-sm font-medium text-ink-700"
                  >
                    {field.label}

                    {field.required && (
                      <span
                        className="text-red-500"
                        aria-hidden="true"
                      >
                        {' '}
                        *
                      </span>
                    )}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      id={fieldId}
                      rows={4}
                      className="input-field resize-none"
                      value={String(value ?? '')}
                      onChange={(event) =>
                        setField(
                          field.key,
                          event.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      aria-required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={fieldId}
                      className="input-field"
                      value={String(value ?? '')}
                      onChange={(event) =>
                        setField(
                          field.key,
                          event.target.value
                        )
                      }
                      required={field.required}
                      aria-required={field.required}
                    >
                      <option value="">
                        Select…
                      </option>

                      {field.options?.map((option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'file' ? (
                    <FileUpload
                      value={String(value ?? '')}
                      onChange={(url) =>
                        setField(field.key, url)
                      }
                      folder={getUploadFolder(table)}
                      label={`Upload ${field.label}`}
                      accept={getUploadAccept(
                        table,
                        field.key
                      )}
                      maxSizeMb={10}
                    />
                  ) : (
                    <input
                      id={fieldId}
                      type={
                        field.type === 'number'
                          ? 'number'
                          : 'text'
                      }
                      className="input-field"
                      value={String(value ?? '')}
                      onChange={(event) =>
                        setField(
                          field.key,
                          event.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                      aria-required={field.required}
                      min={
                        field.type === 'number'
                          ? field.min
                          : undefined
                      }
                      max={
                        field.type === 'number'
                          ? field.max
                          : undefined
                      }
                      step={
                        field.type === 'number'
                          ? '1'
                          : undefined
                      }
                    />
                  )}
                </div>
              );
            })}

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={close}
                disabled={saving}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function getUploadFolder(table: string): string {
  switch (table) {
    case 'certifications':
      return 'certificates';

    case 'education':
      return 'marksheets';

    case 'projects':
      return 'projects';

    default:
      return 'documents';
  }
}

function getUploadAccept(
  table: string,
  fieldKey: string
): string {
  if (
    table === 'projects' ||
    fieldKey === 'image' ||
    fieldKey === 'hero_image'
  ) {
    return 'image/jpeg,image/png,image/webp';
  }

  return 'application/pdf';
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900">
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close dialog"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function itemLabel(
  label: string,
  item: Record<string, unknown>
): string {
  if (label === 'Education') {
    return String(item.degree ?? '');
  }

  if (label === 'Clinical Experience') {
    return String(item.facility ?? '');
  }

  if (label === 'Skills') {
    return String(item.name ?? '');
  }

  if (label === 'Certifications') {
    return String(item.name ?? '');
  }

  if (label === 'Projects') {
    return String(item.title ?? '');
  }

  if (label === 'Achievements') {
    return String(item.title ?? '');
  }

  return String(Object.values(item)[1] ?? '');
}

function itemSublabel(
  label: string,
  item: Record<string, unknown>
): string {
  if (label === 'Education') {
    return String(item.school ?? '');
  }

  if (label === 'Clinical Experience') {
    const unit = String(item.unit ?? '');
    const hours = Number(item.hours);

    if (unit && Number.isFinite(hours) && hours > 0) {
      return `${unit} · ${hours} hrs`;
    }

    if (unit) {
      return unit;
    }

    if (Number.isFinite(hours) && hours > 0) {
      return `${hours} hrs`;
    }

    return '';
  }

  if (label === 'Skills') {
    const category = String(item.category ?? '');
    const proficiency = String(item.proficiency ?? '');

    return [category, proficiency]
      .filter(Boolean)
      .join(' · ');
  }

  if (label === 'Certifications') {
    return String(item.issuer ?? '');
  }

  if (label === 'Projects') {
    return String(item.description ?? '').slice(0, 80);
  }

  if (label === 'Achievements') {
    return String(item.date ?? '');
  }

  return '';
}