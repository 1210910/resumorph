import {FC, memo} from 'react';

import {profile} from '../data/data';

/**
 * The heptagon mark: the person's initials inside a seven-sided outline.
 * The outline turns one side on hover (see .logo-hex).
 * public/favicon.svg is the same drawing — keep the two in sync.
 */
const Logo: FC<{className?: string}> = memo(({className}) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 64 64">
    <defs>
      <linearGradient id="logo-fill" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#1d1638" />
        <stop offset="1" stopColor="#0f0c1d" />
      </linearGradient>
    </defs>
    <polygon
      className="logo-hex"
      fill="url(#logo-fill)"
      points="32,3.5 55.1,14.6 60.8,39.6 44.8,59.6 19.2,59.6 3.2,39.6 8.9,14.6"
      stroke="#8b5cf6"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    {/* the initials from data.tsx, set in the display font */}
    <text
      dominantBaseline="central"
      fill="#ffffff"
      fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
      fontSize={profile.initials.length > 2 ? 18 : 24}
      fontWeight={700}
      textAnchor="middle"
      x="32"
      y="33">
      {profile.initials}
    </text>
  </svg>
));

Logo.displayName = 'Logo';
export default Logo;
