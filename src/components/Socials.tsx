import {FC, memo} from 'react';

import {socialLinks} from '../data/data';

interface SocialsProps {
  /** Labels to omit, e.g. socials already rendered as action buttons in the same section. */
  exclude?: string[];
}

const Socials: FC<SocialsProps> = memo(({exclude}) => {
  const excluded = new Set(exclude ?? []);
  return (
    <>
      {socialLinks
        .filter(({label}) => !excluded.has(label))
        .map(({label, Icon, href}) => (
          <a
            aria-label={label}
            className="glass-pill !px-3 !py-1.5 !text-xs !flex !items-center !gap-2"
            href={href}
            key={label}>
            <span className="truncate">{label}</span>
            <Icon className="h-3.5 w-3.5 flex-none sm:h-4 sm:w-4" />
          </a>
        ))}
    </>
  );
});

Socials.displayName = 'Socials';
export default Socials;
