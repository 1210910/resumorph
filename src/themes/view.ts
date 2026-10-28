import {formatDate, formatRange, initialsOf, languageLevel, locationOf, Resume} from '../content';
import {ContactItem, ContactType} from '../data/dataDef';

/**
 * What the page themes (Linen, Editorial) draw, derived from resume.yaml. The Terminal theme
 * has its own mapping in src/data/data.tsx.
 */
export interface ThemeView {
  name: string;
  initials: string;
  role: string;
  location: string;
  availability?: string;
  summary: string;
  photo?: string;
  about: string[];
  stats: Array<{value: string; label: string}>;
  experience: Array<{
    title: string;
    property: string;
    detail?: string;
    location?: string;
    date: string;
    highlights: string[];
    /** Tools or skills used in the role. */
    keywords: string[];
  }>;
  skills: Array<{name: string; skills: string[]}>;
  languages: ThemeLanguage[];
  /** Certificates first, then education. */
  training: Array<{title: string; issuer: string; year: string}>;
  references: Array<{quote: string; name: string; role: string}>;
  /** Encoded and revealed on click unless privacy.hideContactDetails is off. */
  email?: ContactItem;
  linkedin?: string;
  titles: {about: string; experience: string; skills: string; references: string};
  contact: {headline: string; message?: string};
}

export interface ThemeLanguage {
  name: string;
  level: string;
  /** 1 (basic) to 5 (native), drawn as dots */
  score: number;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Strips the **bold** markers the terminal theme renders. */
const plain = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '$1');

export const toThemeView = (resume: Resume): ThemeView => {
  const {basics} = resume;
  return {
    name: basics.name,
    initials: (basics.initials ?? initialsOf(basics.name)).toUpperCase(),
    role: basics.label,
    location: locationOf(basics),
    availability: basics.availability,
    summary: basics.summary,
    photo: basics.image && `${basePath}/${basics.image.replace(/^\//, '')}`,
    about: resume.about,
    stats: resume.stats,
    experience: resume.work.map(job => ({
      title: job.position,
      property: job.name,
      detail: job.description,
      location: job.location,
      date: formatRange(job.startDate, job.endDate),
      highlights: (job.highlights.length ? job.highlights : job.summary ? [job.summary] : []).map(plain),
      keywords: job.keywords,
    })),
    skills: [
      ...resume.skills.map(group => ({name: group.name, skills: group.keywords})),
      ...(resume.softSkills.length ? [{name: 'Soft skills', skills: resume.softSkills}] : []),
    ],
    languages: resume.languages.map(item => ({
      name: item.language,
      level: item.fluency,
      score: languageLevel(item),
    })),
    training: [
      ...resume.certificates.map(item => ({
        title: item.name,
        issuer: item.issuer,
        year: item.date ? formatDate(item.date) : '',
      })),
      ...resume.education.map(item => ({
        title: `${item.studyType} in ${item.area}`,
        issuer: item.institution,
        year: formatRange(item.startDate, item.endDate),
      })),
    ],
    references: resume.references.flatMap(item =>
      item.reference
        ? [{quote: item.reference, name: item.name, role: [item.position, item.company].filter(Boolean).join(', ')}]
        : [],
    ),
    email:
      basics.email === undefined
        ? undefined
        : typeof basics.email === 'string'
          ? {type: ContactType.Email, text: basics.email, href: `mailto:${basics.email}`}
          : {type: ContactType.Email, text: 'Show email', secret: basics.email.encoded},
    linkedin: basics.profiles.find(item => item.network.toLowerCase() === 'linkedin')?.url,
    titles: {
      about: resume.titles.about ?? 'About me',
      experience: resume.titles.experience ?? 'Where I have worked',
      skills: resume.titles.skills ?? 'What I bring',
      references: resume.titles.references ?? 'What people say',
    },
    contact: resume.contact,
  };
};
