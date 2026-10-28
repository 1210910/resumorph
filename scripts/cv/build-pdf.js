/* eslint-env node */
// Renders scripts/cv/ats.html to public/<profile.cvFileName>: one column, real text,
// standard headings, so applicant tracking systems parse it cleanly. Keep the output
// name in sync with `profile.cvFileName` in src/data/data.tsx.
// Run after editing the HTML: `npx playwright install chromium` once, then `node scripts/cv/build-pdf.js`.
const path = require('path');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${path.join(__dirname, 'ats.html')}`);
  await page.pdf({
    path: path.join(__dirname, '..', '..', 'public', 'Alex-Morgan-CV.pdf'),
    format: 'A4',
    preferCSSPageSize: true,
  });
  await browser.close();
})();
