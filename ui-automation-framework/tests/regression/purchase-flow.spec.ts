import { test, expect } from '../../fixtures/test';
import { products, expectedTax } from '../../data/products';
import { defaultCustomer } from '../../data/checkout';
import { formatPrice } from '../../utils/price';

/**
 * Critical business path exercised end-to-end in a single journey:
 * login → browse → product details → cart → checkout → confirmation.
 * Feature-level behaviour (sorting, validation messages, cart edge cases)
 * is covered by the focused suites; this test intentionally verifies the
 * happy path the way a real customer travels it.
 */
test.describe('Critical purchase flow', () => {
  test(
    'customer can buy two products from login to order confirmation',
    { tag: ['@e2e', '@smoke', '@regression'] },
    async ({
      loginPage,
      inventoryPage,
      productDetailsPage,
      cartPage,
      checkoutPage,
      standardUser,
    }) => {
      const order = [products.backpack, products.fleeceJacket];
      const subtotal = order.reduce((sum, product) => sum + product.price, 0);

      await test.step('Log in as the standard user', async () => {
        await loginPage.goto();
        await loginPage.login(standardUser);
        await expect(inventoryPage.header.title).toHaveText('Products');
      });

      await test.step('Verify the first product on its details page and add it', async () => {
        await inventoryPage.openProductDetails(order[0]!.name);
        await expect(productDetailsPage.name).toHaveText(order[0]!.name);
        await expect(productDetailsPage.price).toHaveText(formatPrice(order[0]!.price));
        await productDetailsPage.addToCartButton.click();
        await productDetailsPage.backToProducts();
      });

      await test.step('Add the second product from the inventory grid', async () => {
        await inventoryPage.addToCart(order[1]!.name);
        await expect(inventoryPage.header.cartBadge).toHaveText('2');
      });

      await test.step('Review the cart contents', async () => {
        await inventoryPage.header.openCart();
        await expect(cartPage.items).toHaveCount(order.length);
        for (const product of order) {
          await expect(cartPage.item(product.name).price).toHaveText(formatPrice(product.price));
        }
      });

      await test.step('Provide customer information', async () => {
        await cartPage.startCheckout();
        await checkoutPage.submitCustomerInformation(defaultCustomer);
        await expect(checkoutPage.header.title).toHaveText('Checkout: Overview');
      });

      await test.step('Verify totals on the overview', async () => {
        const tax = expectedTax(subtotal);
        await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: ${formatPrice(subtotal)}`);
        await expect(checkoutPage.totalLabel).toHaveText(`Total: ${formatPrice(subtotal + tax)}`);
      });

      await test.step('Finish the order and verify confirmation', async () => {
        await checkoutPage.finishOrder();
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
        await expect(checkoutPage.header.cartBadge).toBeHidden();
      });
    },
  );
});
