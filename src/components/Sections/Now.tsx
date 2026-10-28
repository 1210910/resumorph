import {FC, memo} from 'react';

import {nowData, SectionId} from '../../data/data';
import {GROUP_HEADING} from '../../styles';
import Section from '../Layout/Section';
import Reveal from '../Reveal';
import SectionHeader from '../SectionHeader';

/**
 * Now — the current role up front: a one-paragraph pitch, the platform drawn as a
 * stack of layers joined by a live rail (a pulse travels from the API down to the
 * foundation), and four highlight cards.
 */
const Now: FC = memo(() => {
  const {company, title, since, pitch, stack, highlights} = nowData;

  return (
    <Section sectionId={SectionId.Now}>
      <div className="flex flex-col gap-12">
        <SectionHeader eyebrow="~/now" title="What I build" />

        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <span className="glass-pill !py-1.5 text-xs">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime shadow-glow-sm" />
              {title} · {company} · since {since}
            </span>
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{pitch}</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass p-6 sm:p-8 md:p-10">
            <h3 className={GROUP_HEADING}>The platform, layer by layer</h3>
            <ol className="platform-stack mt-8">
              {stack.map(({layer, role, tools}, idx) => (
                <li className="platform-layer" key={layer}>
                  <span aria-hidden="true" className="platform-node">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-slate-100">{layer}</p>
                      <p className="text-sm text-slate-400">{role}</p>
                    </div>
                    <ul aria-label={`${layer} tools`} className="flex flex-wrap gap-2 md:justify-end">
                      {tools.map(tool => (
                        <li className="tech-tag" key={tool}>
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {highlights.map(({title: highlight, text, Icon}, idx) => (
            <li key={highlight}>
              <Reveal delay={Math.min(idx, 3) * 90}>
                <div className="glass glass-card flex h-full flex-col gap-3 p-6">
                  <span className="icon-badge flex h-10 w-10 items-center justify-center rounded-xl border border-lime/30 bg-lime/10">
                    <Icon className="h-5 w-5 text-lime" />
                  </span>
                  <p className="font-display text-lg font-semibold text-slate-100">{highlight}</p>
                  <p className="text-sm leading-relaxed text-slate-400">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
});

Now.displayName = 'Now';
export default Now;
