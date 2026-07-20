# Risk Analysis — SauceDemo UI Automation

Risks considered while designing the suite, their assessment, and the mitigation actually implemented in this repository.

Scales: Likelihood/Impact rated Low / Medium / High.

## Product risks (what could break for users)

| ID   | Risk                                                     | Likelihood | Impact | Mitigation in this suite                                                                          |
| ---- | -------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------- |
| R-01 | Users cannot log in (blocked revenue path)               | Low        | High   | Login covered by smoke tests including negative combinations; runs first in CI                    |
| R-02 | Wrong price or total displayed at checkout               | Low        | High   | Totals recomputed independently from the catalogue data and compared with the UI (TC-UI-031)      |
| R-03 | Cart contents desynchronised from what the user selected | Medium     | High   | Cart data verified after every mutation path: inventory add/remove, cart remove, details-page add |
| R-04 | Validation missing on checkout fields → broken orders    | Medium     | Medium | Field-by-field negative tests (TC-UI-027..029)                                                    |
| R-05 | Session not terminated on logout                         | Low        | High   | Logout test deep-links back to a protected page and expects refusal (TC-UI-008)                   |
| R-06 | Sorting silently wrong → users buy the wrong item        | Medium     | Low    | All four sort options asserted against independently computed order                               |

## Project/automation risks (what could break the suite)

| ID   | Risk                                                  | Likelihood | Impact | Mitigation                                                                                             |
| ---- | ----------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| R-07 | SauceDemo (public demo) is down or slow               | Medium     | High   | CI retries (2×) with trace capture; suspension criterion in the test plan; suite kept short (~30 s)    |
| R-08 | Catalogue or copy changes break assertions everywhere | Low        | Medium | Expected data centralised in `data/products.ts` and error-message constants; a change touches one file |
| R-09 | Flakiness from timing issues                          | Medium     | Medium | Web-first assertions and auto-waiting only; `waitForTimeout` banned by an ESLint rule                  |
| R-10 | Selector rot                                          | Low        | Medium | Only `data-test` attributes (stable, test-dedicated) and role-based locators are used                  |
| R-11 | Parallel tests interfering through shared state       | Low        | High   | SauceDemo state is client-side per browser context; each test gets a fresh context                     |
| R-12 | Secrets leaking into the repository                   | Low        | High   | `.env` git-ignored; `.env.example` documents variables; SauceDemo credentials are public demo data     |

## Accepted risks (documented, not mitigated)

- **Single-browser coverage.** The suite runs on Chromium only to keep feedback fast; SauceDemo is a simple client-side app where cross-browser differences are unlikely to affect the tested logic. Listed as a future improvement.
- **No visual regression.** Layout breakage without DOM changes would not be caught.
- **Public shared instance.** SauceDemo could change without notice; centralised test data limits the repair cost (see R-08).
