# resumorph

One resume file, many shapes. An open-source CV website template built with Next.js, TypeScript and Tailwind CSS, deployed as a static site to GitHub Pages.

**Live demo:** https://1210910.github.io/resumorph/

**Linen theme preview:** https://1210910.github.io/resumorph/linen/

> Work in progress. The template ships two themes: Terminal (a dark, animated look with a live shell in the hero) and Linen (warm and serif). The demo site shows Terminal at `/` and Linen at `/linen`, with the fictional persona in `examples/linen-front-office.yaml`. Next on the roadmap: an editorial theme for management, multiple languages, a PDF generated from the same data, and an AI agent that interviews you, writes your resume file and deploys the site.

## Features

- One `resume.yaml` for everything on the page, based on [JSON Resume](https://jsonresume.org/schema) and checked when the site builds
- Two themes that read the same file: **Terminal** (dark, animated, for tech roles) and **Linen** (warm and serif, for hotels, tourism and other service roles). Switch with one line: `theme: linen`
- Hero with a working terminal: `whoami`, `ls`, `contact`, `cv`, `kubectl get experience` and more, all answered from your data
- Projects pulled from your GitHub repos at build time
- One-page, ATS-friendly PDF served by the "Download CV" button
- Light and dark mode, `prefers-reduced-motion` support, mobile layout
- Static export: no server, free hosting on GitHub Pages

## Quick start

1. Click **Use this template** on GitHub to create your own repo, then clone it.
2. Install and run:

   ```bash
   npm ci
   npm run dev
   # → http://localhost:3000
   ```

3. Edit `resume.yaml` at the root of the repo. It holds everything: your details, experience, education, skills, languages, projects and references. The demo persona, Alex Morgan, is fictional. Every field is documented in [`src/content/schema.ts`](src/content/schema.ts), and [`examples/linen-front-office.yaml`](examples/linen-front-office.yaml) is a full example for the Linen theme.
4. Pick a look with `theme: terminal` or `theme: linen`.
5. Optional: put a photo in `public/` and set `basics.image: photo.jpg`. Without one, the site shows your initials.
6. Update `scripts/cv/ats.html` and run `npm run cv:pdf` to rebuild the PDF (`npx playwright install chromium` the first time). Keep the file name in sync with `basics.cvFile`. The Linen theme has a "Save as PDF" button that prints the page instead.

If something in `resume.yaml` is wrong, `npm run build` (and `npm run dev`) stops and lists what to fix, for example `work.0.startDate: use YYYY, YYYY-MM or YYYY-MM-DD, e.g. 2024-03`.

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
