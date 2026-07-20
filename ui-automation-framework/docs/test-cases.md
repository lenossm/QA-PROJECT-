# Test Cases — SauceDemo UI

Detailed test cases for the SauceDemo store. Every case is automated in this repository; the _Automated in_ field names the spec file. Shared test data is defined once here and referenced by the cases.

**Shared test data**

| Key               | Value                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| `standard_user`   | Username `standard_user`, password `secret_sauce` (public demo credentials)                               |
| `locked_out_user` | Username `locked_out_user`, password `secret_sauce`                                                       |
| Customer data     | First name `Elene`, last name `Molashvili`, postal code `0100`                                            |
| Catalogue         | 6 products; e.g. Sauce Labs Backpack $29.99, Sauce Labs Bike Light $9.99, Sauce Labs Fleece Jacket $49.99 |

Priorities: **P1** = critical path, **P2** = important, **P3** = nice to have.

---

## Authentication

### TC-UI-001 — Successful login with valid credentials

| Field           | Value                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                                          |
| Test data       | `standard_user`                                                                          |
| Steps           | 1. Open the base URL. 2. Enter username and password. 3. Click **Login**.                |
| Expected result | URL changes to `/inventory.html`; header title reads "Products"; product list is visible |
| Priority / Type | P1 / Positive, functional                                                                |
| Automation      | Automated — `tests/authentication/login.spec.ts`                                         |

### TC-UI-002 — Login with invalid password

| Field           | Value                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                                                                 |
| Test data       | Username `standard_user`, password `wrong_password`                                                             |
| Steps           | 1. Open the base URL. 2. Enter username and the wrong password. 3. Click **Login**.                             |
| Expected result | Error "Epic sadface: Username and password do not match any user in this service"; user stays on the login page |
| Priority / Type | P1 / Negative                                                                                                   |
| Automation      | Automated — `tests/authentication/login.spec.ts`                                                                |

### TC-UI-003 — Login with empty username

| Field           | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                      |
| Test data       | Username empty, password `secret_sauce`                              |
| Steps           | 1. Open the base URL. 2. Fill only the password. 3. Click **Login**. |
| Expected result | Error "Epic sadface: Username is required"                           |
| Priority / Type | P2 / Negative                                                        |
| Automation      | Automated — `tests/authentication/login.spec.ts`                     |

### TC-UI-004 — Login with empty password

| Field           | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                      |
| Test data       | Username `standard_user`, password empty                             |
| Steps           | 1. Open the base URL. 2. Fill only the username. 3. Click **Login**. |
| Expected result | Error "Epic sadface: Password is required"                           |
| Priority / Type | P2 / Negative                                                        |
| Automation      | Automated — `tests/authentication/login.spec.ts`                     |

### TC-UI-005 — Login with both fields empty

| Field           | Value                                                               |
| --------------- | ------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                     |
| Test data       | Both fields empty                                                   |
| Steps           | 1. Open the base URL. 2. Click **Login** without typing anything.   |
| Expected result | Username error is shown first: "Epic sadface: Username is required" |
| Priority / Type | P3 / Negative                                                       |
| Automation      | Automated — `tests/authentication/login.spec.ts`                    |

### TC-UI-006 — Locked-out user login

| Field           | Value                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                                           |
| Test data       | `locked_out_user`                                                                         |
| Steps           | 1. Open the base URL. 2. Enter locked-out credentials. 3. Click **Login**.                |
| Expected result | Error "Epic sadface: Sorry, this user has been locked out."; user stays on the login page |
| Priority / Type | P1 / Negative                                                                             |
| Automation      | Automated — `tests/authentication/login.spec.ts`                                          |

### TC-UI-007 — Error message dismissal and retry

| Field           | Value                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | Browser open, no active session                                                                                     |
| Test data       | `standard_user`; first attempt uses password `wrong_password`                                                       |
| Steps           | 1. Log in with the wrong password. 2. Click the X on the error banner. 3. Correct the password. 4. Click **Login**. |
| Expected result | Error banner disappears after dismissal; corrected login reaches the inventory                                      |
| Priority / Type | P3 / Positive                                                                                                       |
| Automation      | Automated — `tests/authentication/login.spec.ts`                                                                    |

