# Test Cases — Restful Booker API

Detailed test cases for the Restful Booker API. Every case is automated; _Automated in_ names the implementation (PW = `playwright-api/tests/`, PM = Postman collection folder).

**Shared test data**

| Key               | Value                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Credentials       | `admin` / `password123` — published training credentials, injected via `.env`                                                                                                   |
| Generated booking | Unique per run: firstname `Elene`, lastname `PortfolioTest-<timestamp>-<seq>` (PW) / `PostmanRun-<timestamp>` (PM), random price 100–999, check-in +30 days, check-out +35 days |
| Nonexistent ID    | `99999999`                                                                                                                                                                      |

Priorities: **P1** = critical, **P2** = important, **P3** = nice to have.

---

## Authentication

### TC-API-001 — Create token with valid credentials

| Field           | Value                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                                     |
| Test data       | Valid credentials                                                                                 |
| Steps           | 1. `POST /auth` with valid username/password.                                                     |
| Expected result | 200; `Content-Type: application/json`; body matches the token schema; token is a non-empty string |
| Priority / Type | P1 / Positive                                                                                     |
| Automation      | PW `auth.spec.ts`, PM "Auth — positive"                                                           |

### TC-API-002 — Token refused for invalid username

| Field           | Value                                                                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                                                                                                                   |
| Test data       | Username `not_a_real_user`, valid password                                                                                                                                      |
| Steps           | 1. `POST /auth`.                                                                                                                                                                |
| Expected result | Actual behaviour: 200 with body exactly `{"reason": "Bad credentials"}` and no `token` property. (Conventional expectation would be 401 — deviation documented as DEF-API-001.) |
| Priority / Type | P1 / Negative                                                                                                                                                                   |
| Automation      | PW `auth.spec.ts`, PM "Auth — negative"                                                                                                                                         |

### TC-API-003 — Token refused for invalid password

As TC-API-002 with a valid username and wrong password; same expected behaviour. P1 / Negative. PW `auth.spec.ts`, PM "Auth — negative".

### TC-API-004 — Token refused for missing credentials

As TC-API-002 with an empty JSON object `{}`; same expected behaviour. P2 / Negative. PW `auth.spec.ts`, PM "Auth — negative".

### TC-API-005 — Malformed auth request body

| Field           | Value                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                 |
| Test data       | Raw body `{"username": "admin", ` (truncated JSON)                            |
| Steps           | 1. `POST /auth` with the malformed body and `Content-Type: application/json`. |
| Expected result | 400 Bad Request                                                               |
| Priority / Type | P2 / Negative                                                                 |
| Automation      | PW `auth.spec.ts`, PM "Auth — negative"                                       |

## Booking CRUD — positive

### TC-API-006 — Create a booking

| Field           | Value                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                                       |
| Test data       | Generated booking (shared data)                                                                     |
| Steps           | 1. `POST /booking` with the generated payload. 2. Compare the echoed booking with the sent payload. |
| Expected result | 200; body contains `bookingid` > 0; `booking` equals the sent payload field for field               |
| Priority / Type | P1 / Positive                                                                                       |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder                                                      |

### TC-API-007 — Retrieve a booking by ID

| Field           | Value                                                   |
| --------------- | ------------------------------------------------------- |
| Preconditions   | A booking created by the test (ID captured dynamically) |
| Test data       | Generated booking                                       |
| Steps           | 1. `GET /booking/{id}`.                                 |
| Expected result | 200; every stored field equals the created payload      |
| Priority / Type | P1 / Positive                                           |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder          |

### TC-API-008 — Booking ID list contains the created booking

