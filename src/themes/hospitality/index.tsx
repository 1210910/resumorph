import {ArrowDownTrayIcon, EnvelopeIcon, MapPinIcon} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {FC, memo, PropsWithChildren, useCallback} from 'react';

import LinkedInIcon from '../../components/Icon/LinkedInIcon';
import Reveal from '../../components/Reveal';
import {HospitalityLanguage, HospitalityResume} from '../../data/personas/hospitality';

/**
 * Hospitality theme — warm linen, bottle green and terracotta, with a serif display face.
 * Built for people whose CV is about service, not code: hotels, tourism, restaurants, events.
 * Colours come from the --h-* variables in globalStyles.scss (light and dark).
 */

const NAV = [
  {id: 'about', label: 'About'},
  {id: 'experience', label: 'Experience'},
  {id: 'skills', label: 'Skills'},
  {id: 'contact', label: 'Contact'},
];

const SectionTitle: FC<{eyebrow: string; title: string}> = memo(({eyebrow, title}) => (
  <div className="mb-10">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-hosp-accent">{eyebrow}</p>
    <h2 className="mt-3 font-serif text-3xl text-hosp-ink sm:text-4xl">{title}</h2>
  </div>
));

const Block: FC<PropsWithChildren<{id?: string; className?: string}>> = memo(({id, className, children}) => (
  <section className={`scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 ${className ?? ''}`} id={id}>
    <div className="mx-auto max-w-5xl">{children}</div>
  </section>
));

const Dots: FC<{language: HospitalityLanguage}> = memo(({language}) => (
  <span aria-label={`${language.score} out of 5`} className="flex gap-1.5" role="img">
    {[1, 2, 3, 4, 5].map(step => (
      <span
        className={`h-2 w-2 rounded-full ${step <= language.score ? 'bg-hosp-accent' : 'bg-hosp-line'}`}
        key={step}
      />
    ))}
  </span>
));

