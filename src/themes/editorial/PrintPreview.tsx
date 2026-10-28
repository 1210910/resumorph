import {ArrowDownTrayIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';

/**
 * The Editorial theme's print preview: the page loaded in a frame as wide as an A4 page
 * between its 12mm margins (so the layout matches the printout), drawn on paper with a
 * dashed line wherever the printer will start a new page.
 */

const smallCaps = 'text-[11px] font-semibold uppercase tracking-[0.2em]';

interface PrintPreviewProps {
  onClose: () => void;
  onPrint: () => void;
}

const PrintPreview: FC<PrintPreviewProps> = memo(({onClose, onPrint}) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(0);

  // the frame grows to its content; re-measure when fonts or images settle
  const measure = useCallback(() => {
    const doc = frame.current?.contentDocument;
    if (doc) setHeight(doc.documentElement.scrollHeight);
  }, []);

  useEffect(() => {
    const {style} = document.documentElement;
    style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const timer = window.setInterval(measure, 500);
    return () => {
      style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.clearInterval(timer);
    };
  }, [measure, onClose]);

  return (
    <div
      aria-label="Print preview"
      aria-modal="true"
      className="no-print fixed inset-0 z-50 overflow-y-auto bg-[#d8d4cb]"
      role="dialog">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[#141413] px-4 py-3 text-[#faf8f3] sm:px-6">
        <p className={smallCaps}>
          Print preview · A4 <span className="hidden opacity-70 sm:inline">· dashed lines mark the page breaks</span>
        </p>
        <div className="flex gap-2">
          <button
            className={`${smallCaps} inline-flex items-center gap-2 bg-[#faf8f3] px-3 py-2 text-[#141413]`}
            onClick={onPrint}
            type="button">
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            Save as PDF
          </button>
          <button
            autoFocus
            className={`${smallCaps} inline-flex items-center gap-2 border border-[#faf8f3]/50 px-3 py-2`}
            onClick={onClose}
            type="button">
            <XMarkIcon className="h-3.5 w-3.5" />
            Close
          </button>
        </div>
      </div>

      <div className="relative mx-auto my-10 w-[210mm] bg-white p-[12mm] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]">
        <iframe
          className="block w-full"
          onLoad={measure}
          ref={frame}
          src={`${window.location.pathname}?print-preview`}
          style={{height: height || '273mm'}}
          tabIndex={-1}
          title="Print preview of this page"
        />
        {/* a dashed rule every 273mm (297mm minus the top and bottom margins) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12mm]"
          style={{
            background:
              'repeating-linear-gradient(to bottom, transparent 0 calc(273mm - 1px), rgb(155 28 28 / 0.6) calc(273mm - 1px) 273mm)',
            maskImage: 'repeating-linear-gradient(to right, #000 0 6px, transparent 6px 10px)',
            WebkitMaskImage: 'repeating-linear-gradient(to right, #000 0 6px, transparent 6px 10px)',
          }}
        />
      </div>
    </div>
  );
});

PrintPreview.displayName = 'PrintPreview';
export default PrintPreview;
