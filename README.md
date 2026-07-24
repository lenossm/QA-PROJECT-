# QA Automation Portfolio

Hi, I'm Elene Molashvili. This is my QA portfolio with two Java projects I built while practicing test automation.

1. **ui-tests** – Playwright UI tests for [SauceDemo](https://www.saucedemo.com/)
2. **api-tests** – RestAssured API tests for [Restful Booker](https://restful-booker.herokuapp.com/)

I used Java 17, JUnit 5 and Maven for both.

---

## What's inside

```
qa-automation-portfolio/
├── ui-tests/     SauceDemo UI automation (Page Object Model)
├── api-tests/    Restful Booker API tests
└── README.md
```

---

## Requirements

- JDK 17+ (I use JDK 21 locally, project targets 17)
- Maven 3.9+
- For UI tests: Playwright browsers (`mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install chromium"` from `ui-tests`)

---

## UI tests (SauceDemo)

```bash
cd ui-tests
mvn test
```

Run only smoke tests:

```bash
mvn test -Dgroups=smoke
```

Config is in `src/test/resources/config.properties` (demo login: `standard_user` / `secret_sauce`).

Covers login, inventory sorting, cart, checkout totals, and one full purchase flow.

More details: [ui-tests/README.md](ui-tests/README.md)

---

## API tests (Restful Booker)

```bash
cd api-tests
mvn test
```

Config is in `src/test/resources/config.properties` (demo auth: `admin` / `password123`).

Covers token auth, booking CRUD, schema checks, negative cases, and a full create → update → delete flow.

I also wrote up a few real API quirks I found (wrong status codes, weak validation) in `api-tests/docs/defects.md`.

More details: [api-tests/README.md](api-tests/README.md)

---

## Contact

- GitHub: https://github.com/lenossm
- LinkedIn: https://www.linkedin.com/in/elene-molashvili-54952b2b9