### TC-UI-008 — Logout ends the session

| Field           | Value                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Preconditions   | Logged in as `standard_user`                                                                           |
| Test data       | —                                                                                                      |
| Steps           | 1. Open the burger menu. 2. Click **Logout**. 3. Try to open `/inventory.html` directly.               |
| Expected result | Login page is shown after logout; deep link is refused with an access error, proving the session ended |
| Priority / Type | P1 / Positive, security-related                                                                        |
| Automation      | Automated — `tests/authentication/login.spec.ts`                                                       |

## Inventory

### TC-UI-009 — Inventory loads with the full catalogue

| Field           | Value                                                         |
| --------------- | ------------------------------------------------------------- |
| Preconditions   | Logged in as `standard_user`                                  |
| Test data       | Expected catalogue size: 6                                    |
| Steps           | 1. Log in. 2. Observe the product list.                       |
| Expected result | Header reads "Products"; exactly 6 product cards are rendered |
| Priority / Type | P1 / Positive                                                 |
| Automation      | Automated — `tests/inventory/inventory.spec.ts`               |

### TC-UI-010 — Product card completeness

| Field           | Value                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open                                                                                    |
| Test data       | —                                                                                                                 |
| Steps           | 1. For each of the 6 cards, inspect name, description, price and button.                                          |
| Expected result | Every card has a non-empty name and description, a price matching `$d+.dd`, and an enabled **Add to cart** button |
| Priority / Type | P2 / Positive                                                                                                     |
| Automation      | Automated — `tests/inventory/inventory.spec.ts`                                                                   |

### TC-UI-011 — Known product data

| Field           | Value                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open                                                          |
| Test data       | Sauce Labs Backpack, $29.99                                                             |
| Steps           | 1. Locate the Sauce Labs Backpack card. 2. Compare name and price with expected values. |
| Expected result | Name and price match the catalogue exactly                                              |
| Priority / Type | P2 / Positive                                                                           |
| Automation      | Automated — `tests/inventory/inventory.spec.ts`                                         |

### TC-UI-012 — Sort by name A→Z

| Field           | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open                                 |
| Test data       | Sort option "Name (A to Z)"                                    |
| Steps           | 1. Select the sort option. 2. Read all product names in order. |
| Expected result | Names appear in ascending alphabetical order                   |
| Priority / Type | P2 / Positive                                                  |
| Automation      | Automated — `tests/inventory/inventory.spec.ts`                |

### TC-UI-013 — Sort by name Z→A

Same as TC-UI-012 with "Name (Z to A)"; names must appear in descending alphabetical order. P2 / Positive. Automated — `tests/inventory/inventory.spec.ts`.

### TC-UI-014 — Sort by price low→high

Same structure with "Price (low to high)"; parsed prices must be in ascending numeric order. P2 / Positive. Automated — `tests/inventory/inventory.spec.ts`.

### TC-UI-015 — Sort by price high→low

Same structure with "Price (high to low)"; parsed prices must be in descending numeric order. P2 / Positive. Automated — `tests/inventory/inventory.spec.ts`.

### TC-UI-016 — Open product details

| Field           | Value                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open                                                                                                           |
| Test data       | Sauce Labs Fleece Jacket, $49.99                                                                                                         |
| Steps           | 1. Click the product name. 2. Inspect the details page.                                                                                  |
| Expected result | URL matches `/inventory-item.html?id=N`; name and price equal the catalogue values; description is non-empty; **Add to cart** is enabled |
| Priority / Type | P2 / Positive                                                                                                                            |
| Automation      | Automated — `tests/inventory/product-details.spec.ts`                                                                                    |

### TC-UI-017 — Return from product details

| Field           | Value                                                 |
| --------------- | ----------------------------------------------------- |
| Preconditions   | Product details page open (Sauce Labs Onesie)         |
| Test data       | —                                                     |
| Steps           | 1. Click **Back to products**.                        |
| Expected result | Inventory page is shown again with the full catalogue |
| Priority / Type | P2 / Positive                                         |
| Automation      | Automated — `tests/inventory/product-details.spec.ts` |

