import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CloudIcon,
  CodeBracketIcon,
  CpuChipIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {Fragment, ReactNode} from 'react';

import DribbbleIcon from '../components/Icon/DribbbleIcon';
import FacebookIcon from '../components/Icon/FacebookIcon';
import GithubIcon from '../components/Icon/GithubIcon';
import InstagramIcon from '../components/Icon/InstagramIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
import StackOverflowIcon from '../components/Icon/StackOverflowIcon';
import TwitterIcon from '../components/Icon/TwitterIcon';
import {currentRole, formatDate, formatRange, initialsOf, languageLevel, locationOf, resume} from '../content';
import {
  About,
  CompanyExperience,
  ContactItem,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  Language,
  Now,
  NowHighlight,
  Profile,
  ProjectRepo,
  Reference,
  SkillGroup,
  Social,
  TimelineItem,
} from './dataDef';

/**
 * The terminal theme's view of resume.yaml. Edit resume.yaml, not this file: everything
 * here is derived from it (src/content/schema.ts documents every field).
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const {basics} = resume;
const role = currentRole(resume);

/**
 * Who this resume is about. Everything that names the person (header, hero, terminal
 * prompt, logo, footer, PDF file name, structured data) reads from here.
 */
export const profile: Profile = {
  name: basics.name,
  initials: basics.initials ?? initialsOf(basics.name).toLowerCase(),
  handle: basics.handle ?? basics.name.split(/\s+/)[0].toLowerCase(),
  role: basics.label,
  location: locationOf(basics),
  photo: basics.image && `${basePath}/${basics.image.replace(/^\//, '')}`,
  cvFileName: basics.cvFile ?? `${basics.name.replace(/\s+/g, '-')}-CV.pdf`,
};

/**
 * Page meta data
 */
export const homePageMeta: HomepageMeta = {
  title: `${profile.name} — ${profile.role}`,
  description: basics.summary,
};

/**
 * Section definition
 */
export const SectionId = {
  About: 'about',
  Contact: 'contact',
  Hero: 'hero',
  Now: 'now',
  Portfolio: 'portfolio',
  References: 'references',
  Resume: 'resume',
} as const;

export type SectionId = (typeof SectionId)[keyof typeof SectionId];

/**
 * Hero section
 */
/** The ATS-friendly one-page PDF (public/), served under the Pages base path. */
export const cvPdf = `${basePath}/${profile.cvFileName}`;

export const heroData: Hero = {
  name: profile.name,
  actions: [
    {
      href: '#now',
      text: 'See what I build',
      primary: true,
      Icon: BriefcaseIcon,
    },
    {
      href: cvPdf,
      text: 'Download CV',
      download: true,
      Icon: ArrowDownTrayIcon,
    },
    {
      href: '#contact',
      text: 'Contact',
      Icon: EnvelopeIcon,
    },
  ],
};

/** Icon names resume.yaml can use for `now.highlights`. */
const HIGHLIGHT_ICONS: Record<string, NowHighlight['Icon']> = {
  server: ServerStackIcon,
  chip: CpuChipIcon,
  cycle: ArrowPathIcon,
  cloud: CloudIcon,
  chart: ChartBarIcon,
  shield: ShieldCheckIcon,
  users: UserGroupIcon,
  sparkles: SparklesIcon,
  globe: GlobeAltIcon,
  star: StarIcon,
  briefcase: BriefcaseIcon,
  code: CodeBracketIcon,
};

/**
 * Now section — the current role, front and centre
 */
export const nowData: Now = {
  company: role.name,
  title: role.position,
  since: formatDate(role.startDate),
  pitch: resume.now?.pitch ?? role.summary ?? basics.summary,
  stack: resume.now?.stack ?? [],
  highlights: (resume.now?.highlights ?? []).map(({title, text, icon}) => ({
    title,
    text,
    Icon: HIGHLIGHT_ICONS[icon] ?? SparklesIcon,
  })),
};

/**
 * Education
 */
export const education: TimelineItem[] = resume.education.map(item => ({
  date: formatRange(item.startDate, item.endDate),
  location: [item.institution, item.location].filter(Boolean).join(' — '),
  title: `${item.studyType} ${item.area}`,
  content: <p className="text-sm text-slate-300">{item.summary}</p>,
}));

/**
 * About section
 */
const year = (value?: string) => value?.slice(0, 4) ?? '';
const firstEducation = resume.education[0];

