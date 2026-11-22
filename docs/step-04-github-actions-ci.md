# Step 04: GitHub Actions (lint, test and build on every push)

## 1. Goal
Make GitHub automatically run lint, tests and the build on every push and pull request, so a broken change is caught right away.

## 2. Key concepts
- **CI (Continuous Integration):** a robot runs the same checks on every change, so nobody has to remember. "Works on my machine" stops being an excuse.
- **Workflow file:** a YAML file at `.github/workflows/` at the repo root. It is versioned with the code.
- **Five words:** workflow (the file), trigger `on` (when it runs), job (a group of steps on one machine), runner (the machine, `ubuntu-latest`), step (one command or ready-made action).
- **`npm ci` vs `npm install`:** `npm ci` installs exactly what `package-lock.json` says from a clean start, so runs are repeatable.
- **Monorepo gotcha:** the app is in `frontend/`, so commands need `working-directory: frontend`.

## 3. Files created or changed
- `.github/workflows/ci.yml`: the CI workflow (runs on push and pull request).

## 4. Important code

**Trigger**
```yaml
on:
  push:
  pull_request:
```
Run on every push to any branch, and on every pull request.

**Working directory**
```yaml
defaults:
  run:
    working-directory: frontend
```
Every `run:` command runs inside `frontend/`. Without it, `npm` would look for `package.json` in the repo root and fail.

**Setting up Node with cache**
```yaml
- name: Set up Node
  uses: actions/setup-node@v7
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: frontend/package-lock.json
```
Pins a stable LTS Node version (not whatever is newest). The cache path is needed because the lock file is not at the repo root.

**The checklist**
```yaml
- run: npm ci
- run: npm run lint
- run: npm test
- run: npm run build
```
Steps run in order. If one fails, the rest are skipped and the run goes red. Build runs last because it is the strictest type check (in Step 1, tests passed but the build failed).

## 5. How to verify
- Push the file, then open the repo on GitHub and click the **Actions** tab. The run should show a green tick.
- Or in the terminal: `gh run list --limit 3` should show `completed  success`.
- The latest commit also shows a green tick in the commit list.

## 6. Problems and fixes
None. The first run passed (about 29 seconds), even though the laptop uses Node 23 and CI uses Node 22.

## 7. Interview Q&A
**Q1. What is CI/CD and why do teams use it?**
CI automatically builds and tests the code on every change, so bugs are found early and the main branch stays healthy. CD goes further and automatically releases the tested code. Together they make releases fast, repeatable and low-risk.

**Q2. What is the difference between `npm install` and `npm ci`?**
`npm install` can update the lock file and reuse an existing `node_modules`. `npm ci` deletes `node_modules` and installs exactly what the lock file says, and fails if it does not match `package.json`. That is what I want in CI.

**Q3. A test passes locally but fails in CI. What could cause it?**
A different Node version, a missing dependency or lock file, an environment variable, file name case (Windows ignores it, Linux does not), time zone, or order and timing issues. I would read the CI log, then try to reproduce it locally with the same Node version and `npm ci`.

**Bonus: why must `checkout` be the first step?**
The runner starts as a blank machine with no code. Without `checkout`, `npm ci` cannot find `package.json`.

## 8. Commit message used
```
ci: run lint, tests and build on every push
```
