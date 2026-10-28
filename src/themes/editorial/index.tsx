import {ArrowDownTrayIcon, EnvelopeIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import {FC, memo, PropsWithChildren, useCallback, useMemo} from 'react';

import LinkedInIcon from '../../components/Icon/LinkedInIcon';
import ProtectedContact from '../../components/ProtectedContact';
import Reveal from '../../components/Reveal';
import DemoBar from '../DemoBar';
import {ThemeView} from '../view';

/**
 * Editorial theme — a printed-magazine CV: paper and ink, one oxblood accent, big serif
 * headlines and hairline rules. Made for management, consulting, finance and other roles
 * where the story and the numbers matter more than the stack.
 * Colours come from the --ed-* variables in globalStyles.scss (light and dark).
 */

const smallCaps = 'text-[11px] font-semibold uppercase tracking-[0.2em]';

interface ChapterProps {
  id: string;
  number: string;
  label: string;
  title?: string;
}

/** A numbered section: label in the left margin, content on the right, a rule on top. */
const Chapter: FC<PropsWithChildren<ChapterProps>> = memo(({id, number, label, title, children}) => (
  <section className="scroll-mt-16 border-t border-ed-ink px-4 py-14 sm:px-6 md:py-20" id={id}>
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12">
      <header>
        <p className={`${smallCaps} text-ed-accent`}>
          <span className="tabular-nums">{number}</span> — {label}
        </p>
        {title && title !== label && (
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ed-ink md:hidden">{title}</h2>
        )}
      </header>
      <div className="min-w-0">
        {title && title !== label && (
          <h2 className="mb-10 hidden font-serif text-4xl leading-tight text-ed-ink md:block lg:text-5xl">{title}</h2>
        )}
        {children}
      </div>
    </div>
  </section>
));

interface EditorialThemeProps {
  resume: ThemeView;
  /** Show the template's theme switcher bar (demo site only). */
  demo?: boolean;
}

const EditorialTheme: FC<EditorialThemeProps> = memo(({resume, demo}) => {
  const print = useCallback(() => window.print(), []);

  // number the chapters that have content, in page order
  const chapters = useMemo(() => {
    const list = [
      {id: 'profile', label: 'Profile', show: resume.about.length > 0},
      {id: 'career', label: 'Career', show: true},
      {id: 'expertise', label: 'Expertise', show: resume.skills.length > 0},
      {
        id: 'credentials',
        label: 'Education',
        show: resume.training.length > 0 || resume.languages.length > 0,
      },
      {id: 'references', label: 'References', show: resume.references.length > 0},
    ].filter(chapter => chapter.show);
    return Object.fromEntries(
      list.map((chapter, index) => [chapter.id, {...chapter, number: String(index + 1).padStart(2, '0')}]),
    );
  }, [resume]);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-ed-paper font-sans text-ed-muted">
      {demo && <DemoBar className="bg-ed-ink text-ed-paper" current="editorial" />}

      {/* running header, like the top line of a magazine page */}
      <header className="no-print sticky top-0 z-30 border-b border-ed-rule bg-ed-paper/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a className={`${smallCaps} text-ed-ink`} href="#top">
            {resume.name}
          </a>
          <ul className={`${smallCaps} hidden gap-7 lg:flex`}>
            {Object.values(chapters).map(chapter => (
              <li key={chapter.id}>
                <a className="transition-colors hover:text-ed-accent" href={`#${chapter.id}`}>
                  {chapter.label}
                </a>
              </li>
            ))}
            <li>
              <a className="transition-colors hover:text-ed-accent" href="#contact">
                Contact
              </a>
            </li>
          </ul>
          <button
            className={`${smallCaps} inline-flex items-center gap-2 border border-ed-ink px-3 py-2 text-ed-ink transition-colors hover:bg-ed-ink hover:text-ed-paper`}
            onClick={print}
            type="button">
            <ArrowDownTrayIcon className="h-3.5 w-3.5" />
            Save as PDF
          </button>
        </nav>
      </header>

      <main id="top">
        {/* masthead */}
        <section className="px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-6xl">
            <div className={`${smallCaps} flex flex-wrap justify-between gap-2 border-b border-ed-rule pb-3`}>
              <span>Curriculum vitae</span>
              <span>
                {resume.location} · {year}
              </span>
            </div>
            <Reveal>
              <h1 className="mt-8 font-serif text-[clamp(3rem,11vw,8.5rem)] font-medium leading-[0.92] tracking-tight text-ed-ink">
                {resume.name}
              </h1>
            </Reveal>
            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-y-4 border-double border-ed-ink py-3">
              <p className={`${smallCaps} text-ed-accent`}>{resume.role}</p>
              {resume.availability && (
                <p className={`${smallCaps} flex items-center gap-2`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-ed-accent" />
                  {resume.availability}
                </p>
              )}
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
              <p className="font-serif text-2xl leading-snug text-ed-ink sm:text-3xl">{resume.summary}</p>
              {resume.photo && (
                <img
                  alt={`Portrait of ${resume.name}`}
                  className="aspect-[4/5] w-full max-w-[16rem] object-cover grayscale"
                  src={resume.photo}
                />
              )}
            </div>

            {resume.stats.length > 0 && (
              <dl className="mt-14 grid grid-cols-2 border-t border-ed-ink sm:grid-cols-4">
                {resume.stats.map((stat, index) => (
                  <div
                    className={classNames(
                      'border-ed-rule py-6 pr-3',
                      // a rule between columns: none before the first column of each row
                      index === 0 ? '' : index === 2 ? 'sm:border-l sm:pl-5' : 'border-l pl-5',
                    )}
                    key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-serif text-5xl leading-none text-ed-ink tabular-nums">
                        {stat.value}
                      </span>
                      <span className="mt-3 block text-sm">{stat.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        {chapters.profile && (
          <Chapter {...chapters.profile} title={resume.titles.about}>
            <div className="ed-dropcap gap-10 font-serif text-lg leading-relaxed text-ed-ink/90 md:columns-2">
              {resume.about.map(paragraph => (
                <p className="mb-5 break-inside-avoid" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Chapter>
        )}

        <Chapter {...chapters.career} title={resume.titles.experience}>
          <ol className="divide-y divide-ed-rule">
            {resume.experience.map(job => (
              <li
                className="grid gap-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
                key={`${job.property}-${job.title}`}>
                <div className="text-sm">
                  <p className="font-medium tabular-nums text-ed-ink">{job.date}</p>
                  {job.location && <p className="mt-1">{job.location}</p>}
                </div>
                <div>
                  <h3 className="font-serif text-2xl leading-tight text-ed-ink">{job.title}</h3>
                  <p className="mt-1 text-[15px]">
                    <span className="font-medium text-ed-ink">{job.property}</span>
                    {job.detail && <span className="italic"> — {job.detail}</span>}
                  </p>
                  {job.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed">
                      {job.highlights.map(item => (
                        <li className="flex gap-3" key={item}>
                          <span aria-hidden="true" className="text-ed-accent">
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.keywords.length > 0 && (
                    <p className={`${smallCaps} mt-4 !tracking-[0.14em] text-ed-ink/70`}>{job.keywords.join(' · ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Chapter>

        {chapters.expertise && (
          <Chapter {...chapters.expertise} title={resume.titles.skills}>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {resume.skills.map(group => (
                <div className="border-t border-ed-ink pt-4" key={group.name}>
                  <h3 className={`${smallCaps} text-ed-ink`}>{group.name}</h3>
                  <ul className="mt-4 space-y-2 font-serif text-lg text-ed-ink/90">
                    {group.skills.map(skill => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Chapter>
        )}

        {chapters.credentials && (
          <Chapter {...chapters.credentials}>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              {resume.training.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl text-ed-ink">Education &amp; credentials</h3>
                  <ul className="mt-5 divide-y divide-ed-rule border-t border-ed-ink">
                    {resume.training.map(item => (
                      <li className="flex items-baseline justify-between gap-6 py-3.5" key={item.title}>
                        <span>
                          <span className="block text-ed-ink">{item.title}</span>
                          <span className="text-sm italic">{item.issuer}</span>
                        </span>
                        <span className="shrink-0 text-sm tabular-nums">{item.year}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {resume.languages.length > 0 && (
                <div>
                  <h3 className="font-serif text-2xl text-ed-ink">Languages</h3>
                  <ul className="mt-5 divide-y divide-ed-rule border-t border-ed-ink">
                    {resume.languages.map(language => (
                      <li className="flex items-baseline justify-between gap-6 py-3.5" key={language.name}>
                        <span className="text-ed-ink">{language.name}</span>
                        <span className="text-sm italic">{language.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Chapter>
        )}

        {chapters.references && (
          <Chapter {...chapters.references} title={resume.titles.references}>
            <div className="grid gap-12 lg:grid-cols-2">
              {resume.references.map(reference => (
                <figure key={reference.name}>
                  <span aria-hidden="true" className="block font-serif text-7xl leading-[0.6] text-ed-accent">
                    “
                  </span>
                  <blockquote className="mt-2 font-serif text-2xl italic leading-snug text-ed-ink">
                    {reference.quote}
                  </blockquote>
                  <figcaption className={`${smallCaps} mt-5`}>
                    <span className="text-ed-ink">{reference.name}</span> · {reference.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Chapter>
        )}

        <section
          className="scroll-mt-16 bg-ed-ink px-4 py-16 text-ed-paper sm:px-6 md:py-24 print:border-t print:border-ed-ink print:bg-transparent print:py-6 print:text-ed-ink"
          id="contact">
          <div className="mx-auto max-w-6xl">
            <p className={`${smallCaps} opacity-70`}>Contact</p>
            <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">{resume.contact.headline}</h2>
            {resume.contact.message && <p className="mt-5 max-w-xl opacity-80">{resume.contact.message}</p>}
            <div className="no-print mt-10 flex flex-wrap gap-3">
              {resume.email && (
                <ProtectedContact
                  className={`${smallCaps} inline-flex items-center gap-2 bg-ed-paper px-5 py-3.5 text-ed-ink transition-opacity hover:opacity-90`}
                  item={resume.email}>
                  <EnvelopeIcon className="order-first h-4 w-4" />
                </ProtectedContact>
              )}
              {resume.linkedin && (
                <a
                  className={`${smallCaps} inline-flex items-center gap-2 border border-ed-paper/50 px-5 py-3.5 transition-colors hover:border-ed-paper`}
                  href={resume.linkedin}
                  rel="noreferrer"
                  target="_blank">
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className={`${smallCaps} no-print px-4 py-6 text-center sm:px-6`}>
        © {year} {resume.name} · {demo && 'Fictional demo persona · '}Built with{' '}
        <a className="underline underline-offset-4 hover:text-ed-accent" href="https://github.com/1210910/resumorph">
          resumorph
        </a>
      </footer>
    </div>
  );
});

export default EditorialTheme;
