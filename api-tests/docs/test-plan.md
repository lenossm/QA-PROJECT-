# API test plan (short)

**API:** Restful Booker
**Base URL:** https://restful-booker.herokuapp.com

## Scope

- POST /auth
- Booking CRUD (POST/GET/PUT/PATCH/DELETE)
- Filter GET /booking
- Schema + basic timing check
- Negative cases

Out of scope: XML payloads, basic auth header variant

## Notes

This is a shared public API. Other people's bookings exist and the DB can reset.
I generate unique lastnames and clean up bookings I create.

Auth for writes uses cookie: `token=<value>`.
