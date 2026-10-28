#!/usr/bin/env node
/**
 * Whole-site Playwright QA for the static export (this model has no image input —
 * this script is the programmatic gate: DOM assertions + console/network capture;
 * the screenshots it writes are for the human to eyeball).
 *
 * Usage:
 *   npx serve out -l 3210 &                 # 1. deploy the static export locally
 *   node scripts/qa-playwright.mjs          # 2. run the suite
 *
 * Flags: --url <base> (default http://localhost:3210)   --out <dir> (default qa-screenshots)
 * Exit 0 = all checks green. Prints a JSON summary at the end.
 *
 * Gotcha handled: elements animated by Reveal (0.7s transform) confuse Playwright's
 * hover actionability check while the bounding box is still moving — hover() then
 * performs an unneeded scrollIntoView and the pointer ends up off-target. Every
 * hover assertion therefore settles the element's rect first (settleBelow).
 */
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {chromium} from 'playwright';

const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const BASE = arg('--url', 'http://localhost:3210').replace(/\/$/, '');
const OUT = arg('--out', 'qa-screenshots');
mkdirSync(OUT, {recursive: true});

const checks = [];
const pass = name => checks.push({name, ok: true});
const fail = (name, detail) => checks.push({name, ok: false, detail});
const expect = (name, cond, detail = '') => (cond ? pass(name) : fail(name, detail));

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
const attach = page => {
  page.on('console', m => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('requestfailed', r => failedRequests.push(`${r.method()} ${r.url()} — ${r.failure()?.errorText ?? 'unknown'}`));
  page.on('response', r => {
    if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`);
  });
};

const HOVER_SETTLE = 700; // 500ms transitions + margin

/** Wait until the element's bounding box is stable across frames (Reveal transforms settle). */
const settle = async (page, locator, timeoutMs = 6000) => {
  await page.waitForTimeout(50);
  let last = '';
  let stable = 0;
  const started = Date.now();
  while (stable < 3 && Date.now() - started < timeoutMs) {
    const rect = await locator.evaluate(el => {
      const r = el.getBoundingClientRect();
      return `${r.x.toFixed(1)},${r.y.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)}`;
    });
    stable = rect === last ? stable + 1 : 0;
    last = rect;
    await page.waitForTimeout(120);
  }
};

/**
 * Hover the element, then read the Spotlit lit-layer opacity (the direct
 * aria-hidden overlay child), and the opacity again after the pointer leaves.
 *
 * The lit layer is a SIBLING of the base copy, not a restyle of it — the base
 * element's `color` never changes (verified: h1 stays rgb(255,255,255), section
 * titles stay rgb(244,244,241)), so asserting on the base color would fail by
 * design. The lit layer's opacity IS the dynamic signal: `--spot-o` goes 1 while
 * the pointer is near and 0 once it leaves (0.35s fade).
 */
const hoverThenSpotlit = async (page, locator) => {
  const litOpacity = () =>
    locator.evaluate(el => {
      const lit = el.querySelector(':scope > span[aria-hidden="true"]');
      return lit ? Number(getComputedStyle(lit).opacity) : -1;
    });
  await settle(page, locator);
  await locator.hover();
  await page.waitForTimeout(HOVER_SETTLE);
  const on = await litOpacity();
  await page.mouse.move(10, 10);
  await page.waitForTimeout(HOVER_SETTLE);
  const off = await litOpacity();
  return {on, off};
};

const browser = await chromium.launch();

/* ── 1. Desktop pass ─────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const page = await ctx.newPage();
  attach(page);

  await page.goto(`${BASE}/`, {waitUntil: 'networkidle'});

  const h1Text = (await page.textContent('h1')) ?? '';
  expect('hero name renders', h1Text.trim().split(/\s+/).length >= 2, `got: ${h1Text.trim()}`);

  const avatar = page.locator('img[alt^="Portrait"]');
  expect('hero avatar renders', (await avatar.count()) === 1 && (await avatar.evaluate(el => el.naturalWidth) > 0));

  // Task 4: hover cross-fade — photo out, terminal-wireframe SVG in.
  // Hover the container (not the img): the stacked overlay intercepts pointer events at opacity 0,
  // and settle() is required first (see gotcha in header).
  const avatarBox = page.locator('div.group:has(img[alt^="Portrait"])');
  const overlay = avatarBox.locator('svg');
  await settle(page, avatarBox);
  const before = await overlay.evaluate(el => getComputedStyle(el).opacity);
  await avatarBox.hover();
  await page.waitForTimeout(HOVER_SETTLE);
  const after = await overlay.evaluate(el => getComputedStyle(el).opacity);
  expect('hero avatar hover cross-fades to overlay', Number(before) < 0.01 && Number(after) > 0.99, `before=${before} after=${after}`);
  await page.screenshot({path: join(OUT, 'playwright-desktop-hero-hover.png')});
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(10, 10);
  await page.waitForTimeout(HOVER_SETTLE);

  // Task 5: cursor spotlight on the big display type — lit copy (colors swapped)
  // fades in under the pointer, fades out again once it leaves
  const h1 = page.locator('h1');
  const heroSpot = await hoverThenSpotlit(page, h1);
  expect('hero name hover shifts to accent', heroSpot.on > 0.99 && heroSpot.off < 0.01, `on=${heroSpot.on} off=${heroSpot.off}`);
  await page.screenshot({path: join(OUT, 'playwright-desktop-hero-name-hover.png')});
  await page.mouse.move(10, 10);
  await page.waitForTimeout(HOVER_SETTLE);

  await page.screenshot({path: join(OUT, 'playwright-desktop-top.png')});

  // every section + its big title, and the shared-class hover shift
  const sectionIds = ['about', 'resume', 'references', 'portfolio', 'contact'];
  for (const id of sectionIds) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // reveal transitions
    const title = page.locator(`#${id} h2.section-title`);
    expect(`#${id} section + title render`, (await page.locator(`#${id}`).count()) === 1 && (await title.count()) >= 1);
    if ((await title.count()) >= 1) {
      const spot = await hoverThenSpotlit(page, title.first());
      expect(`#${id} title hover shifts to accent`, spot.on > 0.99 && spot.off < 0.01, `on=${spot.on} off=${spot.off}`);
      await page.mouse.move(10, 10);
      await page.waitForTimeout(HOVER_SETTLE);
    }
    await page.screenshot({path: join(OUT, `playwright-desktop-${id}.png`)});
  }

  // The footer is the link columns + legal row + back-to-top — no statement block by design
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800); // reveal transitions
  const footerPageLinks = page.locator('footer nav[aria-label="Footer"] a');
  const colHeadings = await page.locator('footer h3').allTextContents();
  expect(
    'footer renders the three link columns',
    (await footerPageLinks.count()) >= 5 && colHeadings.includes('pages') && colHeadings.includes('follow on') && colHeadings.includes('contact'),
    `links=${await footerPageLinks.count()} headings=${JSON.stringify(colHeadings)}`,
  );
  expect('footer has no statement block', (await page.locator('footer h2').count()) === 0);
  expect(
    'footer legal row + back-to-top render',
    (await page.locator('footer a[aria-label="Back to top"]').count()) === 1 && ((await page.locator('footer').textContent()) ?? '').includes('All rights reserved'),
  );
  await page.screenshot({path: join(OUT, 'playwright-desktop-footer.png')});
  await page.screenshot({fullPage: true, path: join(OUT, 'playwright-desktop-full.png')});

  await ctx.close();
}

