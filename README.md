# iste-website
WEBSITE FOR ISTE SC CET 2026

Static site: `index.html` + `styles.css` + `script.js`. No build step.

## How to run

```bash
python3 -m http.server 8000
```

Then open: http://localhost:8000

Check: Hero, Events filter chips, Join form (saves to `localStorage`), countdown.
Stop: `Ctrl+C`.

## GIT Workflow

Each teammate, every time (example: Anu adding Events):

1. pull = get latest clean copy
```bash
git checkout main
git pull origin main
```

2. Make branch `yourname-feature` = personal rough copy
```bash
git checkout -b anu-events
```
Name rule: `name-what` e.g. `joseph-hero`, `anu-events`, `riya-team`.
Check: `git branch` will now show `* anu-events`.

3. Work + push = save + upload rough copy
```bash
git status
git add .
git commit -m "add events section"
git push -u origin anu-events
```

## PR rule

- Base: `main` ← Compare: `your-branch` → Create pull request.
- Must include in PR description:
  - Before/after screenshots (drag images into PR body).
  - What page/section changed + what to click to verify
    (e.g. "open Events section, click Register, check filter chips").
- No screenshots = no approval.

## Review rule

- Only `@josephjohnson10` approval counts (Code Owner).
- Teammate approvals of each other do not satisfy the gate.
- After approval: `Squash and merge` → `Delete branch`.
- Then everyone syncs:
```bash
git checkout main
git pull origin main
```

## Visual check before approving (website)

Don't approve on code diff alone. Preview visually one way:

```bash
git fetch origin
git checkout anu-events
python3 -m http.server 8000
# open http://localhost:8000, verify, then back:
git checkout main
```

After merge, clean up:
```bash
git pull origin main
git branch -d anu-events
```
