# resumorph

One resume file, many shapes. An open-source CV website template built with Next.js, TypeScript and Tailwind CSS, deployed as a static site to GitHub Pages.

**Live demo:** https://1210910.github.io/resumorph/

**Hospitality theme preview:** https://1210910.github.io/resumorph/hospitality/

> Work in progress. Today the template ships one full theme (a dark, animated "terminal" look with a live shell in the hero). A preview of the Hospitality theme (hotels, tourism, restaurants) lives at `/hospitality`, with its fictional persona in `src/data/personas/hospitality.ts`. Next on the roadmap: a YAML content file every theme reads, an editorial theme for management, multiple languages, a PDF generated from the same data, and an AI agent that interviews you, writes your resume file and deploys the site.

## Features

- A single data file (`src/data/data.tsx`) for everything on the page
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

3. Edit `src/data/data.tsx`. Start with `profile` (name, initials, role, location), then the sections below it. The demo persona, Alex Morgan, is fictional.
4. Optional: add a photo with `import photo from '../images/photo.jpg'` and set `profile.photo = photo`. Without one, the hero shows your initials.
5. Update `scripts/cv/ats.html` and run `npm run cv:pdf` to rebuild the PDF (`npx playwright install chromium` the first time). Keep the file name in sync with `profile.cvFileName`.

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
