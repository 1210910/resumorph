import {z} from 'zod';

/**
 * The shape of resume.yaml. It follows JSON Resume (https://jsonresume.org/schema) where
 * it can — basics, work, education, skills, languages, certificates, projects, references —
 * and adds a few fields the themes need (theme, initials, stats, now, contact copy).
 *
 * Every theme reads the same file; sections a theme doesn't use are simply ignored.
 */

/** "2024", "2024-03" or "2024-03-15". Leave endDate out for a current role. */
const date = z
  .union([z.string(), z.number()])
  .transform(String)
  .refine(value => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(value), {
    message: 'use YYYY, YYYY-MM or YYYY-MM-DD, e.g. 2024-03',
  });

const text = z.string().trim().min(1);

/** Email or phone after the YAML loader has encoded it (privacy.hideContactDetails). */
const encoded = z.object({encoded: z.array(z.number().int())});

const profile = z.object({
  /** GitHub, LinkedIn, X, Instagram, Facebook, Dribbble, Stack Overflow, or any other name. */
  network: text,
  username: text,
  url: z.string().url(),
});

const work = z.object({
  /** Company, hotel, restaurant… */
  name: text,
  position: text,
  location: text.optional(),
  /** One line about the place, e.g. "4-star design hotel · 160 rooms". */
  description: text.optional(),
  startDate: date,
  endDate: date.optional(),
  /** A short paragraph, shown when there are no highlights. */
  summary: text.optional(),
  /** Bullet points. Start one with **Bold label:** to highlight it. */
  highlights: z.array(text).default([]),
  /** Tools or skills used in this role, shown as tags. */
  keywords: z.array(text).default([]),
});

const education = z.object({
  institution: text,
  /** e.g. "Computer Science" */
  area: text,
  /** e.g. "BSc", "BA", "Master's" */
  studyType: text,
  location: text.optional(),
  startDate: date.optional(),
  endDate: date.optional(),
  summary: text.optional(),
});

const skillGroup = z.object({
  name: text,
  keywords: z.array(text).min(1),
});

const language = z.object({
  language: text,
  /** Free text, e.g. "Native", "Fluent (C1)". */
  fluency: text,
  /** 1 (basic) to 5 (native). Themes that draw levels use it; defaults from the fluency text. */
  level: z.number().int().min(1).max(5).optional(),
});

const certificate = z.object({
  name: text,
  issuer: text,
  date: date.optional(),
  url: z.string().url().optional(),
});

const project = z.object({
  /** "owner/name" on GitHub. */
  repo: text,
  /** Used when the repo has no GitHub description (or to override it). */
  description: text.optional(),
  /** Fetch description, language, topics and stars from GitHub at build time. Defaults to true. */
  fromGithub: z.boolean().default(true),
  language: text.optional(),
  topics: z.array(text).optional(),
  stars: z.number().int().min(0).optional(),
  url: z.string().url().optional(),
  homepage: z.string().url().optional(),
  startDate: date.optional(),
  /** Date of the last update. */
  updatedDate: date.optional(),
});

const reference = z.object({
  name: text,
  /** Their job title. */
  position: text,
  company: text.optional(),
  /** What they say about you. */
  reference: text.optional(),
  /** A link or mailto: for the name. */
  url: z.string().optional(),
});

const nowSection = z.object({
  /** One paragraph on what your current role builds or delivers. */
  pitch: text,
  /** Layers of what you work on, top (what people touch) to bottom (the foundation). */
  stack: z.array(z.object({layer: text, role: text, tools: z.array(text)})).default([]),
  highlights: z
    .array(
      z.object({
        title: text,
        text,
        /** server, chip, cycle, cloud, chart, shield, users, sparkles, globe, star, briefcase, code */
        icon: text.default('sparkles'),
      }),
    )
    .default([]),
});

export const ResumeSchema = z.object({
  /** Which look the site uses: terminal (dark, animated, for tech roles) or linen (warm, serif). */
  theme: z.enum(['terminal', 'linen']).default('terminal'),

  basics: z.object({
    name: text,
    /** Job title, e.g. "Platform Engineer". */
    label: text,
    /** One to three letters for the logo and photo placeholder. Defaults to the name's initials. */
    initials: text.max(3).optional(),
    /** Lowercase username for the terminal prompt. Defaults to the first name. */
    handle: text.optional(),
    email: z.union([z.string().email(), encoded]).optional(),
    phone: z.union([text, encoded]).optional(),
    url: z.string().url().optional(),
    /** One or two sentences: who you are and what you do. Used in the hero and for search engines. */
    summary: text,
    location: z.object({city: text, region: text.optional(), country: text}),
    /** A short status line, e.g. "Open to new roles from January". */
    availability: text.optional(),
    /** Image in public/, e.g. "photo.jpg". Without one the hero shows your initials. */
    image: text.optional(),
    /** The PDF in public/ that "Download CV" serves. */
    cvFile: text.optional(),
    profiles: z.array(profile).default([]),
  }),

  /** Longer story, one string per paragraph. */
  about: z.array(text).default([]),
  /** A few numbers that sum you up, e.g. {value: "9", label: "years in hotels"}. */
  stats: z.array(z.object({value: text, label: text})).default([]),
  /** The current role in more depth (terminal theme). */
  now: nowSection.optional(),

  work: z.array(work).min(1, 'add at least one entry under work'),
  education: z.array(education).default([]),
  skills: z.array(skillGroup).default([]),
  /** People skills, e.g. Communication, Mentoring. */
  softSkills: z.array(text).default([]),
  languages: z.array(language).default([]),
  certificates: z.array(certificate).default([]),
  /** Hobbies and interests. */
  interests: z.array(text).default([]),
  projects: z.array(project).default([]),
  /** Real people only, with their permission. */
  references: z.array(reference).default([]),

  contact: z
    .object({
      headline: text.default('Get in touch.'),
      message: text.optional(),
    })
    .default({}),

  privacy: z
    .object({
      /**
       * Keep email and phone out of the published site: they are stored encoded (by
       * scripts/yaml-loader.js) and shown only when a visitor clicks "Show email".
       * Stops simple scrapers; on by default.
       */
      hideContactDetails: z.boolean().default(true),
    })
    .default({}),

  /** Section headings for themes that show them (linen). */
  titles: z
    .object({
      about: text.optional(),
      experience: text.optional(),
      skills: text.optional(),
      references: text.optional(),
    })
    .default({}),
});

export type Resume = z.infer<typeof ResumeSchema>;
export type ResumeWork = Resume['work'][number];
export type ResumeLanguage = Resume['languages'][number];
