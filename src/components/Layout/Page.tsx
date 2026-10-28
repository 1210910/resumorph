import {NextPage} from 'next';
import Head from 'next/head';
import {memo, PropsWithChildren} from 'react';

import {aboutData, contact, heroData, homePageMeta, profile, skills, socialLinks} from '../../data/data';
import {ContactType, HomepageMeta} from '../../data/dataDef';

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || ''; // e.g. "https://yourname.github.io" — set via env at deploy time
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // must match next.config.js basePath (project sites deploy under /<repo>)

// schema.org Person — lets search engines show name, role and employer for the name on the resume
const currentRole = aboutData.aboutItems.find(item => item.label === 'Current Role')?.text ?? '';
const [jobTitle, employer] = currentRole.split(' — ');
// only a plain (unprotected) address goes into the structured data
const emailItem = contact.items.find(item => item.type === ContactType.Email);
const email = emailItem && !emailItem.secret ? emailItem.text : undefined;
const personJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: heroData.name,
  jobTitle,
  description: homePageMeta.description,
  ...(employer && {worksFor: {'@type': 'Organization', name: employer}}),
  address: {'@type': 'PostalAddress', addressLocality: profile.location},
  ...(email && {email: `mailto:${email}`}),
  knowsAbout: skills.slice(0, 5).flatMap(group => group.skills),
  sameAs: socialLinks.map(social => social.href),
  ...(SITE_BASE && {url: SITE_BASE}),
});

const Page: NextPage<PropsWithChildren<HomepageMeta>> = memo(({children, title, description}) => {
  const pathname = (typeof window !== 'undefined' && window.location.pathname) || '/';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        {/* opt out of AI training; robots.txt and Cloudflare do the actual blocking */}
        <meta content="noai, noimageai" name="robots" />

        <link href={`${SITE_BASE}${pathname}`} key="canonical" rel="canonical" />

        <link href={`${basePath}/favicon.ico`} rel="icon" sizes="any" />
        <link href={`${basePath}/favicon.svg`} rel="icon" type="image/svg+xml" />
        <link href={`${basePath}/apple-touch-icon.png`} rel="apple-touch-icon" />
        <link href={`${basePath}/site.webmanifest`} rel="manifest" />

        <meta content={title} property="og:title" />
        <meta content={description} property="og:description" />
        <meta content={`${SITE_BASE}${pathname}`} property="og:url" />
        <meta content="profile" property="og:type" />

        <meta content="summary" name="twitter:card" />
        <meta content={title} name="twitter:title" />
        <meta content={description} name="twitter:description" />

        <script dangerouslySetInnerHTML={{__html: personJsonLd}} key="person-jsonld" type="application/ld+json" />
      </Head>
      {children}
    </>
  );
});

Page.displayName = 'Page';
export default Page;