/* ── 2. Mobile pass ───────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({viewport: {width: 375, height: 812}, isMobile: true, hasTouch: true});
  const page = await ctx.newPage();
  attach(page);
  await page.goto(`${BASE}/`, {waitUntil: 'networkidle'});
  await page.waitForTimeout(600);
  await page.screenshot({path: join(OUT, 'playwright-mobile-top.png')});

  await page.click('[aria-label="Open navigation menu"]');
  await page.waitForTimeout(500);
  expect('mobile nav drawer opens', await page.locator('#mobile-nav').isVisible());
  await page.screenshot({path: join(OUT, 'playwright-mobile-nav.png')});

  // drawer nav labels inherit the site body font (Inter) — same voice as the desktop pill nav.
  // Both labels and the hero description inherit the same font chain, so a diverging
  // display-font class on the labels would show up as a different computed family.
  const [labelFont, bodyCopyFont] = await page.evaluate(() => {
    const label = document.querySelector('#mobile-nav nav[aria-label="Mobile"] a span:nth-of-type(2)');
    const bodyCopy = document.querySelector('#hero p');
    return label && bodyCopy ? [getComputedStyle(label).fontFamily, getComputedStyle(bodyCopy).fontFamily] : [null, null];
  });
  expect('mobile nav labels use the site body font', labelFont !== null && labelFont === bodyCopyFont, `label=${labelFont} bodyCopy=${bodyCopyFont}`);

  await page.click('[aria-label="Close navigation menu"]');
  await page.waitForTimeout(500);

  // finger version of the cursor spotlight: a tap on the hero name lights the lit
  // copy, which lingers a beat after release, then fades out
  const h1 = page.locator('h1');
  await h1.scrollIntoViewIfNeeded();
  await settle(page, h1);
  const litOpacity = () =>
    h1.evaluate(el => {
      const lit = el.querySelector(':scope > span[aria-hidden="true"]');
      return lit ? Number(getComputedStyle(lit).opacity) : -1;
    });
  await h1.tap();
  // a tap fires pointerdown+pointerup almost together, so the 500ms release-linger
  // starts immediately — sample the lit layer at 300ms, while the 350ms fade-in has
  // landed but before the linger flips --spot-o back to 0
  await page.waitForTimeout(300);
  const litOn = await litOpacity();
  await page.waitForTimeout(1300); // linger + 350ms fade-out + margin
  const litOff = await litOpacity();
  expect('hero name lights up under a finger tap', litOn > 0.8, `on=${litOn}`);
  expect('hero name fades after the finger lifts', litOff < 0.1, `off=${litOff}`);

  // finger version of the cursor glow: the full-viewport wash fades in while the
  // finger is down and eases back out after release — nothing lingers on the page
  const cdp = await ctx.newCDPSession(page);
  const glowOpacity = () =>
    page.evaluate(() => {
      const el = document.querySelector('div[style*="blur(100px)"]');
      return el ? Number(getComputedStyle(el).opacity) : -1;
    });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const glowBefore = await glowOpacity();
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 60, y: 700}]});
  await page.waitForTimeout(700); // eased in toward 0.2
  const glowMid = await glowOpacity();
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await page.waitForTimeout(1200); // eased back out toward 0
  const glowAfter = await glowOpacity();
  expect('cursor glow follows the finger', glowBefore < 0.05 && glowMid > 0.12, `before=${glowBefore} mid=${glowMid}`);
  expect('cursor glow fades out after the finger lifts', glowAfter < 0.05, `after=${glowAfter}`);
  await page.screenshot({path: join(OUT, 'playwright-mobile-full.png')});

  await ctx.close();
}

/* ── 3. Reduced-motion pass ───────────────────────────────────────── */
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
  const page = await ctx.newPage();
  attach(page);
  await page.goto(`${BASE}/`, {waitUntil: 'networkidle'});
  await page.waitForTimeout(600);
  expect('page renders under prefers-reduced-motion', (await page.textContent('h1')) !== null);

  // the cursor spotlight must stay dormant under reduced motion — the lit layer
  // never turns on (`--spot-o` unset → opacity falls back to 0)
  const h1 = page.locator('h1');
  await h1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await h1.hover().catch(() => {});
  await page.waitForTimeout(700);
  const litOpacity = await h1.evaluate(el => {
    const lit = el.querySelector(':scope > span[aria-hidden="true"]');
    return lit ? Number(getComputedStyle(lit).opacity) : 0;
  });
  expect('spotlit dormant under prefers-reduced-motion', litOpacity === 0, `lit opacity=${litOpacity}`);

  // the cursor glow must stay dormant under reduced motion — even a touch never lights it
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: 400, y: 300}]});
  await page.waitForTimeout(600);
  const glowOpacity = await page.evaluate(() => {
    const el = document.querySelector('div[style*="blur(100px)"]');
    return el ? Number(getComputedStyle(el).opacity) : 0;
  });
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  expect('cursor glow dormant under prefers-reduced-motion', glowOpacity < 0.01, `glow opacity=${glowOpacity}`);
  await page.screenshot({fullPage: true, path: join(OUT, 'playwright-reduced-motion-full.png')});
  await ctx.close();
}

