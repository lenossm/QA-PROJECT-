# SauceDemo UI Tests

UI automation for https://www.saucedemo.com using Playwright for Java + JUnit 5.

I picked SauceDemo because it has a normal shop flow (login → products → cart → checkout) and stable `data-test` attributes.

## Stack

- Java 17
- Playwright Java
- JUnit 5
- Maven

## Project layout

```
src/test/java/saucedemo/
  base/         BaseTest (browser setup/teardown)
  pages/        Login, Inventory, ProductDetails, Cart, Checkout
  components/   Header, ProductItem
  data/         users, products, checkout info
  utils/        config + price helpers
  tests/        actual test classes
src/test/resources/
  config.properties
docs/
```

## Setup

1. Install JDK 17+ and Maven
2. Install Chromium for Playwright:

```bash
mvn exec:java -e -D exec.mainClass=com.microsoft.playwright.CLI -D exec.args="install chromium"
```

3. Config defaults are already in `config.properties`. Change `headless=false` if you want to watch the browser.

## Run

```bash
mvn test
```

Smoke only:

```bash
mvn test -Dgroups=smoke
```

## What I tested

- Login (valid, wrong password, empty fields, locked user, logout)
- Inventory (6 products, sorting by name/price)
- Product details page
- Cart (add/remove, badge)
- Checkout (validation, tax math at 8%, order complete)
- One end-to-end purchase with 2 products

See `docs/` for the short test plan and case list.
