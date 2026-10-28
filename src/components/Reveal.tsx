import classNames from 'classnames';
import {FC, memo, PropsWithChildren, useEffect, useRef, useState} from 'react';

interface RevealProps extends PropsWithChildren {
  className?: string;
  /** stagger delay in ms */
  delay?: number;
}

/**
 * Fades content up when it scrolls into view.
 * Respects `prefers-reduced-motion` (content shows immediately).
 */
const Reveal: FC<RevealProps> = memo(({children, className, delay = 0}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.12},
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={classNames('reveal', visible && 'is-visible', className)}
      ref={ref}
      style={delay ? ({'--reveal-delay': `${delay}ms`} as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
});

Reveal.displayName = 'Reveal';

export default Reveal;
