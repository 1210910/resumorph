import {Fraunces} from 'next/font/google';
import Head from 'next/head';
import {FC, memo, useEffect} from 'react';

import {hospitality} from '../data/personas/hospitality';
import HospitalityTheme from '../themes/hospitality';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

/** Preview of the Hospitality theme with a fictional hotel front office manager. */
const HospitalityDemo: FC = memo(() => {
  // swaps the page canvas (body background, scrollbar) to the theme's linen while this page is open
  useEffect(() => {
    const {classList} = document.documentElement;
    classList.add('theme-hospitality');
    return () => classList.remove('theme-hospitality');
  }, []);

  const title = `${hospitality.name} · ${hospitality.role}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={hospitality.summary} name="description" />
        <meta content={title} property="og:title" />
        <meta content={hospitality.summary} property="og:description" />
        <meta content="profile" property="og:type" />
      </Head>
      <div className={fraunces.variable}>
        <HospitalityTheme resume={hospitality} />
      </div>
    </>
  );
});

export default HospitalityDemo;
