import classNames from 'classnames';
import {CSSProperties, ElementType, ReactNode, useEffect, useRef} from 'react';

/**
 * Cursor spotlight for the "accent word" move — the shared plumbing behind the
 * hero name, the section titles, and the nav brand.
 *
 * A spotlit element renders its base copy plus an aria-hidden lit copy (colors
 * swapped — white ↔ accent) masked to a soft radial blob that tracks the cursor.
 * The lit zone fades in/out via a CSS opacity var, so the color change is partial
 * and cursor-following instead of a binary hover. No React state is touched on
 * pointermove — the position is eased in a rAF loop and written to `--spot-x` /
 * `--spot-y` on the element, and the loop parks itself once settled.
 *
 * On coarse-pointer devices the same move runs for the finger: the blob follows
 * while the finger is down, lingers a beat after release, then fades out — the
 * finger version of the cursor spotlight, so the page answers touch the same way
 * it answers the mouse.
 *
 * Disabled entirely under `prefers-reduced-motion` (or when the device has no
 * relevant pointer): the lit copy simply never turns on (`--spot-o` unset → 0).
 */

export interface SpotlitProps {
  /** element to render as (default: span) */
  as?: ElementType;
  className?: string;
  /** the base (visible) copy */
  children: ReactNode;
  /** the lit copy — same layout as the base, colors swapped (white ↔ accent) */
  lit: ReactNode;
  /** mask radius; a responsive value, e.g. 'clamp(110px, 13vw, 210px)' */
  radius?: string;
  /** grace margin (px) around the element for the fade in/out */
  margin?: number;
  /** glow bloom on the lit copy, as a text-shadow value */
  bloom?: string;
}

const DEFAULT_RADIUS = 'clamp(110px, 13vw, 210px)';
const DEFAULT_BLOOM = '0 0 26px rgba(139, 92, 246, 0.55)';

/** Mask + fade for the lit layer — one soft blob centred on the eased cursor. */
export function spotMaskStyle(radius: string, bloom: string): CSSProperties {
  const mask = `radial-gradient(circle ${radius} at var(--spot-x, 50%) var(--spot-y, 50%), #000 0%, rgba(0, 0, 0, 0.65) 45%, transparent 72%)`;
  return {
    opacity: 'var(--spot-o, 0)',
    transition: 'opacity 0.35s ease',
    textShadow: bloom,
    WebkitMaskImage: mask,
    maskImage: mask,
  };
}

/**
 * The cursor-tracking engine behind <Spotlit>: eases the pointer position into
 * `--spot-x` / `--spot-y` and toggles `--spot-o` (lit-layer opacity) based on
 * proximity. `ref` must point at the masked lit layer itself — the mask's
 * gradient origin is its box, and that box is offset from the base element.
 */
export function useSpotlight(ref: React.RefObject<HTMLElement | null>, margin = 140, lerp = 0.45) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // the spotlight needs a pointer of either kind, and never for reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || (!fine && !coarse)) {
      return;
    }

    let raf = 0;
    let linger = 0; // timeout id: keep the lit copy up briefly after a touch release
    // eased (rendered) position starts centred; tx/ty is where the pointer is
    let x = el.offsetWidth / 2;
    let y = el.offsetHeight / 2;
    let tx = x;
    let ty = y;
    let started = false;

    const tick = () => {
      const dx = tx - x;
      const dy = ty - y;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        raf = 0; // settled — park the loop until the pointer moves again
        return;
      }
      x += dx * lerp; // snappy follow with a light trail
      y += dy * lerp;
      el.style.setProperty('--spot-x', `${x}px`);
      el.style.setProperty('--spot-y', `${y}px`);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      // mouse/pen run on fine-pointer devices, touch on coarse ones
      if (e.pointerType === 'touch' ? !coarse : !fine) return;

      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      // grace margin so the lit copy fades in before the cursor is strictly over
      // the glyphs, and out again once it leaves
      const near =
        e.clientX > r.left - margin &&
        e.clientX < r.right + margin &&
        e.clientY > r.top - margin &&
        e.clientY < r.bottom + margin;
      // a touch keeps lingering after release; a move cancels a pending fade-out
      window.clearTimeout(linger);
      el.style.setProperty('--spot-o', near ? '1' : '0');
      if (!started) {
        started = true;
        x = tx; // snap on first move — no lerp from the centre
        y = ty;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // a tap lights the blob at once — a finger never "hovers" before it presses
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !coarse) return;
      onMove(e);
    };

    const onRelease = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !coarse) return;
      // let the finger version of the spotlight linger a beat, then fade it out
      window.clearTimeout(linger);
      linger = window.setTimeout(() => el.style.setProperty('--spot-o', '0'), 500);
    };

    window.addEventListener('pointermove', onMove, {passive: true});
    window.addEventListener('pointerdown', onDown, {passive: true});
    window.addEventListener('pointerup', onRelease, {passive: true});
    window.addEventListener('pointercancel', onRelease, {passive: true});
    return () => {
      window.clearTimeout(linger);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
    };
  }, [ref, margin, lerp]);
}

export function Spotlit({
  as = 'span',
  className,
  children,
  lit,
  radius = DEFAULT_RADIUS,
  margin = 140,
  bloom = DEFAULT_BLOOM,
}: SpotlitProps) {
  const overlayRef = useRef<HTMLElement | null>(null);
  useSpotlight(overlayRef, margin);
  const Tag = as;
  return (
    <Tag className={classNames('relative', className)}>
      {children}
      {/* lit copy — same layout, swapped colors, masked to the cursor. `text-balance`
          keeps multi-line wrapping identical to the base copy; aria-hidden so the
          text is only read once. The masked layer deliberately extends 0.4em above
          and below the element: with tight line-heights (< ~1.2) glyph ink — e.g. the
          tail of a "Q" or a "g" — overflows the element box, and a mask clips to its
          border box, so that ink would never light. The inner span re-insets to the
          exact element box, keeping the lit copy aligned pixel-for-pixel with the base. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[0.4em] left-0 right-0 select-none"
        ref={overlayRef}
        style={spotMaskStyle(radius, bloom)}>
        <span className="absolute inset-y-[0.4em] left-0 right-0 text-balance">{lit}</span>
      </span>
    </Tag>
  );
}

Spotlit.displayName = 'Spotlit';
export default Spotlit;
