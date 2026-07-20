# Test Summary Report — SauceDemo UI Automation

|               |                                                                   |
| ------------- | ----------------------------------------------------------------- |
| Report date   | 2026-07-17                                                        |
| Author        | Elene Molashvili                                                  |
| Application   | https://www.saucedemo.com/ (production demo instance)             |
| Suite version | 1.0 (initial implementation)                                      |
| Environment   | Windows 11, Node v22.18.0, Playwright (Chromium), local execution |

## 1. Execution summary

All results below come from real local runs on 2026-07-17; nothing is projected.

| Run                    | Command              | Tests | Passed | Failed | Duration |
| ---------------------- | -------------------- | ----- | ------ | ------ | -------- |
| Full suite (1st run)   | `npm run test`       | 34    | 33     | 1      | 39.6 s   |
| Full suite (after fix) | `npm run test`       | 34    | 34     | 0      | 25.8 s   |
| Smoke suite            | `npm run test:smoke` | 8     | 8      | 0      | 6.8 s    |

## 2. Failure analysis

The single failure in the first run was a **framework defect, not an application defect**: the test dismissing the login error banner located the close button by its accessible name ("Close"), but the SauceDemo close button exposes no accessible name — it carries only the `data-test="error-button"` attribute. The locator was corrected in `pages/login.page.ts` and the suite re-run. This is a realistic example of debugging locator failures from a Playwright error log and trace.

## 3. Coverage

| Area                        | Test cases     | Automated |
| --------------------------- | -------------- | --------- |
| Authentication + logout     | TC-UI-001..008 | 8/8       |
| Inventory + product details | TC-UI-009..018 | 10/10     |
| Cart                        | TC-UI-019..025 | 7/7       |
| Checkout                    | TC-UI-026..033 | 8/8       |
| End-to-end purchase         | TC-UI-034      | 1/1       |
| **Total**                   | **34**         | **34/34** |

## 4. Defects found in the application

No functional defects were observed in the tested SauceDemo scenarios with the `standard_user` account. The intentionally defective demo accounts (`problem_user`, `error_user`) were explored out of curiosity but are excluded from scope — see the test plan — because their failures are by design.

## 5. Reports generated

- **Playwright HTML report** — generated at `playwright-report/index.html`, opened with `npm run test:report`.
- **Allure results** — 79 result files generated in `allure-results/` by the `allure-playwright` reporter. Rendering to HTML (`npm run allure:generate`) requires a Java runtime, which was **not available on the execution machine**; the command and the CI artifact upload are configured, and the results directory is real. This limitation is also recorded in the repository README.

## 6. Exit criteria assessment

| Criterion                       | Status                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| All in-scope tests executed     | Met (34/34)                                                                    |
| All failures explained          | Met (1 framework defect, fixed and re-verified)                                |
| Reports produced from real runs | Met (Playwright HTML; Allure results without local HTML rendering — see above) |

## 7. Recommendations

1. Add Firefox and WebKit projects for cross-browser confidence.
2. Add an accessibility pass (SauceDemo's login error close button lacking an accessible name — the very thing that broke the first locator — would be flagged by an a11y audit).
3. Consider visual regression snapshots for the inventory grid.
