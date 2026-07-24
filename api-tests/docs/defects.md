# Defects I found on Restful Booker

These are real behaviours I hit while testing. The automated tests pin them so I remember.

## DEF-API-001 — Bad login returns 200

- Steps: POST /auth with wrong username
- Expected: 401
- Actual: 200 + `{"reason":"Bad credentials"}`
- Severity: Major

## DEF-API-002 — DELETE returns 201

- Steps: DELETE /booking/{id} with valid token
- Expected: 204 or 200
- Actual: 201 Created
- Severity: Minor (delete still works, GET then 404)

## DEF-API-003 — Write operations on nonexistent bookings return 405

- Steps: PUT or DELETE /booking/99999999 with a valid token
- Expected: 404
- Actual: 405 Method Not Allowed
- Severity: Minor

## DEF-API-004 — Incomplete body returns 500

- Steps: POST /booking with only `firstname`
- Expected: 400 with validation message
- Actual: 500 Internal Server Error
- Severity: Major

## DEF-API-005 — Bad totalprice becomes null

- Steps: POST booking with `"totalprice": "not-a-number"`
- Expected: 400
- Actual: 200 and `totalprice: null`
- Severity: Major

## DEF-API-006 — Bad checkin date stored as 0NaN-aN-aN

- Steps: POST booking with checkin `"not-a-date"`
- Expected: 400
- Actual: 200 and checkin `"0NaN-aN-aN"`
- Severity: Major
