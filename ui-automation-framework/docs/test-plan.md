# Test Plan — SauceDemo UI Automation

|                        |                                                                               |
| ---------------------- | ----------------------------------------------------------------------------- |
| Application under test | [SauceDemo](https://www.saucedemo.com/) — demo e-commerce store by Sauce Labs |
| Document owner         | Elene Molashvili                                                              |
| Project type           | Independent QA automation portfolio project                                   |
| Version                | 1.0                                                                           |

## 1. Objective

Verify that the core customer journey of the SauceDemo store — authentication, product browsing, cart management and checkout — behaves correctly, and demonstrate a maintainable Playwright + TypeScript automation framework around those checks.

## 2. Scope

**In scope**

- Login and logout, including negative credential combinations and the locked-out account
- Inventory page: catalogue rendering, product data, all four sort options
- Product details page and navigation back to the inventory
- Cart: adding/removing products from both the inventory and the cart, badge counting, product data integrity
- Checkout: customer information validation, order overview, totals (subtotal, 8% tax, total), order completion, cancellation
- One end-to-end purchase journey covering the critical business path

**Out of scope**

- Cross-browser coverage (suite runs on Chromium; Firefox/WebKit listed as a future improvement)
- Mobile/responsive layouts
- Visual regression testing
- Performance and load testing
- Accessibility auditing
- The intentionally broken SauceDemo accounts (`problem_user`, `performance_glitch_user`, etc.) — useful for exploratory practice but they would make an automated regression suite permanently red by design
- Backend/API testing (SauceDemo is a client-side-only application; API testing is covered by the companion [API testing portfolio project](../../api-testing-portfolio/))

## 3. Assumptions

- SauceDemo is publicly available and its catalogue of six products is static.
- Demo credentials published on the login page remain valid.
- All application state (session, cart) is stored client-side, so parallel test isolation is guaranteed by giving each test its own browser context, and no server-side data cleanup is required.

## 4. Test environment

| Item                         | Value                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Application                  | https://www.saucedemo.com/ (production demo instance)               |
| Browser                      | Chromium (bundled with Playwright)                                  |
| OS used for the recorded run | Windows 11                                                          |
| Node.js                      | v22.18.0                                                            |
| Test runner                  | Playwright Test with TypeScript                                     |
| Configuration                | `.env` file based on `.env.example` (base URL, usernames, password) |

## 5. Test approach

- **Automation-first**: all in-scope scenarios are automated; the documented manual test cases (see `test-cases.md`) map 1:1 to automated tests and record the automation status.
- **Page Object Model** with a shared header component; assertions live in tests, not in page objects.
- **Web-first assertions** and Playwright auto-waiting; no fixed sleeps.
- **Data-driven expectations**: expected product names/prices come from one catalogue module (`data/products.ts`), so a catalogue change breaks loudly in one place.
- **Suites by tag**: `@smoke` (critical path, ~8 tests, runs first in CI), `@regression` (full suite), `@negative`, `@e2e`.

## 6. Entry criteria

- Framework installs cleanly (`npm install`, `npx playwright install chromium`).
- Lint and type checks pass.
- https://www.saucedemo.com/ responds.

## 7. Exit criteria

- 100% of in-scope automated tests executed.
- No failing test left unexplained: each failure is either a framework defect (fixed), an application defect (documented) or an environment issue (documented).
- Test summary report produced from a real run (`docs/test-summary-report.md`).

## 8. Deliverables

- Automated test suite (34 tests) with Playwright HTML and Allure reporting
- Test scenarios (`test-scenarios.md`) and detailed test cases (`test-cases.md`)
- Regression checklist (`regression-checklist.md`)
- Risk analysis (`risk-analysis.md`)
- Test summary report (`test-summary-report.md`)
- CI workflow (`.github/workflows/ui-tests.yml`)

## 9. Suspension criteria

Execution is suspended if the SauceDemo site is unreachable or returns server errors for the login page, since every scenario depends on authentication.

## 10. Roles

Single-person portfolio project: Elene Molashvili acts as test designer, automation engineer and reviewer.
