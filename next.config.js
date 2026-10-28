/* eslint-env node */

// Next.js config. output='export' produces a static site suitable for GitHub Pages / Netlify / Vercel — no server required at runtime.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // set NEXT_PUBLIC_BASE_PATH='/<repo-name>' for a project site, e.g. '/resumorph'

  images: {
    unoptimized: true, // static export has no image-optimization server; next/image falls back to <img> instead
  },

  poweredByHeader: false,
};

module.exports = nextConfig;
