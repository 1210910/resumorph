import {ChevronDownIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import {FC, memo} from 'react';

import {heroData, profile, SectionId} from '../../data/data';
import HeroTerminal from '../HeroTerminal';
import Section from '../Layout/Section';
import ParticleField from '../ParticleField';
import Reveal from '../Reveal';
import Socials from '../Socials';
import Spotlit from '../Spotlit';

const Hero: FC = memo(() => {
  const {name, actions} = heroData;
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');

  return (
    <Section noPadding sectionId={SectionId.Hero}>
      <div className="relative flex min-h-[86vh] items-center justify-center overflow-hidden">
        {/* slow aurora behind the dots: keeps the hero breathing with no cursor */}
        <div aria-hidden="true" className="hero-aurora pointer-events-none absolute inset-0 overflow-hidden">
          <span className="aurora-blob aurora-a" />
          <span className="aurora-blob aurora-b" />
        </div>
        {/* animated dot-network backdrop — reacts to the cursor */}
        <ParticleField className="absolute inset-0" />

        {/* subtle vignette to keep the copy readable */}
        <div className="hero-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_62%_60%_at_50%_44%,rgba(10,10,11,0.68)_0%,transparent_78%)]" />

        {/* split hero: identity on the left, a live terminal on the right (stacked on mobile) */}
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-24 pt-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
            {/* profile photo in the logo's heptagon; hovering only turns the outline */}
            <Reveal>
              <div className="group relative mb-7 h-32 w-32 sm:h-36 sm:w-36">
                {/* clipped to the logo's heptagon */}
                <div className="hero-photo absolute inset-0">
                  {/* next/image (unoptimized) renders a plain <img> for the static export; the
                  imported asset is a {src,width,height,blurDataURL} object at runtime in
                  Next 14, and next/image — not <img src> — is what consumes that shape */}
                  {profile.photo ? (
                    <Image alt={`Portrait of ${name}`} fill priority src={profile.photo} />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-full w-full place-items-center bg-ink-900 font-display text-4xl font-bold lowercase text-white">
                      {profile.initials}
                    </span>
                  )}
                </div>
                {/* the heptagon outline turns one side on hover, like the header logo */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                  viewBox="0 0 64 64">
                  <polygon
                    className="logo-hex hero-photo-ring"
                    fill="none"
                    points="32,3.5 55.1,14.6 60.8,39.6 44.8,59.6 19.2,59.6 3.2,39.6 8.9,14.6"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                  />
                </svg>
                {/* pod status badge */}
                <span className="pod-badge absolute -bottom-1 -right-8 flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-slate-300">
                  <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                  Running
                </span>
              </div>
            </Reveal>

            {/* lowercase letter-spaced signal label — the "mclaren f1 since 2019" pattern */}
            <Reveal>
              <span className="flex items-center gap-3 text-xs font-medium lowercase tracking-[0.3em] text-smoke-500">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime shadow-glow-sm"
                />
                {profile.role} · {profile.location}
              </span>
            </Reveal>

            {/* oversized name — white first name, accent-violet last name. A masked
              lit copy (below) fades in wherever the cursor comes near, swapping the
              two words' colors with a soft partial edge instead of a binary hover */}
            <Reveal delay={100}>
              {/* the swap: the lit copy carries each word's counterpart color, so
                inside the spotlight the first name reads violet and the last name white */}
              <Spotlit
                as="h1"
                className="mt-8 font-display text-[clamp(3rem,9vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white"
                lit={
                  <>
                    <span className="text-accent">{firstName}</span> <span className="text-white">{lastName}</span>
                  </>
                }
                radius="clamp(130px, 15vw, 230px)">
                {firstName} <span className="text-accent">{lastName}</span>
              </Spotlit>
            </Reveal>

            {/* actions */}
            <Reveal delay={180}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                {actions.map(action => {
                  const {href, text, primary, download, Icon} = action;
                  return (
                    <Link
                      className={classNames(
                        'inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-sm font-semibold transition-all duration-300 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100',
                        primary
                          ? 'bg-lime text-ink-950 shadow-glow hover:bg-lime-bright hover:shadow-glow-lg'
                          : 'border border-white/10 bg-white/[0.04] text-smoke-300 hover:border-white/25 hover:text-white',
                      )}
                      download={download || undefined}
                      href={href}
                      key={text}>
                      {Icon && <Icon className="h-4 w-4" />}
                      {text}
                    </Link>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-white/15 lg:hidden" />
                <Socials />
                <span className="h-px w-12 bg-white/15" />
              </div>
            </Reveal>
          </div>

          <Reveal className="min-w-0" delay={220}>
            <HeroTerminal />
          </Reveal>
        </div>

        {/* scroll cue */}
        <a
          aria-label="Scroll to about section"
          className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          href={`/#${SectionId.About}`}>
          <span className="text-[10px] font-medium lowercase tracking-[0.3em] text-smoke-500">scroll</span>
          <ChevronDownIcon className="h-5 w-5 animate-bounce-soft text-lime" />
        </a>
      </div>
    </Section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
