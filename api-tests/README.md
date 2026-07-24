# Restful Booker API Tests

API tests for https://restful-booker.herokuapp.com using RestAssured + JUnit 5.

Public training API with auth + booking CRUD. Good for practicing positive and negative cases.

## Stack

- Java 17
- RestAssured
- JUnit 5
- Jackson (for request bodies)
- JSON schema validation
- Maven

## Project layout

```
src/test/java/booker/
  base/       shared setup + cleanup
  clients/    AuthClient, BookingClient
  models/     Booking, BookingDates
  data/       BookingFactory (unique lastnames)
  utils/      Config
  tests/      auth, crud, validation, negative, workflow
src/test/resources/
  config.properties
  schemas/    json schemas
docs/
```

## Setup

Need JDK 17+ and Maven. Defaults in `config.properties` work as-is
(`admin` / `password123` are the published demo credentials).

## Run

```bash
mvn test
```

Smoke:

```bash
mvn test -Dgroups=smoke
```

## What I tested

- Auth token (valid + bad credentials)
- Create / read / update / patch / delete booking
- Filter by lastname
- JSON schema on responses
- Response time budget (5s)
- Negative cases (no auth, bad ids, bad payloads)

Note: this API has some weird responses (e.g. failed login returns 200, delete returns 201).
I assert the actual behaviour and wrote them up in `docs/defects.md`.
