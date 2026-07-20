import { test, expect } from '../../fixtures/test';
import { expectedTax } from '../../data/products';
import { defaultCustomer, checkoutErrors } from '../../data/checkout';
import { formatPrice } from '../../utils/price';

test.describe('Checkout', () => {
  test.beforeEach(async ({ cartWithItems }) => {
    await cartWithItems.startCheckout();
  });

  test(
    'completing checkout with valid data confirms the order',
    { tag: ['@smoke', '@regression'] },
    async ({ checkoutPage }) => {
      await checkoutPage.submitCustomerInformation(defaultCustomer);
      await expect(checkoutPage.page).toHaveURL(/checkout-step-two\.html/);

      await checkoutPage.finishOrder();

      await expect(checkoutPage.page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.completeText).toContainText('Your order has been dispatched');
      // Completing the order must empty the cart.
      await expect(checkoutPage.header.cartBadge).toBeHidden();
    },
  );

  test(
    'missing first name blocks checkout with a clear message',
    { tag: ['@negative', '@regression'] },
    async ({ checkoutPage }) => {
      await checkoutPage.submitCustomerInformation({ ...defaultCustomer, firstName: '' });

      await expect(checkoutPage.errorMessage).toHaveText(checkoutErrors.firstNameRequired);
      await expect(checkoutPage.page).toHaveURL(/checkout-step-one\.html/);
    },
  );

  test(
    'missing last name blocks checkout with a clear message',
    { tag: ['@negative', '@regression'] },
    async ({ checkoutPage }) => {
      await checkoutPage.submitCustomerInformation({ ...defaultCustomer, lastName: '' });

      await expect(checkoutPage.errorMessage).toHaveText(checkoutErrors.lastNameRequired);
      await expect(checkoutPage.page).toHaveURL(/checkout-step-one\.html/);
    },
  );

  test(
    'missing postal code blocks checkout with a clear message',
    { tag: ['@negative', '@regression'] },
    async ({ checkoutPage }) => {
      await checkoutPage.submitCustomerInformation({ ...defaultCustomer, postalCode: '' });

      await expect(checkoutPage.errorMessage).toHaveText(checkoutErrors.postalCodeRequired);
      await expect(checkoutPage.page).toHaveURL(/checkout-step-one\.html/);
    },
  );

  test(
    'checkout overview lists the selected products with payment and shipping details',
    { tag: ['@regression'] },
    async ({ checkoutPage, cartItems }) => {
      await checkoutPage.submitCustomerInformation(defaultCustomer);

      await expect(checkoutPage.header.title).toHaveText('Checkout: Overview');
      await expect(checkoutPage.overviewItems).toHaveCount(cartItems.length);
      for (const product of cartItems) {
        const line = checkoutPage.overviewItem(product.name);
        await expect(line.name).toHaveText(product.name);
        await expect(line.price).toHaveText(formatPrice(product.price));
      }
      await expect(checkoutPage.paymentInfo).toContainText('SauceCard');
      await expect(checkoutPage.shippingInfo).not.toBeEmpty();
    },
  );

  test(
    'overview totals equal the sum of item prices plus 8% tax',
    { tag: ['@regression'] },
    async ({ checkoutPage, cartItems }) => {
      await checkoutPage.submitCustomerInformation(defaultCustomer);

      const subtotal = cartItems.reduce((sum, product) => sum + product.price, 0);
      const tax = expectedTax(subtotal);

      await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: ${formatPrice(subtotal)}`);
      await expect(checkoutPage.taxLabel).toHaveText(`Tax: ${formatPrice(tax)}`);
      await expect(checkoutPage.totalLabel).toHaveText(`Total: ${formatPrice(subtotal + tax)}`);
    },
  );

  test(
    'cancelling checkout keeps the cart intact',
    { tag: ['@regression'] },
    async ({ checkoutPage, cartItems }) => {
      await checkoutPage.cancelButton.click();

      await expect(checkoutPage.page).toHaveURL(/cart\.html/);
      await expect(checkoutPage.header.cartBadge).toHaveText(String(cartItems.length));
    },
  );

  test(
    'back home after a completed order returns to a clean inventory',
    { tag: ['@regression'] },
    async ({ checkoutPage, inventoryPage }) => {
      await checkoutPage.submitCustomerInformation(defaultCustomer);
      await checkoutPage.finishOrder();
      await expect(checkoutPage.completeHeader).toBeVisible();

      await checkoutPage.backHomeButton.click();

      await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.header.cartBadge).toBeHidden();
    },
  );
});
