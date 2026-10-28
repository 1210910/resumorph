/**
 * Hospitality demo persona — a fictional front office and guest experience manager.
 *
 * Feeds the Hospitality theme preview at /hospitality. Plain data, no JSX, so it can
 * move to the YAML resume file without changes to its shape. Every name, hotel and
 * number here is made up.
 */

export interface HospitalityStat {
  value: string;
  label: string;
}

export interface HospitalityRole {
  title: string;
  property: string;
  /** e.g. "5-star resort · 212 rooms" */
  detail: string;
  location: string;
  date: string;
  highlights: string[];
}

export interface HospitalitySkillGroup {
  name: string;
  skills: string[];
}

export interface HospitalityLanguage {
  name: string;
  level: string;
  /** 1 (basic) to 5 (native), drawn as dots */
  score: 1 | 2 | 3 | 4 | 5;
}

export interface HospitalityCredential {
  title: string;
  issuer: string;
  year: string;
}

export interface HospitalityReference {
  quote: string;
  name: string;
  role: string;
}

export interface HospitalityResume {
  name: string;
  initials: string;
  role: string;
  location: string;
  availability: string;
  summary: string;
  about: string[];
  stats: HospitalityStat[];
  experience: HospitalityRole[];
  skills: HospitalitySkillGroup[];
  languages: HospitalityLanguage[];
  credentials: HospitalityCredential[];
  education: HospitalityCredential[];
  references: HospitalityReference[];
  email: string;
  linkedin: string;
}

export const hospitality: HospitalityResume = {
  name: 'Inês Carvalho',
  initials: 'IC',
  role: 'Front Office & Guest Experience Manager',
  location: 'Porto, Portugal',
  availability: 'Open to new roles from January',
  summary:
    'Nine years at the front desk of city hotels and resorts, from night auditor to running a team of 18. I turn arrival into the part of the stay guests talk about.',
  about: [
    'I started on night shifts at a family-run guesthouse in the Douro valley and have worked my way through reception, reservations and guest relations at four properties since. Today I lead the front office of a 160-room design hotel in Porto.',
    'I care about the details guests notice and the ones they never see: a smooth check-in, a room that is ready on time, a complaint that turns into a five-star review. I train teams to own those moments, and I use the numbers (occupancy, upsell, review scores) to see what is working.',
  ],
  stats: [
    {value: '9', label: 'years in hotels'},
    {value: '4.8', label: 'average guest rating'},
    {value: '18', label: 'people in my team'},
    {value: '5', label: 'languages spoken'},
  ],
  experience: [
    {
      title: 'Front Office & Guest Experience Manager',
      property: 'Hotel Ribeira Azul',
      detail: '4-star design hotel · 160 rooms',
      location: 'Porto, Portugal',
      date: 'Apr 2022 – Present',
      highlights: [
        'Lead reception, concierge and guest relations, a team of 18 across three shifts.',
        'Raised the average review score from 4.4 to 4.8 in two years by redesigning arrival and follow-up.',
        'Launched a pre-arrival upsell programme that now brings in 9% of room revenue.',
        'Moved the hotel from a legacy PMS to Mews with no lost reservations.',
      ],
    },
    {
      title: 'Guest Relations Supervisor',
      property: 'Quinta do Mar Resort & Spa',
      detail: '5-star resort · 212 rooms',
      location: 'Lagos, Algarve',
      date: 'Mar 2019 – Mar 2022',
      highlights: [
        'Looked after VIP and repeat guests, weddings and corporate groups of up to 120 people.',
        'Built the resort’s first guest-recovery playbook, halving open complaints at checkout.',
        'Trained seasonal reception staff each spring on service standards and Opera PMS.',
      ],
    },
    {
      title: 'Receptionist, then Reservations Agent',
      property: 'Lisbon Gardens Hotel',
      detail: '4-star city hotel · 98 rooms',
      location: 'Lisbon, Portugal',
      date: 'Jun 2017 – Feb 2019',
      highlights: [
        'Handled check-in, check-out and phone and email reservations in four languages.',
        'Promoted to reservations after one year; managed group blocks and OTA rate parity.',
      ],
    },
    {
      title: 'Night Auditor',
      property: 'Casa do Vale Guesthouse',
      detail: 'Family-run guesthouse · 14 rooms',
      location: 'Douro Valley, Portugal',
      date: 'Jul 2016 – May 2017',
      highlights: ['Ran the night shift alone: audit, late arrivals, breakfast set-up and the odd emergency.'],
    },
  ],
  skills: [
    {
      name: 'Guest experience',
      skills: ['VIP and repeat guests', 'Complaint recovery', 'Concierge', 'Events and groups', 'Online reviews'],
    },
    {
      name: 'Operations',
      skills: ['Team leadership', 'Shift planning', 'Training', 'Upselling', 'Budgeting', 'Housekeeping liaison'],
    },
    {
      name: 'Systems',
      skills: ['Mews', 'Oracle Opera PMS', 'SiteMinder', 'Booking.com Extranet', 'Revinate', 'Excel'],
    },
  ],
  languages: [
    {name: 'Portuguese', level: 'Native', score: 5},
    {name: 'English', level: 'Fluent (C1)', score: 4},
    {name: 'Spanish', level: 'Fluent (C1)', score: 4},
    {name: 'French', level: 'Intermediate (B2)', score: 3},
    {name: 'German', level: 'Basic (A2)', score: 2},
  ],
  credentials: [
    {title: 'Certified Front Desk Manager', issuer: 'Example Hospitality Institute', year: '2023'},
    {title: 'Revenue Management Essentials', issuer: 'Example Online Academy', year: '2021'},
    {title: 'First Aid at Work', issuer: 'Example Red Cross', year: '2024'},
  ],
  education: [
    {title: 'BA in Hotel Management', issuer: 'Example School of Hospitality and Tourism', year: '2013 – 2016'},
  ],
  references: [
    {
      quote:
        'Inês is the reason our arrival scores went up. Guests mention her team by name, and she knows every one of them.',
      name: 'Rui Teixeira',
      role: 'General Manager, Hotel Ribeira Azul',
    },
    {
      quote:
        'Calm in a full house, generous with her team and relentless about details. I would hire her again tomorrow.',
      name: 'Claire Dubois',
      role: 'Director of Rooms, Quinta do Mar Resort & Spa',
    },
  ],
  email: 'ines.carvalho@example.com',
  linkedin: 'https://www.linkedin.com/in/your-profile/',
};