const HospitalityTheme: FC<{resume: HospitalityResume}> = memo(({resume}) => {
  const print = useCallback(() => window.print(), []);
  const [first, ...rest] = resume.name.split(' ');

  return (
    <div className="hospitality min-h-screen bg-hosp-bg font-sans text-hosp-muted">
      {/* demo-only switcher between the template's themes */}
      <div className="no-print bg-hosp-deep px-4 py-2 text-center text-xs text-[#e8dccb]">
        Demo themes:{' '}
        <Link className="underline decoration-dotted underline-offset-4 hover:text-white" href="/">
          Terminal
        </Link>{' '}
        · <span className="font-semibold text-white">Hospitality</span>
      </div>

      <header className="no-print sticky top-0 z-30 border-b border-hosp-line bg-hosp-bg/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            aria-label={`${resume.name}, back to top`}
            className="grid h-10 w-10 place-items-center rounded-full border border-hosp-accent font-serif text-sm text-hosp-accent"
            href="#top">
            {resume.initials}
          </a>
          <ul className="hidden gap-8 text-sm sm:flex">
            {NAV.map(item => (
              <li key={item.id}>
                <a className="text-hosp-muted transition-colors hover:text-hosp-accent" href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="rounded-full bg-hosp-ink px-4 py-2 text-sm font-medium text-hosp-bg transition-opacity hover:opacity-85"
            href="#contact">
            Get in touch
          </a>
        </nav>
      </header>

      <main id="top">
        {/* hero: name and pitch beside an arched "doorway" portrait */}
        <section className="px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-hosp-line bg-hosp-surface px-3 py-1 text-xs text-hosp-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4f9a6b]" />
                {resume.availability}
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-hosp-ink sm:text-6xl lg:text-7xl">
                {first} <em className="font-normal italic text-hosp-accent">{rest.join(' ')}</em>
              </h1>
              <p className="mt-4 text-lg font-medium text-hosp-ink">{resume.role}</p>
              <p className="mt-5 max-w-xl text-base leading-relaxed">{resume.summary}</p>
              <p className="mt-5 flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-hosp-accent" />
                {resume.location}
              </p>
              <div className="no-print mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-hosp-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  href="#contact">
                  <EnvelopeIcon className="h-4 w-4" />
                  Contact me
                </a>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-hosp-ink/25 px-5 py-3 text-sm font-medium text-hosp-ink transition-colors hover:border-hosp-accent hover:text-hosp-accent"
                  onClick={print}
                  type="button">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Save as PDF
                </button>
              </div>
            </Reveal>
            <Reveal className="mx-auto w-full max-w-[12rem] md:max-w-[18rem]" delay={120}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border-[6px] border-hosp-surface bg-hosp-deep shadow-[0_30px_60px_-30px_rgba(31,59,51,0.55)]">
                <div className="absolute inset-3 rounded-t-full border border-[#e8dccb]/30" />
                <span className="absolute inset-0 grid place-items-center font-serif text-7xl text-[#e8dccb]">
                  {resume.initials}
                </span>
              </div>
            </Reveal>
          </div>

          <dl className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hosp-line bg-hosp-line sm:grid-cols-4">
            {resume.stats.map(stat => (
              <div className="bg-hosp-surface px-5 py-6 text-center" key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-serif text-4xl text-hosp-ink">{stat.value}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em]">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <Block className="bg-hosp-surface" id="about">
          <SectionTitle eyebrow="About" title="Hospitality is a craft of small moments." />
          <div className="grid gap-6 text-base leading-relaxed md:grid-cols-2 md:gap-10">
            {resume.about.map(paragraph => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Block>

        <Block id="experience">
          <SectionTitle eyebrow="Experience" title="Where I have welcomed guests" />
          <ol className="relative space-y-12 border-l border-hosp-line pl-8">
            {resume.experience.map(job => (
              <li className="relative" key={`${job.property}-${job.title}`}>
                <span className="absolute -left-[37px] top-1.5 h-[11px] w-[11px] rounded-full border-2 border-hosp-bg bg-hosp-accent" />
                <Reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hosp-accent">{job.date}</p>
                  <h3 className="mt-2 font-serif text-2xl text-hosp-ink">{job.title}</h3>
                  <p className="mt-1 text-sm text-hosp-ink">
                    {job.property} <span className="text-hosp-muted">· {job.location}</span>
                  </p>
                  <p className="mt-0.5 text-xs italic">{job.detail}</p>
                  <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
                    {job.highlights.map(item => (
                      <li className="flex gap-3" key={item}>
                        <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-hosp-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </Block>

        <Block className="bg-hosp-surface" id="skills">
          <SectionTitle eyebrow="Skills" title="What I bring to the front desk" />
          <div className="grid gap-6 md:grid-cols-3">
            {resume.skills.map(group => (
              <div className="rounded-2xl border border-hosp-line bg-hosp-bg p-6" key={group.name}>
                <h3 className="font-serif text-xl text-hosp-ink">{group.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <li
                      className="rounded-full border border-hosp-line bg-hosp-surface px-3 py-1 text-[13px] text-hosp-ink"
                      key={skill}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl text-hosp-ink">Languages</h3>
              <ul className="mt-5 divide-y divide-hosp-line">
                {resume.languages.map(language => (
                  <li className="flex items-center justify-between gap-4 py-3" key={language.name}>
                    <span>
                      <span className="text-hosp-ink">{language.name}</span>
                      <span className="ml-2 text-sm">{language.level}</span>
                    </span>
                    <Dots language={language} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-hosp-ink">Training &amp; education</h3>
              <ul className="mt-5 divide-y divide-hosp-line">
                {[...resume.credentials, ...resume.education].map(item => (
                  <li className="flex items-baseline justify-between gap-4 py-3" key={item.title}>
                    <span>
                      <span className="block text-hosp-ink">{item.title}</span>
                      <span className="text-sm">{item.issuer}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">{item.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Block>

        <Block id="references">
          <SectionTitle eyebrow="References" title="In the words of my managers" />
          <div className="grid gap-6 md:grid-cols-2">
            {resume.references.map(reference => (
              <figure className="rounded-2xl border border-hosp-line bg-hosp-surface p-7" key={reference.name}>
                <span aria-hidden="true" className="font-serif text-5xl leading-none text-hosp-accent">
                  “
                </span>
                <blockquote className="-mt-3 font-serif text-xl leading-snug text-hosp-ink">
                  {reference.quote}
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-medium text-hosp-ink">{reference.name}</span> · {reference.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </Block>

        <section className="scroll-mt-20 bg-hosp-deep px-4 py-20 text-[#e8dccb] sm:px-6 sm:py-24" id="contact">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e9a37f]">Contact</p>
            <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">Let’s talk about your guests.</h2>
            <p className="mx-auto mt-4 max-w-lg">
              References and my phone number are available on request. The quickest way to reach me is email.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                className="inline-flex items-center gap-2 rounded-full bg-[#e8dccb] px-5 py-3 text-sm font-medium text-[#1f3b33] transition-opacity hover:opacity-90"
                href={`mailto:${resume.email}`}>
                <EnvelopeIcon className="h-4 w-4" />
                {resume.email}
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-full border border-[#e8dccb]/40 px-5 py-3 text-sm font-medium transition-colors hover:border-white hover:text-white"
                href={resume.linkedin}
                rel="noreferrer"
                target="_blank">
                <LinkedInIcon className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="no-print px-4 py-8 text-center text-xs sm:px-6">
        © {new Date().getFullYear()} {resume.name} · Fictional demo persona · Built with{' '}
        <a
          className="underline decoration-dotted underline-offset-4 hover:text-hosp-accent"
          href="https://github.com/1210910/resumorph">
          resumorph
        </a>
      </footer>
    </div>
  );
});

export default HospitalityTheme;
