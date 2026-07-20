import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { ProductDetailsPage } from '../pages/product-details.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { users, type Credentials } from '../data/users';
import { products, type Product } from '../data/products';

interface PageObjectFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

interface UserFixtures {
  /** Standard user credentials sourced from the environment. */
  standardUser: Credentials;
  /** Credentials of the account SauceDemo keeps permanently locked. */
  lockedOutUser: Credentials;
  /** Logs in as the standard user and lands on the inventory page. */
  authenticatedPage: InventoryPage;
  /** Products added to the cart by the `cartWithItems` fixture. */
  cartItems: Product[];
  /** Authenticated session with `cartItems` already in the cart. */
  cartWithItems: CartPage;
}

/**
 * Each test gets an isolated browser context, and SauceDemo keeps all state
 * (session, cart) client-side, so contexts are disposable and no server-side
 * cleanup step is needed after tests.
 */
export const test = base.extend<PageObjectFixtures & UserFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  standardUser: async ({}, use) => {
    await use(users.standard);
  },
  lockedOutUser: async ({}, use) => {
    await use(users.lockedOut);
  },

  authenticatedPage: async ({ loginPage, inventoryPage, standardUser }, use) => {
    await loginPage.goto();
    await loginPage.login(standardUser);
    await expect(inventoryPage.inventoryList).toBeVisible();
    await use(inventoryPage);
  },

  // Declared as an option so individual tests can override it via `test.use`.
  cartItems: [[products.backpack, products.bikeLight], { option: true }],

  cartWithItems: async ({ authenticatedPage, cartPage, cartItems }, use) => {
    for (const product of cartItems) {
      await authenticatedPage.addToCart(product.name);
    }
    await authenticatedPage.header.openCart();
    await use(cartPage);
  },
});

export { expect };
