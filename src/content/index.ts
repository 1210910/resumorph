import rawResume from '../../resume.yaml';
import {Resume, ResumeLanguage, ResumeSchema} from './schema';

export type {Resume, ResumeLanguage, ResumeWork} from './schema';

/**
 * Validates a parsed resume file. A mistake fails the build with a list of what to fix,
 * e.g. `work.0.startDate: use YYYY, YYYY-MM or YYYY-MM-DD, e.g. 2024-03`.
 */
export const parseResume = (raw: unknown, file = 'resume.yaml'): Resume => {
  const result = ResumeSchema.safeParse(raw);
  if (result.success) return result.data;
  const problems = result.error.issues.map(issue => `  - ${issue.path.join('.') || '(top level)'}: ${issue.message}`);
  throw new Error(`${file} has ${problems.length} problem(s):\n${problems.join('\n')}`);
};

/** The site's resume: resume.yaml at the root of the repo. */
export const resume = parseResume(rawResume);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-03" → "Mar 2024", "2024" → "2024". */
export const formatDate = (value: string) => {
  const [year, month] = value.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
};

/** "Mar 2024 – Present", "2016 – 2019"; an empty string when there is no start. */
export const formatRange = (start?: string, end?: string, present = 'Present') =>
  start ? `${formatDate(start)} – ${end ? formatDate(end) : present}` : end ? formatDate(end) : '';

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .filter((_, index, all) => index === 0 || index === all.length - 1)
    .join('');

/** 1–5 for themes that draw language levels; guessed from the fluency text when not set. */
export const languageLevel = ({level, fluency}: ResumeLanguage): number => {
  if (level) return level;
  const text = fluency.toLowerCase();
  if (/native|mother/.test(text)) return 5;
  if (/c2|c1|fluent|proficien/.test(text)) return 4;
  if (/b2|b1|intermediate|conversational|professional/.test(text)) return 3;
  if (/a2|elementary/.test(text)) return 2;
  return 1;
};

/** "Lisbon, Portugal" */
export const locationOf = ({location}: Resume['basics']) =>
  [location.city, location.region, location.country].filter(Boolean).join(', ');

/** The role with no end date, or the newest one. */
export const currentRole = ({work}: Resume) => work.find(job => !job.endDate) ?? work[0];