| Field           | Value                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | A booking with a unique generated lastname exists                                                                                                 |
| Test data       | Filter `lastname=<unique value>`                                                                                                                  |
| Steps           | 1. `GET /booking?lastname=...`.                                                                                                                   |
| Expected result | 200; array of `{bookingid}` objects; contains the created ID (filtering keeps the test independent from other users' data on the shared instance) |
| Priority / Type | P2 / Positive                                                                                                                                     |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder                                                                                                    |

### TC-API-009 — Full update (PUT)

| Field           | Value                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Preconditions   | Booking exists; valid token                                                                                  |
| Test data       | A second generated payload with different values                                                             |
| Steps           | 1. `PUT /booking/{id}` with `Cookie: token=...`. 2. `GET /booking/{id}` to confirm persistence.              |
| Expected result | 200; PUT response equals the replacement payload; a subsequent GET returns the replacement, not the original |
| Priority / Type | P1 / Positive                                                                                                |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder                                                               |

### TC-API-010 — Partial update (PATCH)

| Field           | Value                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| Preconditions   | Booking exists; valid token                                                     |
| Test data       | `{firstname: "Patched", totalprice: 555}`                                       |
| Steps           | 1. `PATCH /booking/{id}` with the partial body.                                 |
| Expected result | 200; changed fields updated; every other field identical to the pre-PATCH state |
| Priority / Type | P1 / Positive                                                                   |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder                                  |

### TC-API-011 — Delete a booking and verify inaccessibility

| Field           | Value                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Preconditions   | Booking exists; valid token                                                                             |
| Test data       | —                                                                                                       |
| Steps           | 1. `DELETE /booking/{id}` with the token. 2. `GET /booking/{id}`.                                       |
| Expected result | Actual behaviour: DELETE answers 201 (deviation from 200/204 — DEF-API-002); subsequent GET answers 404 |
| Priority / Type | P1 / Positive                                                                                           |
| Automation      | PW `booking-crud.spec.ts`, PM lifecycle folder                                                          |

## Contract validation

### TC-API-012 — Create response JSON schema

`POST /booking` response validates against the created-booking schema (`bookingid` integer ≥ 1, complete typed `booking` object, no extra properties). P2 / Positive. PW `booking-validation.spec.ts` (Ajv), PM lifecycle folder (`pm.response.to.have.jsonSchema`).

### TC-API-013 — Get response JSON schema and field types

`GET /booking/{id}` response validates against the booking schema: strings, number, boolean, `date`-formatted check-in/check-out. P2 / Positive. PW `booking-validation.spec.ts`, PM lifecycle folder.

### TC-API-014 — Booking list JSON schema

`GET /booking` returns a non-empty array in which every entry is exactly `{bookingid: integer}`. P3 / Positive. PW `booking-validation.spec.ts`, PM lifecycle folder.

### TC-API-015 — Response headers

`GET /booking/{id}` responds with `Content-Type: application/json; charset=utf-8`. P3 / Positive. PW `booking-validation.spec.ts`, PM (auth + create requests).

### TC-API-016 — Response time budget

| Field           | Value                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| Preconditions   | Booking exists                                                                                            |
| Test data       | Budget: 5000 ms (configurable `RESPONSE_TIME_BUDGET_MS`; generous because the free-tier host cold-starts) |
| Steps           | 1. Time a `GET /booking/{id}` round trip.                                                                 |
| Expected result | Response completes within the budget. Observed in the recorded runs: ~160–760 ms                          |
| Priority / Type | P3 / Non-functional (sanity)                                                                              |
| Automation      | PW `booking-validation.spec.ts`, PM ping + get requests                                                   |

### TC-API-017 — Create/update round-trip consistency

Stored values equal sent values both after creation and after a full update (read back with GET each time). P1 / Positive. PW `booking-validation.spec.ts`.

## Negative scenarios

### TC-API-018 — Get nonexistent booking

`GET /booking/99999999` → 404 Not Found. P1 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-019 — Update nonexistent booking

`PUT /booking/99999999` with a valid token → actual behaviour 405 Method Not Allowed (conventional expectation 404 — DEF-API-003). P2 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-020 — Delete nonexistent booking

`DELETE /booking/99999999` with a valid token → 405 (same deviation as TC-API-019). P2 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-021 — Update without authentication

| Field           | Value                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Preconditions   | Booking exists                                                          |
| Test data       | Valid replacement payload, **no** token header                          |
| Steps           | 1. `PUT /booking/{id}` without a Cookie header. 2. `GET /booking/{id}`. |
| Expected result | 403 Forbidden; the stored booking is unchanged                          |
| Priority / Type | P1 / Negative, security-related                                         |
| Automation      | PW `booking-negative.spec.ts`, PM "Booking — negative"                  |

### TC-API-022 — Delete without authentication

`DELETE /booking/{id}` without a token → 403; a follow-up GET still returns 200. P1 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-023 — Invalid authentication token

`PUT /booking/{id}` with `Cookie: token=invalid-token-123` → 403. P1 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-024 — Create with missing mandatory fields

| Field           | Value                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                                              |
| Test data       | `{"firstname": "OnlyFirstName"}`                                                                           |
| Steps           | 1. `POST /booking`.                                                                                        |
| Expected result | Actual behaviour: 500 Internal Server Error — the API crashes instead of validating with 400 (DEF-API-004) |
| Priority / Type | P2 / Negative                                                                                              |
| Automation      | PW `booking-negative.spec.ts`, PM "Booking — negative"                                                     |

### TC-API-025 — Create with wrong field type

| Field           | Value                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                                                         |
| Test data       | Valid payload with `totalprice: "not-a-number"`                                                                       |
| Steps           | 1. `POST /booking`. 2. Inspect the stored value.                                                                      |
| Expected result | Actual behaviour: 200, but `totalprice` is silently stored as `null` — data corruption without an error (DEF-API-005) |
| Priority / Type | P2 / Negative                                                                                                         |
| Automation      | PW `booking-negative.spec.ts`                                                                                         |

### TC-API-026 — Create with invalid date value

| Field           | Value                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| Preconditions   | API reachable                                                                           |
| Test data       | Valid payload with `checkin: "not-a-date"`                                              |
| Steps           | 1. `POST /booking`. 2. Inspect the stored check-in date.                                |
| Expected result | Actual behaviour: 200, check-in stored as the garbage string `0NaN-aN-aN` (DEF-API-006) |
| Priority / Type | P2 / Negative                                                                           |
| Automation      | PW `booking-negative.spec.ts`                                                           |

### TC-API-027 — Malformed JSON on booking creation

`POST /booking` with raw body `{"firstname": ` → 400 Bad Request. P2 / Negative. PW `booking-negative.spec.ts`, PM "Booking — negative".

### TC-API-028 — Empty request body

`POST /booking` with a zero-length body and JSON content type → 400 Bad Request. P3 / Negative. PW `booking-negative.spec.ts`.

## Workflow

### TC-API-029 — Full booking lifecycle with dynamic data

| Field           | Value                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Preconditions   | API reachable                                                                                                                                                                                                                              |
| Test data       | All generated at runtime; the booking ID is captured from the create response and reused throughout                                                                                                                                        |
| Steps           | 1. Create a token. 2. Create a booking. 3. Retrieve it by the captured ID. 4. Fully update it (PUT) and verify the new values. 5. Partially update one field (PATCH) and verify the merge. 6. Delete it. 7. Verify the ID now returns 404. |
| Expected result | Every step succeeds with the statuses and bodies described in TC-API-006..011; no hardcoded IDs anywhere                                                                                                                                   |
| Priority / Type | P1 / Positive, end-to-end                                                                                                                                                                                                                  |
| Automation      | PW `booking-workflow.spec.ts`, PM "Booking lifecycle (chained)"                                                                                                                                                                            |

### TC-API-030 — Service health check

`GET /ping` → 201 Created (documented health-check response) within the response-time budget. P3 / Positive. PM "Health".
