/* eslint-env node */
// Sitemap config — unused when output is "export" since next-sitemap runs on a server.
// To use it, disable `output: 'export'` in next.config.js and set your real URL below.
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourname.github.io',
  exclude: ['/404*', '/500*'],
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: path === '/' ? 1 : config.priority,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  }),
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {userAgent: '*', allow: '/'},
      {userAgent: '*', disallow: ['/404', '/500']},
    ],
  },
};
