# Regression Checklist — SauceDemo UI

Used before declaring a build/release of the test target (or after framework changes) as a quick, ordered pass through the business-critical functionality. Each item links to the automated coverage; the checklist can also be executed manually in ~20 minutes.

**Legend:** ✅ automated (spec noted) · 👁 manual/exploratory only

## 1. Smoke (must pass before anything else)

- [ ] Application is reachable and the login page renders ✅ implicit in every test
- [ ] Standard user can log in ✅ `authentication/login.spec.ts` (TC-UI-001)
- [ ] Locked-out user is refused ✅ `authentication/login.spec.ts` (TC-UI-006)
- [ ] Inventory shows 6 products ✅ `inventory/inventory.spec.ts` (TC-UI-009)
- [ ] A product can be added to the cart ✅ `cart/cart.spec.ts` (TC-UI-019)
- [ ] Cart shows correct product data ✅ `cart/cart.spec.ts` (TC-UI-023)
- [ ] Full checkout completes with confirmation ✅ `checkout/checkout.spec.ts` (TC-UI-026)
- [ ] Logout ends the session ✅ `authentication/login.spec.ts` (TC-UI-008)
- [ ] End-to-end purchase journey ✅ `regression/purchase-flow.spec.ts` (TC-UI-034)

Command: `npm run test:smoke`

## 2. Authentication

- [ ] Invalid password rejected with the correct message ✅ (TC-UI-002)
- [ ] Empty username / empty password / both empty each produce the right message ✅ (TC-UI-003..005)
- [ ] Error banner can be dismissed; retry works ✅ (TC-UI-007)
- [ ] Deep link to `/inventory.html` without a session is refused ✅ (part of TC-UI-008)
- [ ] Password field masks input 👁

## 3. Inventory and product details

- [ ] All product cards complete (name, description, price, button) ✅ (TC-UI-010)
- [ ] All four sort options order correctly ✅ (TC-UI-012..015)
- [ ] Details page consistent with the card; back navigation intact ✅ (TC-UI-016..017)
- [ ] Add to cart from the details page ✅ (TC-UI-018)
- [ ] Product images render (no broken images) 👁

## 4. Cart

- [ ] Badge counts correctly across add/remove operations ✅ (TC-UI-019..022)
- [ ] Cart empty state (no badge, no lines) ✅ (TC-UI-024)
- [ ] Continue shopping preserves the cart ✅ (TC-UI-025)
- [ ] Cart contents survive a page reload 👁

## 5. Checkout

- [ ] Each mandatory field validated individually ✅ (TC-UI-027..029)
- [ ] Overview lists exactly the selected items with payment/shipping info ✅ (TC-UI-030)
- [ ] Subtotal, 8% tax and total arithmetically consistent ✅ (TC-UI-031)
- [ ] Cancel returns to the cart with contents intact ✅ (TC-UI-032)
- [ ] Order completion empties the cart; Back Home returns to a clean inventory ✅ (TC-UI-026, TC-UI-033)

Command for the full pass: `npm run test:regression`
