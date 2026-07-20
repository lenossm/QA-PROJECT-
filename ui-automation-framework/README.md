# Playwright UI Automation Framework — SauceDemo

UI test automation framework built with Playwright and TypeScript against [SauceDemo](https://www.saucedemo.com/), a demo e-commerce store by Sauce Labs.

Independent QA portfolio project by **Elene Molashvili** — Junior QA Engineer focused on manual testing, API validation, and reliable test automation. Not a commercial project; no production users.

## What this project shows

- Page Object Model with a shared header component, sized to the application (no god-classes, no over-abstraction)
- Playwright fixtures for authentication, cart preparation and page objects
- Web-first assertions and auto-waiting — `waitForTimeout` is banned by an ESLint rule
- Tagged suites (`@smoke`, `@regression`, `@negative`, `@e2e`) run via `--grep`
- Manual-QA documentation next to the code: test plan, 34 test cases, regression checklist, risk analysis and a summary report from a real run
- CI with lint → typecheck → smoke → full suite and artifact uploads

## Why SauceDemo

It is a stable public application intentionally built for practising test automation: a real business flow (login → catalogue → cart → checkout), stable `data-test` attributes, and edge-case accounts (e.g. a locked-out user) that make negative testing meaningful.

## Technology stack

| Tool                                                  | Role                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Playwright Test                                       | Runner, browser automation, HTML report, traces/video/screenshots |
| TypeScript (strict)                                   | Type-safe page objects, fixtures and test data                    |
| allure-playwright                                     | Allure results for richer reporting                               |
| ESLint (typescript-eslint + eslint-plugin-playwright) | Static quality gates, Playwright-specific anti-pattern rules      |
| Prettier                                              | Formatting                                                        |
| dotenv                                                | Environment configuration (`BASE_URL`, users, password)           |
| GitHub Actions                                        | CI                                                                |

## Architecture

```
tests/            Test suites grouped by feature (assertions live here)
  authentication/ Login, logout, negative credential cases
  inventory/      Catalogue, sorting, product details
  cart/           Add/remove flows, badge, data integrity
  checkout/       Customer info validation, overview, totals, completion
  regression/     Critical end-to-end purchase journey
pages/            One page object per screen (locators + actions, no assertions)
components/       HeaderComponent (app bar, cart badge, menu) and
                  InventoryItemComponent (product card reused by inventory,
                  cart and checkout overview)
fixtures/         Extended `test` with page objects, authenticatedPage,
                  cartWithItems and user credential fixtures
data/             Product catalogue, user credentials, checkout data,
                  expected error messages — single source of truth
utils/            env access, price parsing helpers
docs/             Test plan, scenarios, test cases, checklist, risk
                  analysis, summary report
screenshots/      Real screenshots captured from local runs
.github/workflows/ui-tests.yml
```

Design decisions worth noting:

- **Selectors**: Playwright's `testIdAttribute` is set to `data-test` (SauceDemo's dedicated test attribute), so locators read `getByTestId('shopping-cart-link')`. Role-based locators cover the rest. No CSS chains or XPath.
- **Checkout is one page object** for the three wizard steps — they share navigation and never appear independently, so three near-empty classes would add noise, not maintainability.
- **State isolation**: SauceDemo keeps all state client-side, so each test's fresh browser context is a complete cleanup; no teardown code is needed (documented in the test plan).

## Covered scenarios

34 automated tests: 8 authentication/logout, 10 inventory/product details, 7 cart, 8 checkout, 1 end-to-end purchase flow. Full list with steps and priorities: [docs/test-cases.md](docs/test-cases.md).

## Setup

Requirements: Node.js 18+ (developed on 22), npm.

```bash
npm install
npx playwright install chromium
cp .env.example .env   # defaults work as-is; see note below
```

The SauceDemo credentials in `.env.example` are published on the application's login page — they are demo data, not secrets. They are still routed through environment variables to demonstrate the pattern real projects require.

## Running tests

| Command                   | What it does                                     |
| ------------------------- | ------------------------------------------------ |
| `npm run test`            | Full suite, headless                             |
| `npm run test:smoke`      | Tests tagged `@smoke` (critical path, ~7 s)      |
| `npm run test:regression` | Tests tagged `@regression` (full regression set) |
| `npm run test:headed`     | Full suite with a visible browser                |
| `npm run test:debug`      | Playwright inspector debugging                   |

## Reports

| Command                   | What it does                                         |
| ------------------------- | ---------------------------------------------------- |
| `npm run test:report`     | Opens the Playwright HTML report                     |
| `npm run allure:generate` | Builds the Allure HTML report from `allure-results/` |
| `npm run allure:open`     | Serves the generated Allure report                   |

Screenshots are captured on failure, video is kept on failure, and traces are recorded on first retry (`playwright.config.ts`).

> **Note:** Allure report generation requires a Java runtime. On machines without Java the `allure-results/` data is still produced by every run (and uploaded as a CI artifact); only the local HTML rendering step needs a JRE.

## Quality gates

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run lint`      | ESLint (type-aware rules + Playwright plugin)  |
| `npm run typecheck` | `tsc --noEmit` in strict mode                  |
| `npm run format`    | Prettier write / `npm run format:check` verify |

## CI

`.github/workflows/ui-tests.yml` runs on push and pull request:

1. **quality-gates** — `npm ci`, lint, format check, typecheck
2. **smoke** — Playwright Chromium install, `@smoke` suite, report artifact
3. **full-suite** — all tests; uploads the Playwright report and Allure results always, and traces/screenshots/videos on failure

npm caching via `actions/setup-node`. Test steps do not use `continue-on-error`; a red suite fails the pipeline.

## Test results

Latest local run (2026-07-17, Windows 11, Node 22): **34/34 passed** in 25.8 s; smoke suite 8/8 in 6.8 s. Details, including the one locator defect found and fixed during implementation, are in [docs/test-summary-report.md](docs/test-summary-report.md).

![Playwright HTML report](screenshots/playwright-html-report.png)

## Known limitations

- Chromium only; cross-browser projects are configured trivially in `playwright.config.ts` but deliberately not enabled to keep feedback fast.
- Runs against the public SauceDemo instance — outages of that site fail the suite (suspension criteria documented in the test plan).
- Allure HTML rendering requires Java (see Reports above).
- The intentionally broken demo accounts (`problem_user`, `error_user`) are out of scope by design.

## Future improvements

- Firefox and WebKit projects in CI (matrix)
- Accessibility checks (axe-core) — the login error close button already lacks an accessible name, which an a11y pass would flag
- Visual regression snapshots for the inventory grid
- Nightly scheduled CI run to catch upstream SauceDemo changes

## Author

**Elene Molashvili** — Junior QA Engineer focused on manual testing, API validation, and reliable test automation.

- GitHub: [github.com/lenossm](https://github.com/lenossm)
- LinkedIn: [linkedin.com/in/elene-molashvili-54952b2b9](https://www.linkedin.com/in/elene-molashvili-54952b2b9)
