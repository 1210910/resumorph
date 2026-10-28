## What

<!-- One or two sentences: what changes for someone using the template or visiting the demo? -->

## Why

<!-- The reason or the issue this closes (e.g. "Closes #12"). -->

## Type of change

- [ ] `content` — demo resume text or data in `src/data/`
- [ ] `feat` — new section, component or behaviour
- [ ] `fix` — something was broken
- [ ] `style` / `refactor` — look or code structure, no new behaviour
- [ ] `ci` / `build` / `chore` / `docs` — tooling, deps or docs

## Screenshots

<!-- Required for any visual change: desktop (1280px) and mobile (390px), before and after. -->

|         | Before | After |
| ------- | ------ | ----- |
| Desktop |        |       |
| Mobile  |        |       |

## Checklist

- [ ] PR title follows Conventional Commits (`type(scope): summary`)
- [ ] `npx tsc --noEmit`, `npx eslint 'src/**/*.{ts,tsx}' --max-warnings=0` and `npx next build` pass locally
- [ ] Checked at 390px wide: no horizontal scroll, nothing clipped
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No real personal data (the demo persona is fictional)
