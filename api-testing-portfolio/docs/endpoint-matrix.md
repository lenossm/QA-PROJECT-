# Endpoint Coverage Matrix — Restful Booker

Coverage of every documented endpoint across the two tool chains. "PW" = Playwright suite (`playwright-api/tests/`), "PM" = Postman collection run by Newman.

| Endpoint        | Method | Scenario                                                                 | PW  | PM  |
| --------------- | ------ | ------------------------------------------------------------------------ | :-: | :-: |
| `/ping`         | GET    | Health check returns 201                                                 |  —  |  ✔  |
| `/auth`         | POST   | Valid credentials → 200 + token                                          |  ✔  |  ✔  |
| `/auth`         | POST   | Invalid username → `Bad credentials`                                     |  ✔  |  ✔  |
| `/auth`         | POST   | Invalid password → `Bad credentials`                                     |  ✔  |  ✔  |
| `/auth`         | POST   | Missing credentials → `Bad credentials`                                  |  ✔  |  ✔  |
| `/auth`         | POST   | Malformed JSON → 400                                                     |  ✔  |  ✔  |
| `/booking`      | POST   | Create with generated data → 200, ID, stored payload equals sent payload |  ✔  |  ✔  |
| `/booking`      | POST   | Response matches JSON schema                                             |  ✔  |  ✔  |
| `/booking`      | POST   | Missing mandatory fields → 500 (defect DEF-API-004)                      |  ✔  |  ✔  |
| `/booking`      | POST   | Wrong field type accepted, value corrupted to null (defect DEF-API-005)  |  ✔  |  —  |
| `/booking`      | POST   | Invalid date stored as `0NaN-aN-aN` (defect DEF-API-006)                 |  ✔  |  —  |
| `/booking`      | POST   | Malformed JSON → 400                                                     |  ✔  |  ✔  |
| `/booking`      | POST   | Empty body → 400                                                         |  ✔  |  —  |
| `/booking`      | GET    | ID list, schema-valid, non-empty                                         |  ✔  |  ✔  |
| `/booking`      | GET    | Filter by unique lastname finds the created booking                      |  ✔  |  ✔  |
| `/booking/{id}` | GET    | Existing booking → 200, all fields and types correct                     |  ✔  |  ✔  |
| `/booking/{id}` | GET    | JSON schema validation                                                   |  ✔  |  ✔  |
| `/booking/{id}` | GET    | Content-Type header verification                                         |  ✔  |  ✔  |
| `/booking/{id}` | GET    | Response time within documented budget                                   |  ✔  |  ✔  |
| `/booking/{id}` | GET    | Nonexistent ID → 404                                                     |  ✔  |  ✔  |
| `/booking/{id}` | GET    | Deleted booking → 404                                                    |  ✔  |  ✔  |
| `/booking/{id}` | PUT    | Authenticated full update → 200, values replaced and persisted           |  ✔  |  ✔  |
| `/booking/{id}` | PUT    | Without token → 403, resource untouched                                  |  ✔  |  ✔  |
| `/booking/{id}` | PUT    | Invalid token → 403                                                      |  ✔  |  ✔  |
| `/booking/{id}` | PUT    | Nonexistent ID → 405 (defect DEF-API-003)                                |  ✔  |  ✔  |
| `/booking/{id}` | PATCH  | Authenticated partial update merges fields                               |  ✔  |  ✔  |
| `/booking/{id}` | DELETE | Authenticated delete → 201 (defect DEF-API-002), then 404 on read        |  ✔  |  ✔  |
| `/booking/{id}` | DELETE | Without token → 403, resource kept                                       |  ✔  |  ✔  |
| `/booking/{id}` | DELETE | Nonexistent ID → 405 (defect DEF-API-003)                                |  ✔  |  ✔  |

**Chained lifecycle workflow** (token → create → read → PUT → PATCH → delete → verify 404) is implemented in both tool chains: `booking-workflow.spec.ts` and the Postman folder "Booking lifecycle (chained)".
