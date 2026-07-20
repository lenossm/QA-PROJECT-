# REST API Testing Portfolio — Restful Booker

API test automation for [Restful Booker](https://restful-booker.herokuapp.com/), a public hotel-booking training API, using two complementary tool chains:

1. **Playwright `APIRequestContext` + TypeScript** — typed clients, fixtures, Ajv JSON-schema validation
2. **Postman collection run by Newman** — chained requests, pre-request scripts, JavaScript assertions, HTML reporting

Independent QA portfolio project by **Elene Molashvili** — Junior QA Engineer focused on manual testing, API validation, and reliable test automation. Not a commercial project; no production users.

## What this project shows

- Full CRUD lifecycle testing with **dynamically generated data** — no hardcoded booking IDs anywhere
- JSON schema validation (Ajv in code, `pm.response.to.have.jsonSchema` in Postman)
- Systematic negative testing: auth failures, nonexistent resources, malformed payloads, wrong types, invalid dates
- **Honest defect reporting**: Restful Booker deliberately deviates from REST conventions in places; the tests assert the actual reproduced behaviour and six defects are written up as they would be filed in Jira ([docs/defect-samples.md](docs/defect-samples.md))
- Cleanup: bookings created by tests are deleted in fixture teardown / an explicit cleanup request
- The same lifecycle implemented in both tool chains, so results can be cross-checked

## Why Restful Booker

It offers everything an API-testing portfolio needs in one target: token authentication, full CRUD, filtering, and — most valuably — real, stable defects (missing validation, wrong status codes) that make negative testing and defect reporting genuine rather than staged.

## Technology stack

| Tool                                  | Role                                              |
| ------------------------------------- | ------------------------------------------------- |
| Playwright Test (`APIRequestContext`) | Code-based API suite and HTML report              |
| TypeScript (strict)                   | Typed clients, factory, schemas                   |
| Ajv + ajv-formats                     | JSON schema validation with date format checking  |
| Postman + Newman                      | Collection-based suite, CLI execution             |
| newman-reporter-htmlextra             | Readable HTML report for the collection run       |
| ESLint / Prettier                     | Quality gates                                     |
| dotenv                                | `API_BASE_URL`, credentials, response-time budget |
| GitHub Actions                        | CI                                                |

## Architecture

```
playwright-api/
  tests/        auth, booking-crud, booking-validation, booking-negative,
                booking-workflow (chained lifecycle) — assertions live here
  clients/      AuthClient, BookingClient — thin request wrappers that own
                URLs and auth headers, nothing else
  fixtures/     token fixture (valid auth token per test) and
                existingBooking fixture (created before, deleted after)
  schemas/      JSON schemas for every response contract
  data/         booking.factory.ts — unique payload per call
  utils/        env access, Ajv schema assertion helper
postman/
  collections/  restful-booker.postman_collection.json
  environments/ restful-booker.postman_environment.json
  reports/      Newman htmlextra output (generated, git-ignored)
docs/           API test plan, endpoint matrix, test cases,
                negative-testing catalogue, defect samples, summary report
.github/workflows/api-tests.yml
```

The clients deliberately do **not** wrap Playwright's response API — tests read `response.status()` and `response.json()` directly, so there is no needless abstraction layer to learn.

## Covered scenarios

- **Auth:** valid token creation; invalid username/password; missing credentials; malformed JSON
- **CRUD:** create, read by ID, list/filter, full update (with persistence check), partial update, delete, deleted-resource verification
- **Contract:** status codes, headers, field values, field types, JSON schema, response-time budget, create/update round-trip consistency
- **Negative:** nonexistent resource reads/writes, missing/invalid/absent tokens, missing mandatory fields, wrong types, invalid dates, malformed JSON, empty bodies
- **Workflow:** token → create → read → PUT → PATCH → delete → verify 404, all with generated data

Full catalogue: [docs/test-cases.md](docs/test-cases.md) (30 cases) and [docs/endpoint-matrix.md](docs/endpoint-matrix.md).

## Setup

Requirements: Node.js 18+ (developed on 22), npm.

```bash
npm install
cp .env.example .env   # defaults work as-is; see note below
```

The `admin` / `password123` credentials are published in the Restful Booker API documentation — they are training data, not secrets. The same applies to the exported Postman environment. They are still routed through configuration to demonstrate the pattern real projects require.

## Running tests

| Command                                                 | What it does                                                     |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run test`                                          | Playwright API suite (29 tests)                                  |
| `npm run test:report`                                   | Opens the Playwright HTML report                                 |
| `npm run postman:test`                                  | Newman run of the Postman collection (CLI output)                |
| `npm run postman:report`                                | Newman run + HTML report at `postman/reports/newman-report.html` |
| `npm run lint` / `npm run typecheck` / `npm run format` | Quality gates                                                    |

## CI

`.github/workflows/api-tests.yml` runs on push and pull request:

1. **quality-gates** — `npm ci`, lint, format check, typecheck
2. **playwright-api** — the Playwright suite, report uploaded as artifact
3. **newman** — the collection with the htmlextra reporter, report uploaded as artifact

npm caching via `actions/setup-node`. Test steps do not use `continue-on-error`.

## Test results

Latest local runs (2026-07-17, Windows 11, Node 22): Playwright **29/29 passed** (6.9 s); Newman **37/37 assertions passed** across 23 requests (6.2 s). Details, including the one incorrect test expectation found and fixed, are in [docs/test-summary-report.md](docs/test-summary-report.md).

## Known limitations

- Restful Booker is a shared public instance: other users' data coexists and the database resets periodically. Tests generate unique data and never assert global state, but a rare mid-run reset could still fail a test.
- The API's known deviations are asserted as-is (documented in [docs/negative-testing.md](docs/negative-testing.md)); if the API is ever fixed, those tests will fail intentionally until updated.
- XML payload variants and the basic-auth header variant are out of scope.

## Future improvements

- Scheduled (cron) CI run to detect upstream behaviour changes
- Coverage of the XML content-type variant
- Contract tests generated from an OpenAPI specification, if one is published

## Author

**Elene Molashvili** — Junior QA Engineer focused on manual testing, API validation, and reliable test automation.

- GitHub: [github.com/lenossm](https://github.com/lenossm)
- LinkedIn: [linkedin.com/in/elene-molashvili-54952b2b9](https://www.linkedin.com/in/elene-molashvili-54952b2b9)