/* ── 4. 404 route (intentional — its console/network 404s are excluded below) ── */
const probeUrl = `${BASE}/definitely-missing-route`;
const probeStart = {console: consoleErrors.length, page: pageErrors.length, failed: failedRequests.length};
{
  const ctx = await browser.newContext({viewport: {width: 1280, height: 800}});
  const page = await ctx.newPage();
  attach(page);
  const resp = await page.goto(probeUrl, {waitUntil: 'domcontentloaded'});
  expect('404 route serves the 404 page', resp?.status() === 404);
  await page.waitForTimeout(300); // let the probe's own 404 console event flush before the watermark splice
  await ctx.close();
}
consoleErrors.splice(probeStart.console);
pageErrors.splice(probeStart.page);
failedRequests.splice(probeStart.failed);

await browser.close();

/* ── summary ──────────────────────────────────────────────────────── */
if (consoleErrors.length) checks.push({name: 'no console errors', ok: false, detail: consoleErrors.slice(0, 10).join(' | ')});
else pass('no console errors');
if (pageErrors.length) checks.push({name: 'no uncaught page errors', ok: false, detail: pageErrors.slice(0, 10).join(' | ')});
else pass('no uncaught page errors');
if (failedRequests.length) checks.push({name: 'no failed/4xx-5xx requests', ok: false, detail: failedRequests.slice(0, 10).join(' | ')});
else pass('no failed/4xx-5xx requests');

const failed = checks.filter(c => !c.ok);
console.log(JSON.stringify({passed: checks.filter(c => c.ok).map(c => c.name), failed}, null, 2));
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed — screenshots in ${OUT}/`);
process.exit(failed.length === 0 ? 0 : 1);
