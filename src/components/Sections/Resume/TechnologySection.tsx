import {FC, memo} from 'react';

/**
 * Technology stack — pill clouds grouped by category (edit groups in data.tsx).
 */
const TechnologySection: FC<{groups: Array<{name: string; skills: string[]}>}> = memo(({groups}) => {
  return (
    <div className="mt-6 space-y-8">
      {groups.map(group => (
        <div key={group.name}>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-smoke-400">{group.name}</h4>
          <div className="mt-3 flex flex-wrap gap-3">
            {group.skills.map(skill => (
              <span className="glass-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

TechnologySection.displayName = 'TechnologySection';
export default TechnologySection;
