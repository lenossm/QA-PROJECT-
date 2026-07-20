# Test Scenarios — SauceDemo UI

High-level scenarios derived from the application's functionality. Detailed steps live in [test-cases.md](test-cases.md); every scenario below is automated (see the mapping in that file).

## 1. Authentication

| #    | Scenario                                                                       | Type     |
| ---- | ------------------------------------------------------------------------------ | -------- |
| S-01 | User logs in with valid standard credentials and reaches the product catalogue | Positive |
| S-02 | Login is rejected when the password is wrong                                   | Negative |
| S-03 | Login is rejected when the username is empty, with a field-specific message    | Negative |
| S-04 | Login is rejected when the password is empty, with a field-specific message    | Negative |
| S-05 | Login is rejected when both fields are empty; username error takes precedence  | Negative |
| S-06 | A locked-out account is refused with a dedicated message                       | Negative |
| S-07 | The login error can be dismissed and a corrected login succeeds                | Positive |
| S-08 | Logout ends the session; protected pages are unreachable afterwards            | Positive |

## 2. Inventory

| #    | Scenario                                                                                            | Type     |
| ---- | --------------------------------------------------------------------------------------------------- | -------- |
| S-09 | Catalogue loads after login and shows all six products                                              | Positive |
| S-10 | Every product card shows a name, description, valid price format, and an enabled Add-to-cart button | Positive |
| S-11 | A known product shows the exact expected name and price                                             | Positive |
| S-12 | Sorting by name A→Z / Z→A reorders the catalogue correctly                                          | Positive |
| S-13 | Sorting by price low→high / high→low reorders the catalogue correctly                               | Positive |
| S-14 | Product details page shows the same data as the catalogue card                                      | Positive |
| S-15 | Back-to-products returns to the complete catalogue                                                  | Positive |

## 3. Cart

| #    | Scenario                                                                      | Type     |
| ---- | ----------------------------------------------------------------------------- | -------- |
| S-16 | Adding one product sets the badge to 1 and swaps the button to Remove         | Positive |
| S-17 | Adding several products increments the badge per product                      | Positive |
| S-18 | A product can be removed from the inventory page and disappears from the cart | Positive |
| S-19 | A product can be removed on the cart page itself                              | Positive |
| S-20 | Cart lines show correct name, price and quantity for each added product       | Positive |
| S-21 | The cart is empty and shows no badge when nothing was added                   | Negative |
| S-22 | Continue-shopping returns to the inventory without losing the cart            | Positive |
| S-23 | A product added from the details page appears in the cart                     | Positive |

## 4. Checkout

| #    | Scenario                                                                                     | Type     |
| ---- | -------------------------------------------------------------------------------------------- | -------- |
| S-24 | Checkout with complete customer data finishes with an order confirmation and an emptied cart | Positive |
| S-25 | Missing first name / last name / postal code each block step one with a specific message     | Negative |
| S-26 | The overview lists exactly the selected products with payment and shipping information       | Positive |
| S-27 | Item total, 8% tax and grand total are arithmetically consistent with the cart contents      | Positive |
| S-28 | Cancelling checkout returns to the cart with contents intact                                 | Positive |
| S-29 | Back-home after completion returns to a clean inventory state                                | Positive |

## 5. End-to-end

| #    | Scenario                                                                                                                             | Type                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| S-30 | A customer buys two products in one journey: login → details page → cart → checkout → confirmation, with data verified at every step | Positive, critical path |
