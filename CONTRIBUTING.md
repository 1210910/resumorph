# Contributing

How changes land in resumorph. Short version: branch, Conventional Commit title, green checks, squash merge.

## Branches

- `main` is what's live on the demo site (GitHub Pages): every push to it deploys.
- Work on a short-lived branch named `<type>/<short-description>`, e.g. `content/update-current-role`, `feat/now-section`, `fix/mobile-nav`.
- Open a pull request into `main`. No direct pushes to `main`.

## Commit and PR titles: Conventional Commits

PRs are **squash-merged**, so the PR title becomes the commit on `main`. The title must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<optional scope>): <summary in lowercase, imperative, no trailing period>
```

| Type           | Use it for                                                       |
| -------------- | ---------------------------------------------------------------- |
| `content`      | Demo resume text or data in `src/data/`                          |
| `feat`         | A new section, component or behaviour                            |
| `fix`          | Something broken: layout bug, dead link, wrong date              |
| `style`        | Visual tweaks with no new behaviour (colors, spacing, type)      |
| `refactor`     | Code structure, no visible change                                |
| `perf`         | Faster load or smoother animation                                |
| `docs`         | README, this file, code comments                                 |
| `build` / `ci` | Dependencies, Next config, GitHub Actions                        |
| `chore`        | Anything else that doesn't touch the site                        |
| `revert`       | Undoing an earlier change                                        |

Suggested scopes are the section or area touched: `hero`, `now`, `about`, `resume`, `portfolio`, `references`, `contact`, `header`, `footer`, `theme`, `i18n`, `pdf`, `agent`, `seo`, `deps`.

Examples:

```
content(resume): add a second role to the demo persona
feat(now): add platform stack section
fix(header): close mobile drawer after navigating
ci: add PR checks workflow
```

If a change breaks existing sites built from the template (for example, a data shape in `dataDef.ts` changes), add `!` after the type: `refactor(data)!: rename experience fields`.

Commits inside a branch don't have to be perfect, since they get squashed. Conventional messages there are still appreciated.

## Before you open a PR

Run the same checks CI runs:

```bash
npm ci
npx tsc --noEmit -p .
npx eslint './src/**/*.{js,jsx,ts,tsx}' --max-warnings=0
npx prettier --check './src/**/*.{js,jsx,ts,tsx}'
npx next build
```

Use `npm`; there is no `yarn.lock`.

## What a good PR looks like

- **One topic per PR.** Content updates and redesigns go in separate PRs, so either can be reverted alone.
- **Screenshots for anything visual**: desktop (1280px) and mobile (390px). The PR template has a table for them.
- **Mobile and reduced motion still work**: no horizontal scroll at 390px, and new animations are switched off under `prefers-reduced-motion`.
- **No real personal data.** The demo persona is fictional; never commit a real phone number, address or email other than `example.com`.
- **Resume content stays in `resume.yaml`.** Its shape lives in `src/content/schema.ts`; each theme maps it to what it draws (`src/data/data.tsx` for Terminal, `src/themes/view.ts` for Linen and Editorial). Don't hard-code resume text in components.

## Checks

The `PR checks` workflow runs on every pull request:

- **Conventional PR title**: fails if the title doesn't match the format above.
- **Typecheck, lint and build**: `tsc`, ESLint, Prettier and `next build` must all pass.

Both are required by the branch ruleset (`.github/rulesets/main.json`), so a PR can only be merged when they are green.
