import { useRef, useState } from 'react';
import { FileUp, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type FileUploadProps = {
  value: string | null | undefined;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  accept?: string;
  maxSizeMb?: number;
};

export default function FileUpload({
  value,
  onChange,
  folder,
  label = 'Upload file',
  accept = 'image/*,.pdf',
  maxSizeMb = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (file: File) => {
    setError(null);
    setSuccess(false);

    if (!file) return;

    const maxSize = maxSizeMb * 1024 * 1024;

    if (file.size > maxSize) {
      setError(`File size must not exceed ${maxSizeMb} MB.`);
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, PNG, and WebP files are allowed.');
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error('You must be logged in as an admin to upload files.');
      }

      const extension =
        file.name.split('.').pop()?.toLowerCase() || 'file';

      const safeFolder = folder
        .trim()
        .replace(/[^a-zA-Z0-9/_-]/g, '');

      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${safeFolder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('portfolio-files')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Unable to generate the uploaded file URL.');
      }

      onChange(publicUrl);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to upload the file. Please try again.'
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={uploading}
          className="sr-only"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={label}
        >
          {uploading ? (
            <Loader2
              className="h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <FileUp
              className="h-4 w-4"
              aria-hidden="true"
            />
          )}

          {uploading ? 'Uploading…' : label}
        </button>

        {success && !uploading && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
            <CheckCircle2
              className="h-4 w-4"
              aria-hidden="true"
            />
            Uploaded
          </span>
        )}
      </div>

      {value && (
        <p className="break-all text-xs text-ink-400">
          Current file:{' '}
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-teal-600 underline underline-offset-2 hover:text-teal-700"
          >
            View file
          </a>
        </p>
      )}

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

      <p className="text-xs text-ink-400">
        PDF, JPG, PNG, or WebP · Maximum {maxSizeMb} MB
      </p>
    </div>
  );
}