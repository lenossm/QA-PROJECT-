# Implementation Plan — QA Automation Portfolio

Portfolio owner: **Elene Molashvili** — Junior QA Engineer focused on manual testing, API validation, and reliable test automation.

This document records how the portfolio was planned and built, phase by phase.

## Environment (recorded before implementation)

| Item | Value |
| --- | --- |
| OS | Windows 11 (win32 10.0.26200) |
| Shell | PowerShell |
| Node.js | v22.18.0 |
| npm | 10.9.3 |
| Git | 2.48.1.windows.1 |
| Java | **Not installed** (affects Allure HTML report rendering — documented in each README) |
| https://www.saucedemo.com/ | Reachable, HTTP 200 |
| https://restful-booker.herokuapp.com/ping | Reachable, HTTP 201 |

## Deliverables

```
qa-automation-portfolio/
├── ui-automation-framework/     Playwright + TypeScript UI framework for SauceDemo
├── api-testing-portfolio/       Playwright API + Postman/Newman tests for Restful Booker
├── portfolio-assets/            Screenshots and diagrams shared by the root README
├── README.md                    Root portfolio presentation
├── PORTFOLIO_REVIEW.md          Reviewer-oriented walkthrough of the portfolio
├── IMPLEMENTATION_PLAN.md       This file
├── PROGRESS.md                  Running log of work and check results
└── FINAL_QUALITY_REPORT.md      Final verification: commands run, results, limitations
```

Both project folders are self-contained (own `package.json`, config, CI workflow, docs, README) so each can be moved into its own GitHub repository without changes.

## Phase 1 — Setup

- Inspect the environment and record tool versions.
- Create the full folder tree.
- Create `IMPLEMENTATION_PLAN.md` and `PROGRESS.md`.

## Phase 2 — UI Automation Framework (SauceDemo)

Technical decisions:

- **Playwright + TypeScript (strict)** with the Page Object Model. One page class per screen (`LoginPage`, `InventoryPage`, `ProductDetailsPage`, `CartPage`, `CheckoutPage`) plus a shared `HeaderComponent` for the app bar/burger menu/cart badge, which appears on every authenticated screen — the only place a shared component genuinely reduces duplication.
- **Fixtures** extend Playwright's `test`: page-object fixtures, an `authenticatedPage` fixture (standard user logged in), a `cartWithItems` fixture (login + products pre-added), and a `lockedOutUser` credentials fixture. Cleanup relies on Playwright's per-test browser context isolation; SauceDemo stores state client-side, so no server-side cleanup is required (documented in the test plan).
- **Selectors**: `data-test` attributes exposed by SauceDemo, via Playwright `getByTestId` (configured `testIdAttribute: 'data-test'`) and role-based locators. No CSS chains, no XPath, no `waitForTimeout`.
- **Configuration**: `dotenv` for `BASE_URL`, usernames and the shared password; `.env.example` committed, `.env` git-ignored. SauceDemo credentials are public demo data, but the framework still treats them as configuration to demonstrate the correct pattern.
- **Reporting**: Playwright HTML report + `allure-playwright` reporter; screenshots on failure, trace on first retry, video retained on failure.
- **Suites/tags**: `@smoke`, `@regression`, `@negative`, `@e2e` in test titles, executed through `--grep` npm scripts. The regression folder holds the critical end-to-end purchase flow; other tests are tagged in place rather than duplicated.
- **Quality gates**: ESLint (flat config, typescript-eslint + eslint-plugin-playwright), Prettier, `tsc --noEmit`.

Documentation: test plan, test scenarios, 30+ detailed test cases, regression checklist, risk analysis, test summary report (filled in with real run results).

## Phase 3 — API Testing Portfolio (Restful Booker)

Technical decisions:

- **Playwright APIRequestContext + TypeScript** for the code-based suite. Thin client classes (`AuthClient`, `BookingClient`) own URLs and request shaping only — assertions stay in tests. A booking test-data factory generates unique payloads per test; created bookings are deleted in cleanup where the API allows it.
- **JSON schema validation** with `ajv` (+ `ajv-formats` for dates) against schemas stored in `schemas/`.
- **Postman collection** with environment file, collection variables, pre-request scripts for dynamic data, `pm.test` assertions on status codes, bodies, types and headers, chained requests (token → create → get → update → patch → delete → verify 404), and separate positive/negative folders. Run via **Newman** with `newman-reporter-htmlextra`.
- Restful Booker is a public, intentionally imperfect training API. Its known quirks (e.g. `PUT`/`DELETE` with a bad token return 403, `DELETE` success returns 201 instead of 204) are asserted against *actual* behaviour and written up as sample defect reports rather than hidden.

Documentation: API test plan, endpoint matrix, 25+ test cases, negative-testing catalogue, 5–8 defect samples (each honestly labelled), test summary report.

## Phase 4 — CI and presentation

- GitHub Actions workflow per project (`ui-tests.yml`, `api-tests.yml`): npm cache, install, lint, typecheck, test runs, artifact uploads. No `continue-on-error` on test steps; no disabled tests.
- READMEs for both projects and the portfolio root, `PORTFOLIO_REVIEW.md`.
- Final sweep: no secrets, no placeholder text, links checked.

## Phase 5 — Verification

- `FINAL_QUALITY_REPORT.md` with every command executed, pass/fail counts, real failure reasons, generated reports, environment restrictions, remaining manual steps, and recommended GitHub repository names.

## Known environment restrictions (identified up front)

1. **No Java runtime** — `allure generate`/`allure open` cannot render the Allure HTML report locally. The reporter still produces `allure-results/`, the npm scripts are configured, and the CI workflow uploads results; rendering locally requires installing a JRE (documented).
2. **CI cannot be executed here** — workflow files are created and validated for syntax, but only run once pushed to GitHub.
3. **Restful Booker is a shared public instance** — occasional 5xx responses or data interference from other users is possible; the test design (dynamic data, per-test resources) minimises the impact.
