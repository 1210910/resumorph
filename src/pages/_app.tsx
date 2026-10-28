import '../globalStyles.scss';

import type {AppProps} from 'next/app';
import {Inter, Space_Grotesk} from 'next/font/google';
import {useRouter} from 'next/router';
import {memo, useEffect} from 'react';

import CursorGlow from '../components/CursorGlow';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const SiteBackground = memo(function SiteBackground() {
  return (
    <>
      <div aria-hidden="true" className="site-background">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div aria-hidden="true" className="grid-overlay" />
    </>
  );
});

// theme previews paint their own canvas, so they skip the terminal theme's backdrop and cursor glow
const OWN_BACKDROP = ['/linen', '/hospitality'];

const MyApp = memo(({Component, pageProps}: AppProps): JSX.Element => {
  const {pathname} = useRouter();
  const terminalChrome = !OWN_BACKDROP.includes(pathname);

  // The mobile nav drawer renders through a Headless UI portal appended directly
  // to <body> — outside the root div below — so without this mirror it can't
  // resolve --font-inter / --font-space-grotesk and the whole drawer falls back
  // to the browser default font. next/font cannot live in _document (Next 14
  // forbids it there), so the variables are declared on the root div for SSR and
  // copied to <html> after hydration for anything portaled. `inter` /
  // `spaceGrotesk` are module-level constants, so the effect needs no deps.
  useEffect(() => {
    const {documentElement} = document;
    documentElement.classList.add(inter.variable, spaceGrotesk.variable);
    return () => documentElement.classList.remove(inter.variable, spaceGrotesk.variable);
  }, []);

  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
      {terminalChrome && <SiteBackground />}
      {terminalChrome && <CursorGlow />}
      <Component {...pageProps} />
    </div>
  );
});

MyApp.displayName = 'MyApp';
export default MyApp;