export const aboutData: About = {
  profileImageSrc: undefined,
  description: resume.about.join('\n\n') || basics.summary,
  aboutItems: [
    {label: 'Location', text: profile.location, Icon: MapIcon},
    {label: 'Current Role', text: `${role.position} — ${role.name}`, Icon: AcademicCapIcon},
    ...(firstEducation
      ? [
          {
            label: 'Education',
            text: `${firstEducation.studyType} ${firstEducation.area} (${[
              firstEducation.institution,
              [year(firstEducation.startDate), year(firstEducation.endDate)].filter(Boolean).join('–'),
            ]
              .filter(Boolean)
              .join(', ')})`,
            Icon: AcademicCapIcon,
          },
        ]
      : []),
    ...(resume.languages.length
      ? [
          {
            label: 'Languages',
            text: resume.languages
              .map(item => (languageLevel(item) === 5 ? `${item.language} (native)` : item.language))
              .join(' · '),
            Icon: MapIcon,
          },
        ]
      : []),
  ],
  hobbies: resume.interests,
};

/**
 * Skills
 */
export const skills: SkillGroup[] = resume.skills.map(group => ({name: group.name, skills: group.keywords}));

/**
 * Soft skills — shown as pills under the technology stack.
 */
export const softSkills = resume.softSkills;

/**
 * Languages
 */
export const languages: Language[] = resume.languages.map(item => ({name: item.language, level: item.fluency}));

/**
 * Projects — fetched from GitHub at build time unless `fromGithub: false` (src/lib/projects.ts).
 */
export const projectRepos: ProjectRepo[] = resume.projects.map(project => ({
  repo: project.repo,
  blurb: project.description,
  fromGithub: project.fromGithub,
  language: project.language,
  topics: project.topics,
  stars: project.stars,
  url: project.url,
  homepage: project.homepage,
  createdAt: project.startDate,
  pushedAt: project.updatedDate,
}));

/** "**Label:** rest" → <strong>Label:</strong> rest */
const withBold = (text: string): ReactNode =>
  text
    .split(/(\*\*[^*]+\*\*)/)
    .map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );

/**
 * Experience — newest company first; consecutive roles at one company are nested (LinkedIn-style).
 */
export const experience: CompanyExperience[] = resume.work.reduce<CompanyExperience[]>((companies, job) => {
  const position = {
    title: job.position,
    date: formatRange(job.startDate, job.endDate),
    content: job.highlights.length ? (
      <ul className="experience-list">
        {job.highlights.map(item => (
          <li key={item}>{withBold(item)}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-slate-300">{job.summary}</p>
    ),
    ...(job.keywords.length ? {tech: job.keywords} : {}),
  };
  const last = companies[companies.length - 1];
  if (last?.company === job.name) {
    last.positions.push(position);
    if (job.location && !last.locations.includes(job.location)) last.locations.push(job.location);
  } else {
    companies.push({company: job.name, locations: job.location ? [job.location] : [], positions: [position]});
  }
  return companies;
}, []);

/**
 * References
 */
export const references: Reference[] = resume.references.map(item => ({
  name: item.name,
  role: item.position,
  company: item.company ?? '',
  quote: item.reference,
  href: item.url,
}));

/** Brand icons for `basics.profiles[].network`; other networks still get a contact link. */
const NETWORKS: Record<string, {type?: ContactType; Icon?: Social['Icon']; label: string}> = {
  github: {type: ContactType.Github, Icon: GithubIcon, label: 'Github'},
  linkedin: {type: ContactType.LinkedIn, Icon: LinkedInIcon, label: 'LinkedIn'},
  twitter: {type: ContactType.Twitter, Icon: TwitterIcon, label: 'Twitter'},
  x: {type: ContactType.Twitter, Icon: TwitterIcon, label: 'X'},
  instagram: {type: ContactType.Instagram, Icon: InstagramIcon, label: 'Instagram'},
  facebook: {type: ContactType.Facebook, Icon: FacebookIcon, label: 'Facebook'},
  dribbble: {Icon: DribbbleIcon, label: 'Dribbble'},
  stackoverflow: {Icon: StackOverflowIcon, label: 'Stack Overflow'},
};

const networkOf = (name: string) => NETWORKS[name.toLowerCase().replace(/[^a-z]/g, '')];

/**
 * Contact section
 */
export const contact: ContactSection = {
  headerText: resume.contact.headline,
  description: resume.contact.message ?? '',
  items: [
    ...(basics.email ? [{type: ContactType.Email, text: basics.email, href: `mailto:${basics.email}`}] : []),
    ...(basics.phone
      ? [{type: ContactType.Phone, text: basics.phone, href: `tel:${basics.phone.replace(/[^+\d]/g, '')}`}]
      : []),
    ...basics.profiles.flatMap((item): ContactItem[] => {
      const type = networkOf(item.network)?.type;
      if (!type) return [];
      return [{type, text: type === ContactType.Github ? `@${item.username}` : item.username, href: item.url}];
    }),
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = basics.profiles.flatMap(item => {
  const network = networkOf(item.network);
  return network?.Icon ? [{label: network.label, Icon: network.Icon, href: item.url}] : [];
});
