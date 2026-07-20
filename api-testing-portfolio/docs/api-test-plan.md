# API Test Plan — Restful Booker

|                   |                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| API under test    | [Restful Booker](https://restful-booker.herokuapp.com/) — public training API for a hotel booking service |
| API documentation | https://restful-booker.herokuapp.com/apidoc/index.html                                                    |
| Document owner    | Elene Molashvili                                                                                          |
| Project type      | Independent QA automation portfolio project                                                               |
| Version           | 1.0                                                                                                       |

## 1. Objective

Verify the Restful Booker API's authentication, booking CRUD behaviour, response contracts and error handling, using two complementary tool chains — Playwright `APIRequestContext` (TypeScript) and a Postman collection run by Newman — and honestly document where the API deviates from HTTP/REST conventions.

## 2. Scope

**In scope**

- `POST /auth` — token creation, all credential failure modes, malformed body
- `POST /booking`, `GET /booking`, `GET /booking/{id}`, `PUT /booking/{id}`, `PATCH /booking/{id}`, `DELETE /booking/{id}` — the full CRUD lifecycle
- Contract validation: status codes, headers, body fields, field types, JSON schema
- Response-time sanity check against a documented budget (5000 ms, configurable)
- Negative scenarios: nonexistent resources, missing/invalid/absent authentication, missing mandatory fields, wrong field types, malformed JSON, invalid dates, empty bodies
- `GET /ping` health check (Postman)

**Out of scope**

- Load and performance testing beyond the single response-time budget check
- Security testing beyond authentication-requirement checks (no fuzzing, no injection testing)
- Basic-auth header authentication variant (the token/cookie variant is covered; both grant the same access)
- XML payload variants (the API optionally accepts XML; JSON is the primary documented contract)

## 3. Assumptions and constraints

- Restful Booker is a **shared public instance**: other users' data exists alongside test data, and the database resets periodically. Tests therefore generate unique data per run and never assert on global state (e.g. exact list contents).
- The API is **intentionally imperfect** — it ships with known deviations (e.g. 200 instead of 401 on bad credentials). Tests assert the _actual, reproduced_ behaviour so they are stable and honest, and each deviation is written up in `defect-samples.md`.
- The free-tier host can respond slowly on cold starts; the response-time budget is deliberately generous and configurable via `RESPONSE_TIME_BUDGET_MS`.

## 4. Test environment

| Item                           | Value                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Base URL                       | https://restful-booker.herokuapp.com (configurable via `API_BASE_URL`)                          |
| Credentials                    | `admin` / `password123` — published training credentials from the API docs, injected via `.env` |
| Runner 1                       | Playwright Test (`APIRequestContext`) + TypeScript + Ajv for JSON schema validation             |
| Runner 2                       | Newman (CLI) executing the Postman collection, `htmlextra` HTML reporter                        |
| OS / Node for the recorded run | Windows 11, Node v22.18.0                                                                       |

## 5. Test approach

- **Two independent tool chains** cover the same API so results can be cross-checked: the Playwright suite is the engineering-style, typed, schema-validated suite; the Postman collection demonstrates collection design, chained requests, pre-request scripts and JavaScript assertions.
- **Dynamic data only**: a factory (`playwright-api/data/booking.factory.ts`) and pre-request scripts generate unique bookings per run; no test relies on a hardcoded booking ID.
- **Cleanup**: bookings created by tests are deleted afterwards (fixture teardown in Playwright, an explicit cleanup request in Postman). Deletion is verified as part of the lifecycle tests.
- **Suites**: positive (`auth`, `booking-crud`, `booking-validation`), negative (`booking-negative`, auth negative cases), and one chained lifecycle workflow (`booking-workflow`). Tags: `@smoke`, `@regression`, `@negative`, `@e2e`.

## 6. Entry criteria

- `npm install` completes; lint and typecheck pass.
- `GET /ping` returns 201 (service healthy).

## 7. Exit criteria

- All in-scope tests executed; each failure classified as framework defect (fixed), API defect (documented in `defect-samples.md`) or environment issue (documented).
- Newman HTML report and Playwright HTML report generated from real runs.
- Test summary report completed (`test-summary-report.md`).

## 8. Deliverables

- Playwright API suite (29 tests) and Postman collection (23 requests / 37 assertions)
- Endpoint coverage matrix (`endpoint-matrix.md`)
- Detailed test cases (`test-cases.md`) and negative-testing catalogue (`negative-testing.md`)
- Defect samples (`defect-samples.md`)
- Test summary report (`test-summary-report.md`)
- CI workflow (`.github/workflows/api-tests.yml`)

## 9. Risks

| Risk                                                    | Mitigation                                                                                      |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Shared instance data interference                       | Unique generated names; filtering by the unique value when listing                              |
| Periodic database reset mid-run                         | Each test creates what it needs; runs are short (~7 s)                                          |
| Transient 5xx from the free host                        | One retry locally, two in CI, with results reviewed rather than blindly trusted                 |
| API behaviour changes (it is a maintained training app) | Assertions pin actual behaviour; a change fails loudly and the defect docs explain the baseline |
