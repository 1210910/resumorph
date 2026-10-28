import {
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Link from 'next/link';
import {FC, memo} from 'react';

import {contact, heroData, profile, SectionId, socialLinks} from '../../data/data';
import {ContactType} from '../../data/dataDef';
import ProtectedContact from '../ProtectedContact';
import Reveal from '../Reveal';

/** Same section order as the header's pill nav. */
const pageLinks: SectionId[] = [
  SectionId.About,
  SectionId.Resume,
  SectionId.References,
  SectionId.Portfolio,
  SectionId.Contact,
];

const label = (section: SectionId) => section.charAt(0).toUpperCase() + section.slice(1);

const linkClass = 'min-w-0 transition-colors duration-300 hover:text-lime motion-reduce:transition-none';
const textClass = 'block truncate text-sm font-medium text-slate-200 sm:text-base';

const contactIcons: Partial<Record<ContactType, React.ElementType>> = {
  [ContactType.Email]: EnvelopeIcon,
  [ContactType.Phone]: DevicePhoneMobileIcon,
  [ContactType.Location]: MapPinIcon,
};

/** Big display-text link — the "btn-text is-footer" pattern, ink voice. */
const BigLink: FC<{
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}> = memo(({href, external, children, className}) => (
  <a
    className={classNames(
      'group inline-flex items-center gap-2 font-display text-2xl font-medium tracking-[-0.02em] text-smoke-300 transition-colors duration-300 hover:text-white motion-reduce:transition-none sm:text-3xl',
      className,
    )}
    href={href}
    {...(external ? {rel: 'noreferrer', target: '_blank'} : {})}>
    <span className="relative">
      {children}
      {/* lime underline draws in on hover */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-lime transition-transform duration-300 motion-reduce:transition-none group-hover:scale-x-100"
      />
    </span>
    {external && (
      <ArrowTopRightOnSquareIcon
        aria-hidden="true"
        className="h-5 w-5 flex-none text-lime opacity-0 transition-all duration-300 motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    )}
  </a>
));

BigLink.displayName = 'BigLink';

/** Lowercase letter-spaced column heading — the "mclaren f1 since 2019" pattern. */
const ColumnHeading: FC<{children: React.ReactNode}> = memo(({children}) => (
  <h3 className="section-eyebrow !mx-0 !mb-0">{children}</h3>
));

ColumnHeading.displayName = 'ColumnHeading';

/**
 * Site footer — the closing move of the page (cf. landonorris.com):
 * oversized text links in three columns (pages / follow on / contact), and a
 * quiet legal row with a back-to-top control. Flat ink, hairline border,
 * no gradients, no statement block.
 */
const Footer: FC = memo(() => {
  const {name} = heroData;
  const contactRows = contact.items.filter(item => contactIcons[item.type]);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-14 px-5 py-14 sm:px-8 md:py-20">
        {/* link columns */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={80}>
            <nav aria-label="Footer" className="flex flex-col gap-6">
              <ColumnHeading>pages</ColumnHeading>
              <div className="flex flex-col gap-3">
                {pageLinks.map((section, i) => (
                  <BigLink href={`#${section}`} key={section}>
                    <span
                      aria-hidden="true"
                      className="mr-1 font-display text-xs font-semibold tracking-[0.2em] text-smoke-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {label(section)}
                  </BigLink>
                ))}
              </div>
            </nav>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex flex-col gap-6">
              <ColumnHeading>follow on</ColumnHeading>
              <div className="flex flex-col gap-3">
                {socialLinks.map(social => (
                  <BigLink external href={social.href} key={social.label}>
                    {social.label}
                  </BigLink>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-col gap-6">
              <ColumnHeading>contact</ColumnHeading>
              <div className="flex flex-col gap-3">
                {contactRows.map(item => {
                  const Icon = contactIcons[item.type as keyof typeof contactIcons];
                  const caption = (
                    <span className="mt-0.5 block text-xs uppercase tracking-[0.16em] text-smoke-500">
                      {item.type.charAt(0) + item.type.slice(1).toLowerCase()}
                    </span>
                  );
                  return (
                    <span className="group flex items-start gap-3" key={item.type}>
                      {Icon && <Icon aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-lime" />}
                      {item.secret ? (
                        <ProtectedContact className={linkClass} item={item} textClassName={textClass}>
                          {caption}
                        </ProtectedContact>
                      ) : item.href ? (
                        <a
                          className={linkClass}
                          href={item.href}
                          {...(item.href.startsWith('http') ? {rel: 'noreferrer', target: '_blank'} : {})}>
                          <span className={textClass}>{item.text}</span>
                          {caption}
                        </a>
                      ) : (
                        <span className="min-w-0">
                          <span className={textClass}>{item.text}</span>
                          {caption}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* legal row */}
        <Reveal delay={320}>
          <div className="flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-smoke-500">
              © {year} <span className="text-slate-300">{name}</span>. All rights reserved.
            </p>
            <p className="text-xs lowercase tracking-[0.16em] text-smoke-500">{profile.location}</p>
            <Link
              aria-label="Back to top"
              className="group -mt-1 flex items-center gap-3 self-start sm:self-auto"
              href="#hero">
              <span className="text-xs lowercase tracking-[0.16em] text-smoke-500 transition-colors duration-300 group-hover:text-lime motion-reduce:transition-none">
                back to top
              </span>
              <span className="glass grid h-10 w-10 place-items-center !rounded-full text-slate-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-lime motion-reduce:transition-none">
                <ArrowUpIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
