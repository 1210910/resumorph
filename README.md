# resumorph

One resume file, many shapes. An open-source CV website template built with Next.js, TypeScript and Tailwind CSS, deployed as a static site to GitHub Pages.

**Live demo:** https://1210910.github.io/resumorph/

**Theme previews:** [Linen](https://1210910.github.io/resumorph/linen/) · [Editorial](https://1210910.github.io/resumorph/editorial/)

> Work in progress. The template ships three themes: Terminal (a dark, animated look with a live shell in the hero), Linen (warm and serif) and Editorial (paper, ink and big serif headlines). The demo site shows Terminal at `/`, Linen at `/linen` and Editorial at `/editorial`, with fictional personas in `examples/`. Next on the roadmap: multiple languages, a PDF generated from the same data, and an AI agent that interviews you, writes your resume file and deploys the site.

## Features

- One `resume.yaml` for everything on the page, based on [JSON Resume](https://jsonresume.org/schema) and checked when the site builds
- Three themes that read the same file: **Terminal** (dark, animated, for tech roles), **Linen** (warm and serif, for hotels, tourism and other service roles) and **Editorial** (a magazine-style page for management, consulting and corporate roles). Switch with one line, e.g. `theme: editorial`
- Hero with a working terminal: `whoami`, `ls`, `contact`, `cv`, `kubectl get experience` and more, all answered from your data
- Projects pulled from your GitHub repos at build time
- One-page, ATS-friendly PDF served by the "Download CV" button
- Light and dark mode in every theme: `appearance: system | light | dark` sets the default and a sun/moon button lets visitors switch
- A signature piece per theme: Terminal's live shell, Linen's hotel key card that unlocks your email, and Editorial's reading progress, chapter rail, counting stats and A4 print preview
- `prefers-reduced-motion` support, mobile layout
- Static export: no server, free hosting on GitHub Pages

## Quick start

1. Click **Use this template** on GitHub to create your own repo, then clone it.
2. Install and run:

   ```bash
   npm ci
   npm run dev
   # → http://localhost:3000
   ```

3. Edit `resume.yaml` at the root of the repo. It holds everything: your details, experience, education, skills, languages, projects and references. The demo persona, Alex Morgan, is fictional. Every field is documented in [`src/content/schema.ts`](src/content/schema.ts), and [`examples/`](examples) has a full example for the Linen and Editorial themes.
4. Pick a look with `theme: terminal`, `theme: linen` or `theme: editorial`, and light or dark with `appearance: system`, `light` or `dark`.
5. Optional: put a photo in `public/` and set `basics.image: photo.jpg`. Without one, the site shows your initials.
6. Update `scripts/cv/ats.html` and run `npm run cv:pdf` to rebuild the PDF (`npx playwright install chromium` the first time). Keep the file name in sync with `basics.cvFile`. Linen and Editorial have a "Save as PDF" button that prints the page instead, and Editorial adds a Preview button that shows the A4 pages first.

If something in `resume.yaml` is wrong, `npm run build` (and `npm run dev`) stops and lists what to fix, for example `work.0.startDate: use YYYY, YYYY-MM or YYYY-MM-DD, e.g. 2024-03`.

## Privacy

- **Email and phone are hidden from scrapers by default.** They are encoded when the site builds and only appear when a visitor clicks "Show email" or "Show phone". The plain values are not in the HTML, the JavaScript or the structured data. Set `privacy.hideContactDetails: false` in `resume.yaml` to show them as plain links.
- **AI crawlers are asked to stay out.** `public/robots.txt` blocks the known AI and scraping bots (GPTBot, CCBot, Bytespider…) and lets search engines in, and every page carries a `noai, noimageai` robots tag.
- **Your repo is public too.** GitHub Pages on a free account needs a public repo, so anyone can read `resume.yaml` on GitHub. Only put in it what you are happy to publish. Leave the phone out if you can, or use an email alias you can replace.
- None of this stops a determined person with a browser; it makes harvesting slow and unrewarding.

## Deploy to GitHub Pages

1. Push to `main`.
2. Run the one-off setup script, signed in to the [GitHub CLI](https://cli.github.com/) as an admin of the repo:

   ```bash
   ./scripts/setup-repo.sh
   ```

   It turns on Pages (deployed by GitHub Actions), squash-only merges, Dependabot, secret scanning, and a ruleset that protects `main`.

3. The `Deploy Next.js site to Pages` workflow builds and publishes on every push to `main`. Your site is at `https://<user>.github.io/<repo>/`.

For a custom domain, add it under **Settings → Pages** and point your DNS at GitHub Pages.

## Development

```bash
npm run lint       # ESLint + Prettier check
npm run typecheck  # TypeScript
npm run build      # typecheck + static export to out/
npm run preview    # serve out/ locally
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch names, Conventional Commit titles and the checks every pull request runs.

## Credits

resumorph started from [react-resume-template](https://github.com/tbakerx/react-resume-template) by Tim Baker, released under the MIT License. Its copyright notice is kept in [LICENSE](LICENSE).

Fonts: [Inter](https://rsms.me/inter/) and [Space Grotesk](https://floriankarsten.github.io/space-grotesk/), both under the SIL Open Font License, loaded through `next/font`. Icons: [Heroicons](https://heroicons.com/) (MIT).

## License

[MIT](LICENSE)
