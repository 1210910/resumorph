import {Newsreader} from 'next/font/google';
import Head from 'next/head';
import {CSSProperties, FC, memo, useEffect, useMemo} from 'react';

import {Resume} from '../../content';
import {toThemeView} from '../view';
import EditorialTheme from '.';

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const fontVars = {'--font-serif': newsreader.style.fontFamily} as CSSProperties;

/** A full page in the Editorial theme: fonts, meta tags and the paper page canvas. */
const EditorialPage: FC<{resume: Resume; demo?: boolean}> = memo(({resume, demo}) => {
  // swaps the page canvas (body background, scrollbar) to paper while this page is open
  useEffect(() => {
    const {classList} = document.documentElement;
    classList.add('theme-editorial');
    return () => classList.remove('theme-editorial');
  }, []);

  const view = useMemo(() => toThemeView(resume), [resume]);
  const title = `${view.name} · ${view.role}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={view.summary} name="description" />
        <meta content={title} property="og:title" />
        <meta content={view.summary} property="og:description" />
        <meta content="profile" property="og:type" />
      </Head>
      <div style={fontVars}>
        <EditorialTheme demo={demo} resume={view} />
      </div>
    </>
  );
});

export default EditorialPage;
