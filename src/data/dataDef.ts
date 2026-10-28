import {FC, ForwardRefExoticComponent, SVGProps} from 'react';

import {IconProps} from '../components/Icon/Icon';

export interface HomepageMeta {
  title: string;
  description: string;
  ogImageUrl?: string;
  twitterCardType?: 'summary' | 'summary_large';
  twitterTitle?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterDomain?: string;
  twitterUrl?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
}

/**
 * The person the resume is about
 */
export interface Profile {
  name: string;
  /** One to three letters for the logo and the photo placeholder, e.g. "am". */
  initials: string;
  /** Lowercase username for the terminal prompt, e.g. "alex" → alex@platform:~$ */
  handle: string;
  role: string;
  location: string;
  /** URL of the photo in public/ (from `basics.image`); without one the hero shows the initials. */
  photo?: string;
  /** The PDF in public/ that the "Download CV" button serves. */
  cvFileName: string;
}

/**
 * Hero section
 */
export interface Hero {
  name: string;
  actions: HeroActionItem[];
}

interface HeroActionItem {
  href: string;
  text: string;
  primary?: boolean;
  /** Download the target instead of navigating (e.g. the PDF CV). */
  download?: boolean;
  Icon?: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>;
}

/**
 * About section
 */
export interface About {
  profileImageSrc?: string;
  description: string;
  aboutItems: AboutItem[];
  /** Short list of interests / hobbies, rendered as pills below the about items */
  hobbies?: string[];
}

export interface AboutItem {
  label: string;
  text: string;
  Icon?: React.FC | ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>;
}

/**
 * Stat section
 */
export interface Stat {
  title: string;
  value: number;
  Icon?: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>;
}

/**
 * Skills section
 */

export interface Skill {
  name: string;
  level: number;
  max?: number;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

/**
 * Projects section — repos are listed by hand, GitHub supplies the facts at build time
 */
export interface ProjectRepo {
  /** "owner/name" on GitHub */
  repo: string;
  /** Used when the repo has no GitHub description (or to override it). */
  blurb?: string;
  /**
   * Fetch live details (description, language, topics, stars, dates) from GitHub at build
   * time. Defaults to true; set false for a project that isn't a public repo, and fill in
   * the fields below by hand.
   */
  fromGithub?: boolean;
  language?: string;
  topics?: string[];
  stars?: number;
  /** Link for the project name; defaults to https://github.com/<repo>. */
  url?: string;
  homepage?: string;
  /** ISO date, e.g. "2024-05-01". */
  createdAt?: string;
  /** ISO date of the last update. */
  pushedAt?: string;
}

export interface Project {
  name: string;
  repo: string;
  url: string;
  description: string;
  language: string | null;
  topics: string[];
  stars: number;
  homepage: string | null;
  createdAt: string | null;
  pushedAt: string | null;
}

/**
 * Resume section
 */
export interface TimelineItem {
  date: string;
  location: string;
  title: string;
  content: JSX.Element;
}

/**
 * A single role held at a company (LinkedIn-style: multiple positions can live under one company).
 */
export interface CompanyPosition {
  title: string;
  /** Human-readable range, e.g. "Mar 2025 – Oct 2025". */
  date: string;
  content: JSX.Element;
  /** Key technologies for this role, shown as compact tags under the bullets. */
  tech?: string[];
}

/**
 * "Now" section — what the current role builds, as a platform stack plus highlights.
 */
export interface NowLayer {
  /** Short layer name, e.g. "Orchestration". */
  layer: string;
  /** What this layer does, in a few words. */
  role: string;
  tools: string[];
}

export interface NowHighlight {
  title: string;
  text: string;
  Icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>;
}

export interface Now {
  company: string;
  title: string;
  since: string;
  /** One-paragraph pitch of the current role. */
  pitch: string;
  /** Platform layers, top (what users touch) to bottom (foundation). */
  stack: NowLayer[];
  highlights: NowHighlight[];
}

/**
 * A company with its location(s) and the (newest-first) list of positions held there.
 */
export interface CompanyExperience {
  company: string;
  /** All locations worked at this company, deduplicated (e.g. ['Porto, Portugal']). */
  locations: string[];
  positions: CompanyPosition[];
}

/**
 * References section — people who can vouch for you (edit in data.tsx)
 */
export interface Reference {
  name: string;
  role: string;
  company: string;
  quote?: string;
  href?: string;
}

/**
 * Languages — name + proficiency level label
 */
export interface Language {
  name: string;
  level: string;
}

/**
 * Contact section
 */
export interface ContactSection {
  headerText?: string;
  description: string;
  items: ContactItem[];
}

export const ContactType = {
  Email: 'Email',
  Phone: 'Phone',
  Location: 'Location',
  Github: 'Github',
  LinkedIn: 'LinkedIn',
  Facebook: 'Facebook',
  Twitter: 'Twitter',
  Instagram: 'Instagram',
} as const;

export type ContactType = (typeof ContactType)[keyof typeof ContactType];

export interface ContactItem {
  type: ContactType;
  text: string;
  href?: string;
}

export interface ContactValue {
  Icon: FC<IconProps> | ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, 'ref'>>;
  srLabel: string;
}

/**
 * Social items
 */
export interface Social {
  label: string;
  Icon: FC<IconProps>;
  href: string;
}
