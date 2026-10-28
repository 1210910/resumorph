import classNames from 'classnames';
import Link from 'next/link';
import {FC, Fragment, memo} from 'react';

const THEMES = [
  {id: 'terminal', label: 'Terminal', href: '/'},
  {id: 'linen', label: 'Linen', href: '/linen'},
  {id: 'editorial', label: 'Editorial', href: '/editorial'},
] as const;

interface DemoBarProps {
  current: (typeof THEMES)[number]['id'];
  className?: string;
  /** Classes for the current theme's name. */
  currentClassName?: string;
}

/** The template's demo site only: a strip that switches between the theme previews. */
const DemoBar: FC<DemoBarProps> = memo(({current, className, currentClassName}) => (
  <div className={classNames('no-print px-4 py-2 text-center text-xs', className)}>
    Demo themes:{' '}
    {THEMES.map((theme, index) => (
      <Fragment key={theme.id}>
        {index > 0 && ' · '}
        {theme.id === current ? (
          <span className={classNames('font-semibold', currentClassName)}>{theme.label}</span>
        ) : (
          <Link className="underline decoration-dotted underline-offset-4 hover:opacity-80" href={theme.href}>
            {theme.label}
          </Link>
        )}
      </Fragment>
    ))}
  </div>
));

export default DemoBar;
