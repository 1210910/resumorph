import {FC, memo} from 'react';

import {aboutData, SectionId} from '../../data/data';
import {GROUP_HEADING} from '../../styles';
import Section from '../Layout/Section';
import SectionHeader from '../SectionHeader';

const About: FC = memo(() => {
  const {description, aboutItems, hobbies} = aboutData as unknown as {
    profileImageSrc?: string;
    description: string;
    aboutItems: Array<{label: string; text: string; Icon?: React.ElementType}>;
    hobbies?: string[];
  };
  return (
    <Section sectionId={SectionId.About}>
      <div className="flex flex-col gap-14">
        <SectionHeader eyebrow="~/about" title="About me" />

        <div className="glass p-8 md:p-12">
          <p className="prose prose-sm max-w-3xl text-slate-300 sm:prose-base prose-p:leading-relaxed">{description}</p>

          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {aboutItems.map((item, idx) => (
              <li className="flex items-start gap-x-3" key={idx}>
                {item.Icon && <item.Icon className="mt-0.5 h-5 w-5 flex-none text-lime" />}
                <span className="text-sm font-semibold text-slate-100">
                  {item.label}: <span className="font-normal text-slate-400">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>

          {hobbies && hobbies.length > 0 && (
            <div className="mt-10 flex flex-col gap-4">
              <h3 className={GROUP_HEADING}>Outside of work</h3>
              <div className="flex flex-wrap gap-3">
                {hobbies.map(hobby => (
                  <span className="glass-pill" key={hobby}>
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
});

About.displayName = 'About';
export default About;
