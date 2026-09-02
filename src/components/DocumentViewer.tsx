import {
  X,
  Download,
  FileText,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export type DocType = 'pdf' | 'image';

type DocumentViewerProps = {
  url: string;
  title: string;
  onClose: () => void;
};

export default function DocumentViewer({
  url,
  title,
  onClose,
}: DocumentViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  /*
   * Detect PDF from the URL pathname instead of checking
   * whether the complete URL ends with ".pdf".
   *
   * This correctly handles:
   *   file.pdf
   *   file.pdf?download=1
   *   file.pdf#page=2
   */
  const isPdf = isPdfUrl(url);

  useEffect(() => {
    setLoaded(false);
    setLoadError(false);
  }, [url]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose]);

  const handleLoad = () => {
    setLoaded(true);
    setLoadError(false);
  };

  const handleError = () => {
    setLoaded(true);
    setLoadError(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-viewer-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-ink-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600"
              aria-hidden="true"
            >
              {isPdf ? (
                <FileText className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </span>

            <div className="min-w-0">
              <h3
                id="document-viewer-title"
                className="truncate font-display text-base font-semibold text-ink-900"
              >
                {title}
              </h3>

              <p className="text-xs text-ink-400">
                {isPdf
                  ? 'PDF document'
                  : 'Image'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
              aria-label={`Download ${title}`}
            >
              <Download
                className="h-4 w-4"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                Download
              </span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              aria-label="Close document viewer"
            >
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-auto bg-ink-50">
          {!loaded && !loadError && (
            <div
              className="absolute inset-0 z-10 flex min-h-64 items-center justify-center bg-ink-50"
              aria-label="Loading document"
              role="status"
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-teal-600"
                  aria-hidden="true"
                />

                <span className="text-sm text-ink-400">
                  Loading document…
                </span>
              </div>
            </div>
          )}

          {loadError ? (
            <div className="flex min-h-64 items-center justify-center px-6 py-12">
              <div className="max-w-md text-center">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500"
                  aria-hidden="true"
                >
                  <AlertCircle className="h-6 w-6" />
                </div>

                <h4 className="mt-4 font-display text-lg font-semibold text-ink-900">
                  Unable to display document
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  The document could not be loaded.
                  You can try opening or downloading
                  it directly.
                </p>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  Open document
                </a>
              </div>
            </div>
          ) : isPdf ? (
            <iframe
              src={url}
              title={title}
              className={`h-[75vh] min-h-[400px] w-full border-0 ${
                loaded ? 'block' : 'invisible'
              }`}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : (
            <div
              className={`flex min-h-[400px] justify-center p-6 ${
                loaded ? 'visible' : 'invisible'
              }`}
            >
              <img
                src={url}
                alt={title}
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-lg"
                onLoad={handleLoad}
                onError={handleError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Determines whether a URL points to a PDF.
 *
 * URL pathname is used so query parameters and hashes
 * don't break PDF detection.
 */
function isPdfUrl(value: string): boolean {
  try {
    const parsed = new URL(
      value,
      window.location.href
    );

    return parsed.pathname
      .toLowerCase()
      .endsWith('.pdf');
  } catch {
    /*
     * Fallback for malformed/relative URLs.
     */
    return value
      .split(/[?#]/)[0]
      .toLowerCase()
      .endsWith('.pdf');
  }
}