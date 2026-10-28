import {
  AcademicCapIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  CloudIcon,
  CpuChipIcon,
  EnvelopeIcon,
  MapIcon,
  ServerStackIcon,
} from '@heroicons/react/24/outline';

import GithubIcon from '../components/Icon/GithubIcon';
import LinkedInIcon from '../components/Icon/LinkedInIcon';
/**
 * Type-only imports from dataDef
 */
import {
  About,
  CompanyExperience,
  ContactSection,
  ContactType,
  Hero,
  HomepageMeta,
  Language,
  Now,
  Profile,
  ProjectRepo,
  Reference,
  SkillGroup,
  Social,
  TimelineItem,
} from './dataDef';

/**
 * Who this resume is about. Everything that names the person (header, hero, terminal
 * prompt, logo, footer, PDF file name, structured data) reads from here.
 * The demo persona is fictional: replace it with your own details.
 */
export const profile: Profile = {
  name: 'Alex Morgan',
  initials: 'am',
  handle: 'alex',
  role: 'Platform Engineer',
  location: 'Lisbon, Portugal',
  cvFileName: 'Alex-Morgan-CV.pdf',
};

/**
 * Page meta data — Web Resume (single-source data file)
 */
export const homePageMeta: HomepageMeta = {
  title: `${profile.name} — ${profile.role}`,
  description:
    'Platform Engineer building cloud-native infrastructure that lets product teams ship and run their services with confidence.',
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
export const cvPdf = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${profile.cvFileName}`;

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

/**
 * Now section — the current role, front and centre
 */
export const nowData: Now = {
  company: 'Acme Cloud',
  title: 'Platform Engineer',
  since: 'Mar 2024',
  pitch:
    'I build the internal platform product teams deploy on: they describe a service once, and the platform builds it, ships it through GitOps to Kubernetes, and provisions the cloud underneath as code.',
  stack: [
    {
      layer: 'Interface',
      role: 'Teams describe and track services',
      tools: ['Go', 'REST APIs', 'PostgreSQL'],
    },
    {
      layer: 'Delivery',
      role: 'Builds, releases and rollouts',
      tools: ['GitHub Actions', 'Argo CD', 'Helm'],
    },
    {layer: 'Runtime', role: 'Clusters and networking', tools: ['Kubernetes', 'Amazon EKS', 'Ingress NGINX']},
    {layer: 'Observability', role: 'Metrics, logs and alerts', tools: ['Prometheus', 'Grafana', 'Loki']},
    {
      layer: 'Foundation',
      role: 'Cloud and infrastructure as code',
      tools: ['AWS', 'Terraform'],
    },
  ],
  highlights: [
    {
      title: 'Self-service platform',
      text: 'A service catalogue that turns one YAML file into a running, monitored service.',
      Icon: ServerStackIcon,
    },
    {
      title: 'Reliable runtime',
      text: 'Multi-environment Kubernetes clusters with autoscaling and zero-downtime upgrades.',
      Icon: CpuChipIcon,
    },
    {
      title: 'GitOps delivery',
      text: 'Argo CD and GitHub Actions take every change from pull request to production.',
      Icon: ArrowPathIcon,
    },
    {
      title: 'Infrastructure as code',
      text: 'Reusable Terraform modules for networking, IAM, databases and storage.',
      Icon: CloudIcon,
    },
  ],
};

/**
 * About section
 */
export const aboutData: About = {
  profileImageSrc: undefined,
  description: `Platform Engineer who likes making the right thing the easy thing. I build self-service tooling on Kubernetes and AWS so product teams can ship without waiting on tickets, and I care about clear docs, boring deploys and good on-call nights. This is a fictional demo persona: replace it with your own story.`,
  aboutItems: [
    {label: 'Location', text: profile.location, Icon: MapIcon},
    {label: 'Current Role', text: `${nowData.title} — ${nowData.company}`, Icon: AcademicCapIcon},
    {
      label: 'Education',
      text: 'BSc Computer Science (Example University, 2016–2019)',
      Icon: AcademicCapIcon,
    },
    {label: 'Languages', text: 'English (native) · Portuguese · Spanish', Icon: MapIcon},
  ],
  hobbies: ['Climbing', 'Photography', 'Board games', 'Cooking'],
};

/**
 * Skills — single source of truth (update data.tsx to change the site).
 */
export const skills: SkillGroup[] = [
  {
    name: 'Cloud (AWS)',
    skills: ['Amazon EKS', 'EC2', 'IAM', 'S3', 'RDS', 'CloudFront'],
  },
  {
    name: 'Kubernetes & Platform',
    skills: ['Kubernetes', 'Helm', 'Docker', 'kubectl'],
  },
  {
    name: 'Delivery & GitOps',
    skills: ['Argo CD', 'GitHub Actions', 'GitOps'],
  },
  {
    name: 'Infrastructure as Code',
    skills: ['Terraform'],
  },
  {
    name: 'Observability',
    skills: ['Prometheus', 'Grafana', 'Loki', 'OpenTelemetry'],
  },
  {
    name: 'Languages',
    skills: ['Go', 'Python', 'Bash', 'TypeScript'],
  },
  {
    name: 'Databases',
    skills: ['PostgreSQL', 'Redis'],
  },
];

/**
 * Soft skills — shown as pills under the technology stack.
 */
export const softSkills = ['Communication', 'Mentoring', 'Ownership', 'Writing'];

/**
 * Languages
 */
export const languages: Language[] = [
  {name: 'English', level: 'Native'},
  {name: 'Portuguese', level: 'Fluent'},
  {name: 'Spanish', level: 'Conversational'},
];

/**
 * Projects — the repos to feature, in order. Name, description, language, topics and
 * stars are fetched from GitHub when the site builds (src/lib/projects.ts); `blurb`
 * fills in when a repo has no description. Projects that aren't public repos set
 * `fromGithub: false` and list their details by hand, like the demo ones below.
 */
export const projectRepos: ProjectRepo[] = [
  {
    repo: 'your-username/service-catalog',
    fromGithub: false,
    blurb: 'Demo project. One YAML file per service becomes a deployed, monitored service on Kubernetes.',
    language: 'Go',
    topics: ['kubernetes', 'platform-engineering', 'gitops'],
    stars: 128,
    createdAt: '2024-04-02',
    pushedAt: '2026-10-01',
  },
  {
    repo: 'your-username/terraform-aws-baseline',
    fromGithub: false,
    blurb: 'Demo project. Reusable Terraform modules for VPCs, IAM roles, RDS and S3 with sane defaults.',
    language: 'HCL',
    topics: ['terraform', 'aws', 'infrastructure-as-code'],
    stars: 54,
    createdAt: '2022-09-15',
    pushedAt: '2026-08-20',
  },
  {
    repo: 'your-username/kube-cost-report',
    fromGithub: false,
    blurb: 'Demo project. A weekly Slack report of Kubernetes spend per team, built from Prometheus metrics.',
    language: 'Python',
    topics: ['kubernetes', 'finops', 'prometheus'],
    stars: 23,
    createdAt: '2023-06-10',
    pushedAt: '2026-05-12',
  },
  {repo: '1210910/resumorph', blurb: 'This template: one resume file, many shapes.'},
];

/**
 * Education
 */
export const education: TimelineItem[] = [
  {
    date: '2016 – 2019',
    location: 'Example University — Lisbon, Portugal',
    title: 'BSc Computer Science',
    content: (
      <p className="text-sm text-slate-300">
        Distributed systems, networks and databases, with a final project on container scheduling.
      </p>
    ),
  },
];

/**
 * Experience — newest company first; multiple positions can be nested under one company (LinkedIn-style).
 */
export const experience: CompanyExperience[] = [
  {
    company: 'Acme Cloud',
    locations: ['Lisbon, Portugal'],
    positions: [
      {
        date: 'Mar 2024 – Present',
        title: 'Platform Engineer',
        content: (
          <ul className="experience-list">
            <li>
              <strong>Self-service platform:</strong> Built a service catalogue that turns one YAML file into a
              deployed, monitored service, cutting new-service setup from days to under an hour.
            </li>
            <li>
              <strong>Kubernetes:</strong> Run multi-environment EKS clusters with autoscaling, Helm-packaged platform
              components and zero-downtime upgrades.
            </li>
            <li>
              <strong>GitOps delivery:</strong> Moved every team to Argo CD and reusable GitHub Actions workflows, from
              pull request to production.
            </li>
            <li>
              <strong>Infrastructure as code:</strong> Maintain Terraform modules for networking, IAM, databases and
              storage, reviewed through plan diffs.
            </li>
          </ul>
        ),
        tech: ['Kubernetes', 'Amazon EKS', 'Helm', 'Argo CD', 'GitHub Actions', 'Terraform', 'Go', 'AWS'],
      },
    ],
  },
  {
    company: 'Globex',
    locations: ['Porto, Portugal'],
    positions: [
      {
        date: 'Sep 2021 – Feb 2024',
        title: 'DevOps Engineer',
        content: (
          <p className="text-sm text-slate-300">
            Containerised a monolith into a dozen services, set up CI/CD and on-call dashboards, and wrote the runbooks
            the team still uses.
          </p>
        ),
      },
      {
        date: 'Sep 2019 – Aug 2021',
        title: 'Junior Software Engineer',
        content: <p className="text-sm text-slate-300">Backend services in Python and Go for the billing team.</p>,
      },
    ],
  },
];

/**
 * References — the demo ones are fictional. On your own resume list real people only, with
 * their permission; leave the list empty and the section shows just the companies marquee.
 * Shape: {name, role, company, quote?, href?}
 */
export const references: Reference[] = [
  {
    name: 'Jordan Reyes',
    role: 'Head of Platform',
    company: 'Acme Cloud',
    quote:
      'Alex turned our deploy process from a two-day ticket queue into something teams do themselves before lunch. Calm in incidents and generous with their time.',
    href: 'mailto:jordan.reyes@example.com',
  },
  {
    name: 'Priya Natarajan',
    role: 'Engineering Manager',
    company: 'Globex',
    quote:
      'The runbooks and dashboards Alex built are still how we run on-call three years later. They make the people around them better engineers.',
  },
  {
    name: 'Sam Okafor',
    role: 'Senior Backend Engineer',
    company: 'Globex',
    quote: 'The person I ask first when something in production does not make sense.',
  },
];

/**
 * Contact section
 */
export const contact: ContactSection = {
  headerText: 'Get in touch.',
  description:
    "I'm always open to new opportunities, collaborations, or a chat about platform engineering. Drop me a line!",
  items: [
    {
      type: ContactType.Email,
      text: 'alex.morgan@example.com',
      href: 'mailto:alex.morgan@example.com',
    },
    {
      type: ContactType.Github,
      text: '@your-username',
      href: 'https://github.com/your-username',
    },
    {
      type: ContactType.LinkedIn,
      text: 'Alex Morgan',
      href: 'https://www.linkedin.com/in/your-profile/',
    },
  ],
};

/**
 * Social items
 */
export const socialLinks: Social[] = [
  {label: 'Github', Icon: GithubIcon, href: 'https://github.com/your-username'},
  {label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/your-profile/'},
];
