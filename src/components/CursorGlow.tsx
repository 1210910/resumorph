import {useEffect, useRef} from 'react';

/**
 * Cursor spotlight — a soft violet radial blob that trails the pointer, like
 * landonorris.com's cursor shadow. One fixed, full-viewport div whose position
 * is eased in a requestAnimationFrame loop and written to CSS custom properties
 * (`--glow-x` / `--glow-y`) — no React state is touched on pointermove.
 *
 * Fine pointers (mouse/pen) get the tight steady trail. Coarse pointers get the
 * finger version: the blob follows while the finger is down, then eases back to
 * invisibility once it lifts, so nothing lingers over the page.
 *
 * Disabled entirely under `prefers-reduced-motion`. The div always renders
 * (opacity 0 until the first pointer of a supported kind) so server/client
 * markup matches — no hydration mismatch.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // off entirely under reduced motion; otherwise support whichever pointer kinds exist
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const fine = window.matchMedia('(pointer: fine)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (!fine && !coarse) {
      return;
    }

    let raf = 0;
    let seen = false; // a pointer of a supported kind has been seen
    let touching = false; // a touch finger is currently down (drives the fade)
    let glow = 0; // eased opacity, touch path only
    // current (eased) position starts centred; tx/ty is where the pointer is.
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onPointer = (e: PointerEvent) => {
      // mouse/pen run on fine-pointer devices, touch on coarse ones
      const isTouch = e.pointerType === 'touch';
      if (isTouch ? !coarse : !fine) return;
      touching = isTouch;
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx; // snap on first move — no lerp from the centre
        y = ty;
      }
    };

    const onRelease = (e: PointerEvent) => {
      if (e.pointerType === 'touch') touching = false;
    };

    const tick = () => {
      x += (tx - x) * 0.3; // snappy easing — tight trail, still smooth
      y += (ty - y) * 0.3;
      el.style.setProperty('--glow-x', `${x}px`);
      el.style.setProperty('--glow-y', `${y}px`);
      if (fine) {
        // unchanged desktop behavior: steady wash once first seen
        el.style.opacity = seen ? '0.13' : '0';
      } else {
        // touch: wash in while the finger is down, ease out after it lifts
        const target = seen && touching ? 0.13 : 0;
        glow += (target - glow) * (target > glow ? 0.25 : 0.08); // quick in, slow out
        el.style.opacity = String(glow);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointer, {passive: true});
    window.addEventListener('pointerup', onRelease, {passive: true});
    window.addEventListener('pointercancel', onRelease, {passive: true});
    if (coarse && !fine) {
      // a bare tap (no drag) must light the blob — drag devices get it on move
      window.addEventListener('pointerdown', onPointer, {passive: true});
    }
    tick();

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerup', onRelease);
      window.removeEventListener('pointercancel', onRelease);
      if (coarse && !fine) window.removeEventListener('pointerdown', onPointer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0,
        background:
          'radial-gradient(circle 280px at var(--glow-x, 50%) var(--glow-y, 50%), #8b5cf6 0%, transparent 72%)',
        filter: 'blur(100px)',
      }}
    />
  );
}
