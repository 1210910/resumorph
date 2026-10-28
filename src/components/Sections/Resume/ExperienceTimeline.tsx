import {FC, memo} from 'react';

import {CompanyExperience} from '../../../data/dataDef';

/**
 * Work experience as a vertical timeline, LinkedIn-style.
 * Each company is a glowing node on a soft gradient rail, and ALL of its positions
 * are visually nested inside a bordered container beneath the company header —
 * even a company with a single position, so the "multiple roles per company"
 * structure reads clearly from the layout itself.
 */
const ExperienceTimeline: FC<{items: CompanyExperience[]}> = memo(({items}) => {
  return (
    <div className="relative mt-8">
      {/* timeline rail */}
      <div className="absolute top-1 bottom-2 left-4 w-px bg-gradient-to-b from-lime/45 via-white/10 to-transparent" />

      <ul className="space-y-10">
        {items.map((item, idx) => (
          <li className="relative pl-10" key={idx}>
            {/* node */}
            <span className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lime shadow-[0_0_10px_rgba(139,92,246,0.5)]" />

            {/* company header */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="font-display text-lg font-semibold text-slate-100">{item.company}</h4>
              <span className="text-xs text-slate-500">{item.locations.join(' · ')}</span>
            </div>

            {/* positions nested inside this company */}
            <ul className="mt-4 space-y-6 border-l border-white/10 pl-5">
              {item.positions.map((position, posIdx) => (
                <li key={posIdx}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h5 className="font-display text-base font-medium text-slate-200">{position.title}</h5>
                    <span className="text-xs font-medium uppercase tracking-wider text-smoke-500">{position.date}</span>
                  </div>
                  <div className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{position.content}</div>
                  {position.tech && position.tech.length > 0 && (
                    <ul aria-label={`Technologies used as ${position.title}`} className="mt-4 flex flex-wrap gap-2">
                      {position.tech.map(tech => (
                        <li className="tech-tag" key={tech}>
                          {tech}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
});

ExperienceTimeline.displayName = 'ExperienceTimeline';
export default ExperienceTimeline;