### TC-UI-018 — Add to cart from product details

| Field           | Value                                                           |
| --------------- | --------------------------------------------------------------- |
| Preconditions   | Product details page open (Sauce Labs Bolt T-Shirt)             |
| Test data       | —                                                               |
| Steps           | 1. Click **Add to cart** on the details page. 2. Open the cart. |
| Expected result | Badge shows 1; the product appears in the cart                  |
| Priority / Type | P2 / Positive                                                   |
| Automation      | Automated — `tests/inventory/product-details.spec.ts`           |

## Cart

### TC-UI-019 — Add one product

| Field           | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open, cart empty                  |
| Test data       | Sauce Labs Backpack                                         |
| Steps           | 1. Click **Add to cart** on the product card.               |
| Expected result | Cart badge shows 1; the card's button changes to **Remove** |
| Priority / Type | P1 / Positive                                               |
| Automation      | Automated — `tests/cart/cart.spec.ts`                       |

### TC-UI-020 — Add several products

| Field           | Value                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| Preconditions   | Logged in, inventory page open, cart empty                                    |
| Test data       | Backpack, Bike Light, Onesie                                                  |
| Steps           | 1. Add each product in turn, checking the badge after each. 2. Open the cart. |
| Expected result | Badge increments 1 → 2 → 3; cart lists exactly the 3 products                 |
| Priority / Type | P1 / Positive                                                                 |
| Automation      | Automated — `tests/cart/cart.spec.ts`                                         |

### TC-UI-021 — Remove a product from the inventory page

| Field           | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Preconditions   | Backpack and Bike Light in the cart                         |
| Test data       | Remove: Sauce Labs Backpack                                 |
| Steps           | 1. Click **Remove** on the Backpack card. 2. Open the cart. |
| Expected result | Badge drops to 1; the Backpack is absent from the cart      |
| Priority / Type | P2 / Positive                                               |
| Automation      | Automated — `tests/cart/cart.spec.ts`                       |

### TC-UI-022 — Remove a product on the cart page

| Field           | Value                                               |
| --------------- | --------------------------------------------------- |
| Preconditions   | Backpack and Bike Light in the cart, cart page open |
| Test data       | Remove: Sauce Labs Backpack                         |
| Steps           | 1. Click **Remove** on the Backpack cart line.      |
| Expected result | One line remains (Bike Light); badge shows 1        |
| Priority / Type | P2 / Positive                                       |
| Automation      | Automated — `tests/cart/cart.spec.ts`               |

### TC-UI-023 — Cart line data integrity

| Field           | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Preconditions   | Backpack ($29.99) and Bike Light ($9.99) in the cart, cart page open   |
| Test data       | —                                                                      |
| Steps           | 1. For each line, compare name, price and quantity with the catalogue. |
| Expected result | Names and prices match the catalogue; each quantity is 1               |
| Priority / Type | P1 / Positive                                                          |
| Automation      | Automated — `tests/cart/cart.spec.ts`                                  |

### TC-UI-024 — Cart empty when nothing added

| Field           | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| Preconditions   | Logged in, nothing added                                             |
| Test data       | —                                                                    |
| Steps           | 1. Verify no badge is displayed. 2. Open the cart.                   |
| Expected result | No badge on the cart icon; the cart page contains zero product lines |
| Priority / Type | P2 / Negative                                                        |
| Automation      | Automated — `tests/cart/cart.spec.ts`                                |

### TC-UI-025 — Continue shopping preserves the cart

| Field           | Value                                     |
| --------------- | ----------------------------------------- |
| Preconditions   | Two products in the cart, cart page open  |
| Test data       | —                                         |
| Steps           | 1. Click **Continue Shopping**.           |
| Expected result | Inventory page opens; badge still shows 2 |
| Priority / Type | P3 / Positive                             |
| Automation      | Automated — `tests/cart/cart.spec.ts`     |

## Checkout

### TC-UI-026 — Successful checkout

