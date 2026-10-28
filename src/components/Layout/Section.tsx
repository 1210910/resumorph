import classNames from 'classnames';
import {FC, memo, PropsWithChildren} from 'react';

import {SectionId} from '../../data/data';

const Section: FC<
  PropsWithChildren<{sectionId: SectionId; sectionTitle?: string; noPadding?: boolean; className?: string}>
> = memo(({children, sectionId, noPadding = false, className}) => {
  return (
    <section
      className={classNames('relative', className, {'scroll-mt-24 px-5 py-16 md:py-24 sm:px-8': !noPadding})}
      id={sectionId}>
      <div aria-hidden="true" className="section-glow" />
      <div className={classNames('relative', {'mx-auto max-w-screen-lg': !noPadding})}>{children}</div>
    </section>
  );
});

Section.displayName = 'Section';
export default Section;
