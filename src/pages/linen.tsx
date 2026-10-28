import {Fraunces} from 'next/font/google';
import Head from 'next/head';
import {FC, memo, useEffect} from 'react';

import {frontOfficeManager as persona} from '../data/personas/front-office';
import LinenTheme from '../themes/linen';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

/** Preview of the Linen theme with a fictional hotel front office manager. */
const LinenDemo: FC = memo(() => {
  // swaps the page canvas (body background, scrollbar) to the theme's linen while this page is open
  useEffect(() => {
    const {classList} = document.documentElement;
    classList.add('theme-linen');
    return () => classList.remove('theme-linen');
  }, []);

  const title = `${persona.name} · ${persona.role}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={persona.summary} name="description" />
        <meta content={title} property="og:title" />
        <meta content={persona.summary} property="og:description" />
        <meta content="profile" property="og:type" />
      </Head>
      <div className={fraunces.variable}>
        <LinenTheme resume={persona} />
      </div>
    </>
  );
});

export default LinenDemo;