| Field           | Value                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Preconditions   | Two products in the cart, checkout step one open                                                        |
| Test data       | Customer data (shared)                                                                                  |
| Steps           | 1. Fill first name, last name, postal code. 2. Click **Continue**. 3. Click **Finish** on the overview. |
| Expected result | Completion page shows "Thank you for your order!" and dispatch text; the cart badge is gone             |
| Priority / Type | P1 / Positive                                                                                           |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`                                                           |

### TC-UI-027 — Missing first name validation

| Field           | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| Preconditions   | Checkout step one open                                         |
| Test data       | First name empty, other fields valid                           |
| Steps           | 1. Fill last name and postal code only. 2. Click **Continue**. |
| Expected result | Error "Error: First Name is required"; user stays on step one  |
| Priority / Type | P2 / Negative                                                  |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`                  |

### TC-UI-028 — Missing last name validation

As TC-UI-027 with the last name empty; expected error "Error: Last Name is required". P2 / Negative. Automated — `tests/checkout/checkout.spec.ts`.

### TC-UI-029 — Missing postal code validation

As TC-UI-027 with the postal code empty; expected error "Error: Postal Code is required". P2 / Negative. Automated — `tests/checkout/checkout.spec.ts`.

### TC-UI-030 — Checkout overview contents

| Field           | Value                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | Two products in the cart, customer information submitted                                                             |
| Test data       | Backpack ($29.99), Bike Light ($9.99)                                                                                |
| Steps           | 1. Inspect the overview list, payment info and shipping info.                                                        |
| Expected result | Exactly the selected products with correct names/prices; payment info mentions SauceCard; shipping info is non-empty |
| Priority / Type | P1 / Positive                                                                                                        |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`                                                                        |

### TC-UI-031 — Overview totals arithmetic

| Field           | Value                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------ |
| Preconditions   | Two products in the cart, overview page open                                                     |
| Test data       | Subtotal $39.98; expected tax 8% = $3.20; total $43.18                                           |
| Steps           | 1. Read Item total, Tax and Total labels. 2. Compare against values computed from the catalogue. |
| Expected result | Item total = sum of item prices; Tax = 8% of subtotal (rounded to cents); Total = subtotal + tax |
| Priority / Type | P1 / Positive                                                                                    |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`                                                    |

### TC-UI-032 — Cancel checkout

| Field           | Value                                                |
| --------------- | ---------------------------------------------------- |
| Preconditions   | Checkout step one open with two products in the cart |
| Test data       | —                                                    |
| Steps           | 1. Click **Cancel**.                                 |
| Expected result | Cart page opens; badge still shows 2                 |
| Priority / Type | P2 / Positive                                        |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`        |

### TC-UI-033 — Back home after completed order

| Field           | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| Preconditions   | Order completed (TC-UI-026 flow)                                             |
| Test data       | —                                                                            |
| Steps           | 1. Click **Back Home** on the completion page.                               |
| Expected result | Inventory page opens; the cart badge is gone (cart was emptied by the order) |
| Priority / Type | P2 / Positive                                                                |
| Automation      | Automated — `tests/checkout/checkout.spec.ts`                                |

## End-to-end

### TC-UI-034 — Critical purchase journey

| Field           | Value                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preconditions   | No active session                                                                                                                                                                                                                                                                  |
| Test data       | `standard_user`; Backpack ($29.99) via details page, Fleece Jacket ($49.99) via inventory grid; customer data (shared)                                                                                                                                                             |
| Steps           | 1. Log in. 2. Open the Backpack details, verify data, add to cart, go back. 3. Add the Fleece Jacket from the grid. 4. Open the cart and verify both lines. 5. Start checkout, submit customer data. 6. Verify overview totals ($79.98 + $6.40 tax = $86.38). 7. Finish the order. |
| Expected result | Every intermediate state is correct and the journey ends with "Thank you for your order!" and an empty cart                                                                                                                                                                        |
| Priority / Type | P1 / Positive, end-to-end                                                                                                                                                                                                                                                          |
| Automation      | Automated — `tests/regression/purchase-flow.spec.ts`                                                                                                                                                                                                                               |
