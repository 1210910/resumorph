import classNames from 'classnames';
import {FC, memo, useEffect, useRef} from 'react';

import {THEME_EVENT} from './ThemeToggle';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number; // index into palette
}

const PALETTE = [
  [235, 235, 231], // bone
  [205, 205, 200], // dim bone
  [139, 92, 246], // signal violet (rare)
] as const;

// the same roles on light paper: graphite dots, the violet signal a shade deeper
const PALETTE_LIGHT = [
  [70, 70, 76],
  [120, 120, 128],
  [124, 58, 237],
] as const;

const BASE_SPEED = 0.32;
const CURSOR_RADIUS = 170;

/**
 * Lightweight animated dot-network rendered on canvas — the hero backdrop.
 * Dots drift and connect with faint lines; density scales with area. Near the
 * cursor they link up to it in violet and ease out of its way.
 * Respects `prefers-reduced-motion` (renders a static frame instead) and
 * pauses when scrolled out of view.
 */
const ParticleField: FC<{className?: string}> = memo(({className}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;

    let raf = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let running = true;
    // cursor position in canvas space; off-canvas when unknown
    const pointer = {x: -9999, y: -9999};

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // fewer particles on small screens / coarse pointers
      const count = isCoarse || width < 640 ? 36 : Math.min(80, Math.round((width * height) / 16000));
      particles = Array.from({length: count}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * BASE_SPEED,
        vy: (Math.random() - 0.5) * BASE_SPEED,
        r: 1 + Math.random() * 1.6,
        // mostly neutral; a sparse few dots carry the single lime signal
        hue: Math.random() < 0.14 ? PALETTE.length - 1 : Math.floor(Math.random() * (PALETTE.length - 1)),
      }));
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const palette = document.documentElement.classList.contains('light') ? PALETTE_LIGHT : PALETTE;

      // connection lines
      const linkDist = 130;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.06;
            const [r, g, bl] = palette[a.hue];
            ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // cursor links: nearby dots reach for the pointer in violet
      const [sr, sg, sb] = palette[palette.length - 1];
      for (const p of particles) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CURSOR_RADIUS) {
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${(1 - d / CURSOR_RADIUS) * 0.42})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      // dots
      for (const p of particles) {
        const [r, g, b] = palette[p.hue];
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.hue === PALETTE.length - 1 ? 0.4 : 0.24})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (move) {
          // a soft push away from the cursor, then friction back to cruising speed
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CURSOR_RADIUS * CURSOR_RADIUS && d2 > 1) {
            const force = (1 - Math.sqrt(d2) / CURSOR_RADIUS) * 0.06;
            const d = Math.sqrt(d2);
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > BASE_SPEED) {
            p.vx *= 0.97;
            p.vy *= 0.97;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -12) p.x = width + 12;
          if (p.x > width + 12) p.x = -12;
          if (p.y < -12) p.y = height + 12;
          if (p.y > height + 12) p.y = -12;
        }
      }
    };

    const tick = () => {
      if (!running) return;
      draw(true);
      raf = requestAnimationFrame(tick);
    };

    seed();

    if (reduceMotion) {
      draw(false); // static single frame
    } else {
      tick();
    }

    // pause work when the hero is off-screen
    const visibility = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const shouldRun = entry.isIntersecting;
          if (shouldRun && !running) {
            running = true;
            if (!reduceMotion) tick();
          } else if (!shouldRun && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        });
      },
      {threshold: 0},
    );
    visibility.observe(canvas);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        seed();
        if (reduceMotion) draw(false);
      }, 150);
    };
    window.addEventListener('resize', onResize);

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointer, {passive: true});
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    // a static frame keeps its old colors until repainted
    const onTheme = () => {
      if (reduceMotion) draw(false);
    };
    document.documentElement.addEventListener(THEME_EVENT, onTheme);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeEventListener(THEME_EVENT, onTheme);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className={classNames('particle-field block h-full w-full', className)}
      ref={canvasRef}
    />
  );
});

ParticleField.displayName = 'ParticleField';

export default ParticleField;
