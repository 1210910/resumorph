import {Fraunces} from 'next/font/google';
import Head from 'next/head';
import {CSSProperties, FC, memo, useEffect, useMemo} from 'react';

import {useAppearance} from '../../components/ThemeToggle';
import {Resume} from '../../content';
import {toThemeView} from '../view';
import LinenTheme from '.';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const fontVars = {'--font-serif': fraunces.style.fontFamily} as CSSProperties;

/** A full page in the Linen theme: fonts, meta tags and the linen page canvas. */
const LinenPage: FC<{resume: Resume; demo?: boolean}> = memo(({resume, demo}) => {
  // swaps the page canvas (body background, scrollbar) to the theme's linen while this page is open
  useEffect(() => {
    const {classList} = document.documentElement;
    classList.add('theme-linen');
    return () => classList.remove('theme-linen');
  }, []);

  useAppearance(resume.appearance);
  const view = useMemo(() => toThemeView(resume), [resume]);
  const title = `${view.name} · ${view.role}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={view.summary} name="description" />
        <meta content={resume.appearance} key="appearance" name="appearance" />
        <meta content="theme-linen" key="theme-class" name="theme-class" />
        <meta content={title} property="og:title" />
        <meta content={view.summary} property="og:description" />
        <meta content="profile" property="og:type" />
      </Head>
      <div style={fontVars}>
        <LinenTheme demo={demo} resume={view} />
      </div>
    </>
  );
});

export default LinenPage;
