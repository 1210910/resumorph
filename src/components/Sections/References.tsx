import {ChatBubbleOvalLeftEllipsisIcon as QuoteIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import {FC, memo} from 'react';

import {experience, references, SectionId} from '../../data/data';
import Section from '../Layout/Section';
import Reveal from '../Reveal';
import SectionHeader from '../SectionHeader';

type Reference = (typeof references)[number];

/** One reference card: quote (when present) + identity + contact pill. */
const ReferenceCard: FC<{reference: Reference; index: number}> = memo(({reference, index}) => {
  const name = <span className="font-display text-lg font-semibold text-slate-100">{reference.name}</span>;
  const role = (
    <span className="text-sm text-slate-400">
      {reference.role}
      {reference.company ? ` · ${reference.company}` : ''}
    </span>
  );

  return (
    <Reveal delay={Math.min(index, 3) * 110}>
      <div className="glass glass-card flex h-full flex-col gap-5 p-7">
        {reference.quote ? (
          <>
            <QuoteIcon className="h-8 w-8 flex-none text-lime opacity-80" />
            <blockquote className="text-[0.95rem] leading-relaxed text-slate-300">{reference.quote}</blockquote>
          </>
        ) : (
          <QuoteIcon className="h-8 w-8 flex-none text-smoke-500" />
        )}

        {/* identity is pinned to the bottom so cards in a row align */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-5">
          <div className="min-w-0">
            <div className="truncate">{name}</div>
            <div className="truncate">{role}</div>
          </div>
          {reference.href ? (
            <Link
              aria-label={`Contact ${reference.name}`}
              className="glass-pill !px-3 !py-1.5 flex-none"
              href={reference.href}
              rel="noreferrer"
              target="_blank">
              Get in touch
            </Link>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
});

ReferenceCard.displayName = 'ReferenceCard';

/**
 * Partners band — company names as an auto-scrolling marquee (cf. Lando's
 * "partners & campaigns" logo strip). Derived from references + experience;
 * duplicates the set for a seamless loop, pauses on hover, and is static
 * under prefers-reduced-motion.
 */
const PartnersMarquee: FC<{names: string[]}> = memo(({names}) => {
  if (names.length === 0) return null;
  return (
    <div className="relative w-[100vw]" style={{marginInline: 'calc(50% - 50vw)'}}>
      <div className="marquee-mask overflow-hidden py-3">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          {/* four copies: the track's two halves are identical, so the -50% loop
              is seamless, and each half out-wides the viewport (no empty gap) */}
          {[0, 1, 2, 3].map(dup => (
            <div aria-hidden={dup > 1} className="flex shrink-0 items-center" key={dup}>
              {names.map(name => (
                <span className="flex items-center" key={`${name}-${dup}`}>
                  <span className="whitespace-nowrap px-8 font-display text-2xl font-medium tracking-[0.06em] text-smoke-500 sm:text-3xl">
                    {name}
                  </span>
                  <span aria-hidden="true" className="text-xl font-bold text-lime">
                    /
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

PartnersMarquee.displayName = 'PartnersMarquee';

/**
 * References — partners marquee + grid of people who can vouch for you.
 * Cards are near-black with a lime quote mark and a contact pill.
 * Edit the list in data.tsx.
 */
const References: FC = memo(() => {
  const count = references.length;
  const companyNames = Array.from(new Set([...references.map(r => r.company), ...experience.map(e => e.company)]));

  return (
    <Section sectionId={SectionId.References}>
      <div className="flex flex-col gap-14">
        <SectionHeader
          description={
            count > 0 ? 'A few people who have worked with me — and what they say.' : "Teams I've worked with."
          }
          eyebrow="~/references"
          title="References"
        />

        <PartnersMarquee names={companyNames} />

        {count > 0 && (
          <div className={classNames('grid grid-cols-1 gap-6', count > 1 && 'sm:grid-cols-2 lg:grid-cols-3')}>
            {references.map((reference, i) => (
              <ReferenceCard index={i} key={i} reference={reference} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
});

References.displayName = 'References';
export default References;
