# Portfolio Review Guide

A guided tour for anyone reviewing this portfolio — hiring managers, senior QA engineers, or mentors. It points at the places that best show how the candidate thinks, and it is honest about what this portfolio is and is not.

## What this portfolio is

Two independent QA automation projects by **Elene Molashvili**, a Computer Science student targeting Junior QA Engineer / QA Automation Trainee roles. Everything here was built as portfolio work against public demo applications. There is no commercial experience represented, no invented clients, and no fabricated results: every pass/fail number in the documentation comes from a real, locally executed run (see `FINAL_QUALITY_REPORT.md` for the exact commands).

## Five-minute review path

1. **Test design thinking** — read two test files side by side:
   - `ui-automation-framework/tests/checkout/checkout.spec.ts`: note the totals test recomputes subtotal/tax independently from a single data source instead of hardcoding "$43.18".
   - `api-testing-portfolio/playwright-api/tests/booking-negative.spec.ts`: note that negative tests assert the API's *actual* behaviour (500s, 405s, silently corrupted values) with comments pointing to filed defect reports, rather than pretending the API behaves conventionally.

2. **Architecture judgment** — `ui-automation-framework/pages/checkout.page.ts` models a three-step wizard as one page object with a comment explaining why; `components/inventory-item.component.ts` exists because the same product-card markup appears on three screens. Abstractions were added where they pay for themselves, not everywhere.

3. **Defect reporting** — `api-testing-portfolio/docs/defect-samples.md`. Six defects, each genuinely reproduced, each with severity reasoning (e.g. why silent data corruption on a price field is worse than a rejected request), and each pinned by an automated test that serves as re-runnable evidence.

4. **Honest reporting** — both `docs/test-summary-report.md` files describe a real first-run failure and its diagnosis (a locator that assumed an accessible name that doesn't exist; a wrong expectation carried over from a raw-`fetch` probe). Nothing was hidden to make the record look cleaner.

5. **CI design** — both `.github/workflows/*.yml` files gate tests behind lint/format/typecheck, upload reports as artifacts, and deliberately avoid `continue-on-error` on any test step.

## Verified quality gates (executed 2026-07-17)

| Check | UI project | API project |
| --- | --- | --- |
| `npm install` | Clean | Clean |
| `npm run lint` | 0 errors, 0 warnings | 0 errors, 0 warnings |
| `npm run typecheck` (strict) | Clean | Clean |
| Test execution | 34/34 passed | 29/29 passed; Newman 37/37 assertions |
| Reports | Playwright HTML + Allure results | Playwright HTML + Newman htmlextra HTML |

## Known limitations (disclosed, not hidden)

- Allure HTML rendering needs Java, which was unavailable on the build machine; `allure-results/` are real and CI uploads them, but no local Allure screenshot exists.
- The GitHub Actions workflows are syntactically complete but have not run yet — they execute on first push to GitHub.
- Single browser (Chromium) for the UI suite; a documented, deliberate trade-off.

## What a reviewer might reasonably ask next

Questions this portfolio should prompt in an interview, which the candidate is prepared to discuss:

- When would you *not* use the Page Object Model?
- Why assert an API's broken behaviour instead of expecting the correct behaviour and letting the test fail?
- How would this suite change if SauceDemo had server-side state?
- What would flaky-test triage look like in the CI setup here?
