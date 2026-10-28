import classNames from 'classnames';
import {FC, memo, useEffect, useLayoutEffect, useRef, useState} from 'react';

/**
 * The Editorial theme's reading aids: a progress bar under the running header, a chapter rail
 * in the left margin that follows the chapter being read, and stats that count up into view.
 */

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True inside the print preview frame, which draws the page exactly as it prints. */
export const isPrintPreview = () => new URLSearchParams(window.location.search).has('print-preview');

/** A hairline that fills as the page is read. Updated outside React so scrolling never re-renders. */
export const ReadingProgress: FC = memo(() => {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const {scrollHeight, clientHeight} = document.documentElement;
      const progress = scrollHeight > clientHeight ? window.scrollY / (scrollHeight - clientHeight) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5">
      <div className="h-full origin-left scale-x-0 bg-ed-accent" ref={bar} />
    </div>
  );
});
ReadingProgress.displayName = 'ReadingProgress';

/** The id of the chapter crossing the upper third of the screen, or undefined above the first one. */
export const useActiveChapter = (ids: string[]): string | undefined => {
  const [active, setActive] = useState<string>();
  const key = ids.join(' ');

  useEffect(() => {
    const sections = key
      .split(' ')
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry =>
          entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id),
        );
        // the last chapter in page order that is in the band wins
        setActive(
          sections
            .map(el => el.id)
            .filter(id => visible.has(id))
            .pop(),
        );
      },
      {rootMargin: '-30% 0px -60% 0px'},
    );
    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
};

interface RailChapter {
  id: string;
  number: string;
  label: string;
}

/** Chapter numbers down the left margin on wide screens; the current one shows its name. */
export const ChapterRail: FC<{chapters: RailChapter[]; active?: string}> = memo(({chapters, active}) => (
  <nav aria-label="Chapters" className="no-print fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 xl:block 2xl:left-8">
    <ol className="space-y-3">
      {chapters.map(chapter => {
        const current = chapter.id === active;
        return (
          <li key={chapter.id}>
            <a
              aria-current={current ? 'location' : undefined}
              className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
              href={`#${chapter.id}`}>
              <span
                className={classNames(
                  'tabular-nums transition-colors',
                  current ? 'text-ed-accent' : 'text-ed-muted/60 group-hover:text-ed-ink',
                )}>
                {chapter.number}
              </span>
              <span
                className={classNames(
                  'h-px bg-current transition-all duration-300',
                  current ? 'w-6 text-ed-accent' : 'w-3 text-ed-muted/40',
                )}
              />
              <span
                className={classNames(
                  'bg-ed-paper pr-1 transition-opacity duration-300',
                  current ? 'text-ed-ink opacity-100' : 'opacity-0 group-hover:opacity-100',
                )}>
                {chapter.label}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  </nav>
));
ChapterRail.displayName = 'ChapterRail';

/** "€84M" → ["€", 84, "M"]; values without a number are left as they are. */
const splitNumber = (value: string) => {
  const match = value.match(/^(.*?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.split(/[.,]/)[1]?.length ?? 0;
  return {
    prefix,
    suffix,
    target: parseFloat(number.replace(',', '.')),
    decimals,
    separator: number.includes(',') ? ',' : '.',
  };
};

const DURATION = 1400;

/**
 * Counts a stat up from zero the first time it scrolls into view. The server renders the final
 * value, so printing, reduced motion and no-JS all show the real number.
 */
export const CountUp: FC<{value: string}> = memo(({value}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const parts = splitNumber(value);
  const [shown, setShown] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!parts || reducedMotion() || isPrintPreview()) return;
    setShown(0);
    let frame = 0;
    let done = false;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          if (done) return;
          setShown(parts.target * (1 - Math.pow(1 - t, 3)));
          if (t < 1) frame = window.requestAnimationFrame(tick);
          else setShown(null);
        };
        frame = window.requestAnimationFrame(tick);
      },
      {threshold: 0.6},
    );
    if (ref.current) observer.observe(ref.current);
    // finish straight away when printing mid-count
    const finish = () => {
      done = true;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      setShown(null);
    };
    window.addEventListener('beforeprint', finish);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener('beforeprint', finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parts || shown === null) return <span ref={ref}>{value}</span>;
  const number = shown.toFixed(parts.decimals).replace('.', parts.separator);
  return (
    <span aria-label={value} ref={ref}>
      {parts.prefix}
      {number}
      {parts.suffix}
    </span>
  );
});
CountUp.displayName = 'CountUp';
