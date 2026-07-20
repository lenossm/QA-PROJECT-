# Final Quality Report — QA Automation Portfolio

| | |
| --- | --- |
| Date | 2026-07-17 |
| Machine | Windows 11 (win32 10.0.26200), PowerShell |
| Node.js / npm | v22.18.0 / 10.9.3 |
| Java | Not installed (see Environment restrictions) |

Every number in this report comes from commands actually executed on this machine. Nothing is projected or assumed.

## 1. Commands executed and their results

### UI project (`ui-automation-framework/`)

| Command | Result |
| --- | --- |
| `npm install` (dev dependencies incl. Playwright, allure-playwright, typescript-eslint) | Success |
| `npx playwright install chromium` | Success |
| `npm run typecheck` (1st) | Failed: TS 6.x deprecation of `moduleResolution: node` → tsconfig moved to `nodenext`; clean afterwards |
| `npm run lint` (1st) | 1 warning (`prefer-to-have-count`) → test rewritten; clean afterwards |
| `npm run typecheck` / `npm run lint` (final) | **Clean** (0 errors, 0 warnings) |
| `npm run format` / `npm run format:check` | All files formatted / check passes |
| `npm run test` (1st run) | **33 passed / 1 failed** (34 tests, 39.6 s) |
| `npm run test` (after fix) | **34 passed / 0 failed** (25.8 s); repeated later: 34/34 (17.0 s) |
| `npm run test:smoke` | **8 passed / 0 failed** (6.8 s) |
| `npm run allure:generate` | **Failed — no Java runtime** (see restrictions) |

**The one real failure, explained:** the test "validation message can be dismissed and login retried" clicked the error banner's close button via `getByRole('button', { name: 'Close' })`. SauceDemo's close button exposes no accessible name — it only carries `data-test="error-button"`. The locator was fixed in `pages/login.page.ts` and the suite re-run to green. Documented in `docs/test-summary-report.md`.

### API project (`api-testing-portfolio/`)

| Command | Result |
| --- | --- |
| `npm install` (incl. Playwright, ajv, newman, newman-reporter-htmlextra) | Success |
| `npm run typecheck` / `npm run lint` | **Clean** on first run and final run |
| `npm run test` (1st run) | **28 passed / 1 failed** (29 tests, 7.2 s) |
| `npm run test` (after fix) | **29 passed / 0 failed** (6.9 s) |
| `npm run postman:test` (Newman) | **23 requests, 37/37 assertions passed** (6.2 s) |
| `npm run postman:report` | Success — `postman/reports/newman-report.html` (455 KB) generated |

**The one real failure, explained:** the "empty request body" test expected 500 based on an exploratory probe made with Node's raw `fetch`; through Playwright's request context the API returns 400. The expectation was corrected to the behaviour at the boundary the test uses, and the client-dependent difference is documented in `docs/negative-testing.md`.

Before writing the API tests, every endpoint/error combination was probed against the live API and the observed statuses/bodies recorded; all assertions and the six defect reports in `docs/defect-samples.md` are based on that reproduced behaviour, not on documentation assumptions.

## 2. Reports generated (verifiable on disk)

| Report | Location | Status |
| --- | --- | --- |
| Playwright HTML (UI) | `ui-automation-framework/playwright-report/index.html` | Generated from real runs |
| Allure results (UI) | `ui-automation-framework/allure-results/` (79 files) | Generated; HTML rendering blocked by missing Java |
| Playwright HTML (API) | `api-testing-portfolio/playwright-report/index.html` | Generated |
| Newman htmlextra | `api-testing-portfolio/postman/reports/newman-report.html` | Generated |
| Screenshots | `*/screenshots/`, `portfolio-assets/screenshots/` | Real captures of the local reports and app (no fabricated images) |

## 3. Final test tally

| Suite | Tests / assertions | Passed | Failed |
| --- | --- | --- | --- |
| UI Playwright (full) | 34 | 34 | 0 |
| UI Playwright (smoke) | 8 | 8 | 0 |
| API Playwright | 29 | 29 | 0 |
| Postman via Newman | 37 assertions / 23 requests | 37 | 0 |

Two failures occurred during development (one bad locator, one wrong expectation); both were diagnosed, fixed, and are documented in the respective test summary reports. No test was disabled, skipped or weakened to achieve green.

## 4. Environment restrictions encountered

1. **No Java runtime** — `npm run allure:generate` / `allure:open` cannot render the Allure HTML report locally (`JAVA_HOME` points to a nonexistent directory and no JRE is installed). The `allure-playwright` reporter works and produces `allure-results/`; CI uploads them as artifacts. Fix locally: install a JRE (e.g. Temurin 21) and re-run the two commands.
2. **GitHub Actions cannot run here** — both workflow files are complete and follow current action versions (`checkout@v4`, `setup-node@v4`, `upload-artifact@v4`), but they execute for the first time when the repositories are pushed to GitHub.
3. **Public shared targets** — both SauceDemo and Restful Booker are third-party public instances; availability during the recorded runs was good (all runs completed), but future runs depend on those services.

## 5. Remaining manual steps for the candidate

1. Create two GitHub repositories and push each project folder as the repository root (each already contains its own `.github/workflows/`, `package.json`, `.gitignore`, README). Optionally create a third repository from the portfolio root instead, keeping everything together.
2. Verify the first Actions runs are green; then optionally add the workflow status badge to each README (badges were deliberately not added — they would point at not-yet-existing workflows).
3. Optionally install Java and commit an Allure report screenshot after `npm run allure:generate`.
4. Pin the portfolio repository/repositories on the GitHub profile and link them from LinkedIn.

## 6. Recommended GitHub repository names

| Project | Suggested name |
| --- | --- |
| UI framework | `saucedemo-playwright-framework` |
| API portfolio | `restful-booker-api-testing` |
| Combined portfolio (if kept as one repo) | `qa-automation-portfolio` |

## 7. Acceptance criteria check

| Criterion | Status |
| --- | --- |
| Both projects install successfully | ✅ verified |
| Linting passes | ✅ 0 errors/0 warnings in both |
| TypeScript strict type checking passes | ✅ both |
| Meaningful UI tests exist (34, all with assertions) | ✅ |
| Meaningful API tests exist (29 + 37 Newman assertions) | ✅ |
| Page Object Model implemented correctly | ✅ pages/components/fixtures separated; assertions in tests |
| Postman collection valid, Newman command works | ✅ executed successfully |
| Reports can be generated | ✅ (Allure HTML rendering needs Java — documented) |
| GitHub Actions files exist | ✅ both projects, no `continue-on-error` on tests |
| Documentation complete | ✅ 12 docs across both projects + root docs |
| No secrets committed | ✅ no `.env` files exist; committed values are published demo credentials, explicitly annotated |
| No fake claims / placeholders | ✅ all results from real runs; screenshots are real captures |
| Setup instructions reproducible | ✅ tested from clean install on this machine |
