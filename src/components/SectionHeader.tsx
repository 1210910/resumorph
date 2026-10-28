import {FC, memo} from 'react';

import Reveal from './Reveal';
import Spotlit from './Spotlit';

interface SectionHeaderProps {
  /** Small label above the title. A `~/path` renders as a terminal path, echoing the hero terminal. */
  eyebrow?: string;
  /** Main section title. Multi-word titles stack, word-per-line, last word in signal lime. */
  title: string;
  /** Optional one-line description below the title. */
  description?: string;
  /** Alignment of the header block. */
  align?: 'center' | 'start';
}

/**
 * Section header in the landonorris.com voice:
 * lowercase letter-spaced eyebrow → oversized tight-tracked uppercase title
 * (multi-word titles stack, the last word carries the single lime accent)
 * → optional muted lead line. The title is spotlit: under the cursor the words
 * swap colors (white ↔ accent) with a soft partial edge.
 */
const SectionHeader: FC<SectionHeaderProps> = memo(({eyebrow, title, description, align = 'center'}) => {
  const centered = align === 'center';
  const words = title.trim().split(/\s+/);
  const [head, ...tail] = words;
  const multi = words.length > 1;
  const headText = `${head} ${tail.slice(0, -1).join(' ')}`.trim();
  const lastWord = tail[tail.length - 1];

  return (
    <Reveal>
      <div className={centered ? 'text-center' : ''}>
        {eyebrow &&
          (eyebrow.startsWith('~/') ? (
            <span className="section-path">
              <span className="text-accent">~/</span>
              {eyebrow.slice(2)}
            </span>
          ) : (
            <span className="section-eyebrow">{eyebrow}</span>
          ))}
        <Spotlit
          as="h2"
          className="section-title"
          lit={
            multi ? (
              <>
                <span className="text-accent block">{headText}</span>
                <span className="text-white block">{lastWord}</span>
              </>
            ) : (
              <span className="text-accent block">{title}</span>
            )
          }>
          {multi ? (
            <>
              <span className="block">{headText}</span>
              <span className="text-accent block">{lastWord}</span>
            </>
          ) : (
            <span className="block">{title}</span>
          )}
        </Spotlit>
        {description && (
          <p className={`mt-7 max-w-2xl text-sm leading-relaxed text-slate-400 ${centered ? 'mx-auto' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
});

SectionHeader.displayName = 'SectionHeader';
export default SectionHeader;
