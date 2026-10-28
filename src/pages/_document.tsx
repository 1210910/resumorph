import {Head, Html, Main, NextScript} from 'next/document';

import {appearanceScript} from '../components/ThemeToggle';

// next/document <Head /> vs next/head <Head />
//
// next/document Head is rendered once on the server. This is different from next/head which will
// rebuild the next/head fields each time it's called, and won't overwrite next/document's Head.
//
// Note: next/font cannot be declared here ("Cannot be used within pages/_document.js") — the
// fonts live in _app.tsx, which also mirrors their CSS variables onto <html> for portaled
// content (see the effect there).

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        {/* google translate breaks react:
          - https://github.com/facebook/react/issues/11538
          - https://bugs.chromium.org/p/chromium/issues/detail?id=872770 */}
        <meta content="notranslate" name="google" />
      </Head>
      <body>
        {/* light or dark before first paint: the visitor's choice, else the page's appearance meta */}
        <script dangerouslySetInnerHTML={{__html: appearanceScript}} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
