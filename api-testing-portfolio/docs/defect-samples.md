# Defect Reports — Restful Booker

Six defect reports written the way they would be filed in a tracker such as Jira. Every defect labelled **Reproduced defect** was genuinely reproduced against the live API on 2026-07-17 and is pinned by an automated test in this repository, so the evidence can be re-created at any time by running the suite.

> Context: Restful Booker is a training API and some of these behaviours are intentional teaching material. They are still written up as real defects because that is exactly the skill being demonstrated — observing, minimising and reporting deviations precisely.

---

## DEF-API-001 — Failed authentication returns 200 OK instead of 401

| Field              | Value                                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                                                                                                        |
| Environment        | https://restful-booker.herokuapp.com, tested via Playwright request context and Newman, 2026-07-17                                                                                           |
| Preconditions      | None                                                                                                                                                                                         |
| Steps to reproduce | 1. `POST /auth` with `Content-Type: application/json` and body `{"username": "not_a_real_user", "password": "password123"}`.                                                                 |
| Expected result    | `401 Unauthorized` (RFC 9110: request lacks valid authentication credentials), body with a machine-readable error                                                                            |
| Actual result      | `200 OK` with body `{"reason": "Bad credentials"}`                                                                                                                                           |
| Severity           | Major — clients cannot distinguish success from failure by status code; any standard HTTP client treats this response as success                                                             |
| Priority           | High                                                                                                                                                                                         |
| Evidence           | Automated: `playwright-api/tests/auth.spec.ts` ("Authentication — negative") and Postman folder "Auth — negative" assert this exact behaviour on every run                                   |
| Notes              | Applies equally to wrong username, wrong password and missing credentials — the three cases are indistinguishable, which is acceptable (avoids user enumeration), but the status code is not |

## DEF-API-002 — Successful DELETE returns 201 Created

| Field              | Value                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                          |
| Environment        | https://restful-booker.herokuapp.com, 2026-07-17                                                               |
| Preconditions      | A booking exists; a valid token is held                                                                        |
| Steps to reproduce | 1. Create a booking via `POST /booking`. 2. `DELETE /booking/{id}` with `Cookie: token=<valid>`.               |
| Expected result    | `204 No Content` (or `200 OK`) — the request deleted a resource, nothing was created                           |
| Actual result      | `201 Created` with text body `Created`                                                                         |
| Severity           | Minor — deletion works correctly (subsequent GET returns 404); only the status semantics are wrong             |
| Priority           | Low                                                                                                            |
| Evidence           | Automated: `booking-crud.spec.ts` ("deleted booking is no longer accessible") and the Postman lifecycle folder |
| Notes              | Misleading for API consumers generating clients from the behaviour rather than the docs                        |

## DEF-API-003 — Write operations on nonexistent bookings return 405 instead of 404

| Field              | Value                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                                |
| Environment        | https://restful-booker.herokuapp.com, 2026-07-17                                                                     |
| Preconditions      | Valid token; booking ID `99999999` does not exist                                                                    |
| Steps to reproduce | 1. `PUT /booking/99999999` with a valid payload and token. 2. `DELETE /booking/99999999` with a valid token.         |
| Expected result    | `404 Not Found` for both — the URI identifies no resource                                                            |
| Actual result      | `405 Method Not Allowed` for both                                                                                    |
| Severity           | Minor — an incorrect but consistent error code; GET on the same ID correctly returns 404                             |
| Priority           | Low                                                                                                                  |
| Evidence           | Automated: `booking-negative.spec.ts` and Postman "Booking — negative"                                               |
| Notes              | 405 tells the client "this method is never allowed here", which is false — the method works when the resource exists |

## DEF-API-004 — Missing mandatory fields cause 500 instead of a validation error

| Field              | Value                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                                             |
| Environment        | https://restful-booker.herokuapp.com, 2026-07-17                                                                                  |
| Preconditions      | None                                                                                                                              |
| Steps to reproduce | 1. `POST /booking` with `Content-Type: application/json` and body `{"firstname": "OnlyFirstName"}`.                               |
| Expected result    | `400 Bad Request` listing the missing mandatory fields (`lastname`, `totalprice`, `depositpaid`, `bookingdates`)                  |
| Actual result      | `500 Internal Server Error` with text body `Internal Server Error`                                                                |
| Severity           | Major — the server crashes on foreseeable client input; no input validation layer exists in front of the persistence code         |
| Priority           | High                                                                                                                              |
| Evidence           | Automated: `booking-negative.spec.ts` ("creating a booking without mandatory fields fails") and Postman "Booking — negative"      |
| Notes              | 5xx responses typically page an on-call engineer; client errors misclassified as server errors pollute error budgets and alerting |

## DEF-API-005 — Wrongly typed totalprice silently stored as null

| Field              | Value                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                                                                       |
| Environment        | https://restful-booker.herokuapp.com, 2026-07-17                                                                                                            |
| Preconditions      | None                                                                                                                                                        |
| Steps to reproduce | 1. `POST /booking` with an otherwise valid payload where `"totalprice": "not-a-number"`. 2. Read `booking.totalprice` in the response (or GET the booking). |
| Expected result    | `400 Bad Request` — type mismatch on a mandatory numeric field                                                                                              |
| Actual result      | `200 OK`; the booking is created with `totalprice: null` — the sent value is silently discarded                                                             |
| Severity           | Major — silent data corruption: the client believes the price was stored                                                                                    |
| Priority           | High                                                                                                                                                        |
| Evidence           | Automated: `booking-negative.spec.ts` ("creating a booking with a wrongly typed price is not stored faithfully")                                            |
| Notes              | In a real booking system this would corrupt financial data; worse than rejecting the request outright                                                       |

## DEF-API-006 — Invalid date strings accepted and stored as garbage

| Field              | Value                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Label              | **Reproduced defect**                                                                                                                 |
| Environment        | https://restful-booker.herokuapp.com, 2026-07-17                                                                                      |
| Preconditions      | None                                                                                                                                  |
| Steps to reproduce | 1. `POST /booking` with an otherwise valid payload where `bookingdates.checkin` is `"not-a-date"`. 2. Read the stored check-in value. |
| Expected result    | `400 Bad Request` — `checkin` must be a valid `YYYY-MM-DD` date                                                                       |
| Actual result      | `200 OK`; the stored check-in is the string `"0NaN-aN-aN"` (an unparsed JavaScript `Date` serialisation)                              |
| Severity           | Major — garbage persisted into a date field breaks any consumer that parses it                                                        |
| Priority           | Medium                                                                                                                                |
| Evidence           | Automated: `booking-negative.spec.ts` ("creating a booking with an invalid check-in date is not rejected")                            |
| Notes              | The `0NaN-aN-aN` shape indicates `new Date(input)` output formatted without validity checking                                         |
