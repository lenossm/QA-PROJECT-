# Progress Log

Running log of implementation work and check results.

## Phase 1 — Setup ✅

- [x] Environment inspected: Node v22.18.0, npm 10.9.3, git 2.48.1, Java **not installed**.
- [x] Target connectivity verified: saucedemo.com → 200, restful-booker.herokuapp.com/ping → 201.
- [x] Folder structure created (26 directories).
- [x] `IMPLEMENTATION_PLAN.md` and `PROGRESS.md` created.

## Phase 2 — UI Automation Framework ✅

- [x] Framework configuration (package.json, playwright.config.ts, tsconfig strict, ESLint flat config, Prettier, dotenv, .env.example)
- [x] 5 page objects + HeaderComponent + InventoryItemComponent
- [x] Fixtures: page objects, `authenticatedPage`, `cartWithItems` (overridable `cartItems` option), locked-out user credentials
- [x] Test data modules (products, users, checkout, error messages) and price utils
- [x] 34 tests: authentication (8), inventory (7), product details (3), cart (7), checkout (8), E2E purchase (1)
- [x] Documentation: test plan, 30 scenarios, 34 test cases, regression checklist, risk analysis, summary report
- [x] `npm run typecheck` clean; `npm run lint` 0 errors/0 warnings (after fixing one TS module-resolution deprecation and one `prefer-to-have-count` warning)
- [x] Full run 1: 33/34 — failure diagnosed as a bad locator (error close button has no accessible name; uses `data-test="error-button"`); fixed
- [x] Full run 2: **34/34 passed (25.8 s)**; smoke: **8/8 (6.8 s)**; re-run after screenshot: 34/34 (17.0 s)
- [x] Playwright HTML report generated; 79 Allure result files generated. Allure HTML rendering blocked: **no Java runtime on this machine** (documented in README and summary report)
- [x] Real screenshots captured from the local report and app into `screenshots/`

## Phase 3 — API Testing Portfolio ✅

- [x] Live behaviour probe of all endpoint/error combinations (basis for honest assertions and defect reports)
- [x] Project configuration (Playwright config, tsconfig strict, ESLint, Prettier, dotenv)
- [x] AuthClient + BookingClient, token + existingBooking fixtures (with cleanup), Ajv schema validator, booking factory, 4 JSON schemas
- [x] 29 Playwright tests: auth (5), CRUD (6), validation (6), negative (11), lifecycle workflow (1)
- [x] Postman collection: 23 requests, 37 assertions, 5 folders, chained lifecycle, pre-request dynamic data, cleanup request
- [x] `npm run typecheck` and `npm run lint` clean
- [x] Playwright run 1: 28/29 — failure was a wrong expectation (empty body: 400 via Playwright vs 500 via raw fetch probe); corrected and documented
- [x] Playwright run 2: **29/29 passed (6.9 s)**
- [x] Newman: **37/37 assertions passed** (`postman:test`), HTML report generated (`postman:report`, 455 KB)
- [x] Documentation: API test plan, endpoint matrix, 30 test cases, negative-testing catalogue, 6 defect reports (all reproduced), summary report

## Phase 4 — CI and presentation ✅

- [x] `ui-tests.yml`: quality gates → smoke → full suite, npm cache, report/trace artifacts, no continue-on-error
- [x] `api-tests.yml`: quality gates → Playwright API + Newman jobs, report artifacts
- [x] Project READMEs (setup, commands, architecture, limitations, author links)
- [x] Root README, PORTFOLIO_REVIEW.md, architecture diagrams (mermaid)
- [x] Real screenshots in `portfolio-assets/screenshots/` (Playwright report, Newman report, SauceDemo)
- [x] Final sweep: secrets, placeholder text, links, formatting

## Phase 5 — Verification ✅

- [x] FINAL_QUALITY_REPORT.md
