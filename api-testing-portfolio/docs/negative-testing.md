# Negative Testing Catalogue — Restful Booker

How negative testing was approached on this API, what was found, and how the findings are handled in automation. Every behaviour below was **actually executed and observed** on 2026-07-17 against https://restful-booker.herokuapp.com.

## Approach

Negative inputs were designed along four axes:

1. **Authentication** — absent, invalid, and malformed credentials or tokens
2. **Resource existence** — operations on IDs that do not exist
3. **Payload structure** — missing fields, wrong types, malformed JSON, empty bodies
4. **Value validity** — syntactically valid JSON carrying semantically invalid values (bad dates)

A key principle in this project: **tests assert the API's actual behaviour, not the behaviour we wish it had.** Where the actual behaviour deviates from HTTP/REST conventions, the test pins the observed status/body (so the suite is green and honest) and the deviation is written up in [defect-samples.md](defect-samples.md).

## Observed behaviour map

| #   | Input                                         | Conventional expectation | Actual observed behaviour                                                                               | Verdict                        |
| --- | --------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 1   | `POST /auth`, wrong username                  | 401 Unauthorized         | 200 + `{"reason": "Bad credentials"}`                                                                   | Deviation — DEF-API-001        |
| 2   | `POST /auth`, wrong password                  | 401 Unauthorized         | 200 + `{"reason": "Bad credentials"}`                                                                   | Deviation — DEF-API-001        |
| 3   | `POST /auth`, empty object                    | 400 or 401               | 200 + `{"reason": "Bad credentials"}`                                                                   | Deviation — DEF-API-001        |
| 4   | `POST /auth`, malformed JSON                  | 400                      | 400 Bad Request                                                                                         | Correct                        |
| 5   | `GET /booking/{nonexistent}`                  | 404                      | 404 Not Found                                                                                           | Correct                        |
| 6   | `PUT /booking/{nonexistent}` + valid token    | 404                      | 405 Method Not Allowed                                                                                  | Deviation — DEF-API-003        |
| 7   | `DELETE /booking/{nonexistent}` + valid token | 404                      | 405 Method Not Allowed                                                                                  | Deviation — DEF-API-003        |
| 8   | `PUT /booking/{id}` without token             | 401/403                  | 403 Forbidden, resource untouched                                                                       | Acceptable (403 is defensible) |
| 9   | `DELETE /booking/{id}` without token          | 401/403                  | 403 Forbidden, resource kept                                                                            | Acceptable                     |
| 10  | `PUT /booking/{id}` with invalid token        | 401/403                  | 403 Forbidden                                                                                           | Acceptable                     |
| 11  | `POST /booking` missing mandatory fields      | 400 with field errors    | **500 Internal Server Error**                                                                           | Defect — DEF-API-004           |
| 12  | `POST /booking` with `totalprice` as string   | 400                      | 200, value silently stored as `null`                                                                    | Defect — DEF-API-005           |
| 13  | `POST /booking` with `checkin: "not-a-date"`  | 400                      | 200, stored as `"0NaN-aN-aN"`                                                                           | Defect — DEF-API-006           |
| 14  | `POST /booking` malformed JSON                | 400                      | 400 Bad Request                                                                                         | Correct                        |
| 15  | `POST /booking` empty body                    | 400                      | 400 Bad Request (via Playwright request; a raw `fetch` probe of the same input produced 500 — see note) | Correct at the boundary tested |

**Note on #15:** during exploratory probing, an empty body sent via Node's `fetch` (no `Content-Length` normalisation) returned 500, while the same logical request through Playwright's request context returned 400. This kind of client-dependent difference is worth knowing about; the automated test pins the behaviour of the client it uses.

## Why the suite asserts deviations instead of failing on them

A permanently red suite trains people to ignore it. Since Restful Booker is a training API whose quirks are stable and intentional, the professional options are:

- assert actual behaviour + document the deviation as a defect (chosen here), or
- mark such tests as expected failures, which hides the information in tooling.

In a real project this decision would belong to the team: the defect reports in `defect-samples.md` are written exactly as they would be filed in Jira, and if a fix shipped, the pinned assertions would fail loudly and get updated.
