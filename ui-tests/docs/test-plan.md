# UI test plan (short)

**App:** SauceDemo (https://www.saucedemo.com)
**Goal:** automate the main shop flows for my portfolio

## Scope

In scope:
- login / logout
- product list + sorting
- product details
- cart
- checkout (including tax)
- one full purchase path

Out of scope:
- problem_user / error_user accounts
- visual testing
- mobile browsers

## Approach

- Page Object Model
- Chromium only (keeps runs faster)
- locators mostly use `data-test`
- each test gets a fresh browser context

## Tags

- `smoke` – quick critical checks
- `regression` – full set
- `negative` – error cases
- `e2e` – full purchase

## Entry / exit

Entry: app is up, credentials from config work
Exit: smoke suite passes; no blockers on critical path
