import {FC, memo} from 'react';

import {education, experience, SectionId, skills, softSkills} from '../../../data/data';
import {GROUP_HEADING} from '../../../styles';
import Section from '../../Layout/Section';
import Reveal from '../../Reveal';
import SectionHeader from '../../SectionHeader';
import ExperienceTimeline from './ExperienceTimeline';
import TechnologySection from './TechnologySection';

/**
 * Resume section — Work Experience, Education, Technology Stack, Soft Skills.
 * Skills are shown as pill clouds grouped by category (edit the groups in data.tsx).
 */
const Resume: FC = memo(() => {
  return (
    <Section sectionId={SectionId.Resume}>
      <div className="flex flex-col gap-12">
        <SectionHeader eyebrow="~/resume" title="Resume" />

        {experience.length > 0 && (
          <Reveal>
            <div className="glass p-8 md:p-10">
              <h3 className={GROUP_HEADING}>Work Experience</h3>
              <ExperienceTimeline items={experience} />
            </div>
          </Reveal>
        )}

        {education.length > 0 && (
          <Reveal>
            <div className="glass p-8 md:p-10">
              <h3 className={GROUP_HEADING}>Education</h3>
              <ul className="mt-6 space-y-8">
                {education.map(item => (
                  <li className="relative pl-10" key={item.title}>
                    <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-display text-lg font-semibold text-slate-100">{item.title}</h4>
                      <span className="text-xs font-medium uppercase tracking-wider text-smoke-500">{item.date}</span>
                      <span className="text-xs text-slate-500">{item.location}</span>
                    </div>
                    <div className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{item.content}</div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {skills.length > 0 && (
          <Reveal>
            <div className="glass p-8 md:p-10">
              <h3 className={GROUP_HEADING}>Technology Stack</h3>
              <TechnologySection groups={skills} />
            </div>
          </Reveal>
        )}

        {softSkills.length > 0 && (
          <Reveal>
            <div className="glass p-8 md:p-10">
              <h3 className={GROUP_HEADING}>Soft Skills</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {softSkills.map((skill, idx) => (
                  <span className="glass-pill" key={idx}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
});

Resume.displayName = 'Resume';
export default Resume;
