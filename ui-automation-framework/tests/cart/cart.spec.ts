import { test, expect } from '../../fixtures/test';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/price';

test.describe('Cart', () => {
  test(
    'adding one product updates the badge and the button state',
    { tag: ['@smoke', '@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.addToCart(products.backpack.name);

      await expect(authenticatedPage.header.cartBadge).toHaveText('1');
      await expect(authenticatedPage.item(products.backpack.name).removeButton).toBeVisible();
    },
  );

  test(
    'adding several products counts each of them in the badge',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      const selection = [products.backpack, products.bikeLight, products.onesie];
      for (const [index, product] of selection.entries()) {
        await authenticatedPage.addToCart(product.name);
        await expect(authenticatedPage.header.cartBadge).toHaveText(String(index + 1));
      }

      await authenticatedPage.header.openCart();
      await expect(authenticatedPage.page.getByTestId('inventory-item')).toHaveCount(
        selection.length,
      );
    },
  );

  test(
    'removing a product from the inventory page clears it from the cart',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.addToCart(products.backpack.name);
      await authenticatedPage.addToCart(products.bikeLight.name);
      await expect(authenticatedPage.header.cartBadge).toHaveText('2');

      await authenticatedPage.removeFromCart(products.backpack.name);

      await expect(authenticatedPage.header.cartBadge).toHaveText('1');
      await authenticatedPage.header.openCart();
      await expect(
        authenticatedPage.page
          .getByTestId('inventory-item-name')
          .getByText(products.backpack.name, { exact: true }),
      ).toBeHidden();
    },
  );

  test(
    'removing a product from the cart page updates the cart contents',
    { tag: ['@regression'] },
    async ({ cartWithItems, cartItems }) => {
      const [first, second] = cartItems;
      await expect(cartWithItems.items).toHaveCount(2);

      await cartWithItems.removeItem(first!.name);

      await expect(cartWithItems.items).toHaveCount(1);
      await expect(cartWithItems.item(second!.name).name).toBeVisible();
      await expect(cartWithItems.header.cartBadge).toHaveText('1');
    },
  );

  test(
    'cart shows the correct name, price and quantity for each product',
    { tag: ['@smoke', '@regression'] },
    async ({ cartWithItems, cartItems }) => {
      await expect(cartWithItems.header.title).toHaveText('Your Cart');
      await expect(cartWithItems.items).toHaveCount(cartItems.length);

      for (const product of cartItems) {
        const line = cartWithItems.item(product.name);
        await expect(line.name).toHaveText(product.name);
        await expect(line.price).toHaveText(formatPrice(product.price));
        await expect(cartWithItems.quantityOf(product.name)).toHaveText('1');
      }
    },
  );

  test(
    'cart stays empty and shows no badge when nothing was added',
    { tag: ['@regression', '@negative'] },
    async ({ authenticatedPage, cartPage }) => {
      await expect(authenticatedPage.header.cartBadge).toBeHidden();

      await authenticatedPage.header.openCart();

      await expect(cartPage.header.title).toHaveText('Your Cart');
      await expect(cartPage.items).toHaveCount(0);
    },
  );

  test(
    'continue shopping returns from the cart to the inventory',
    { tag: ['@regression'] },
    async ({ cartWithItems, inventoryPage }) => {
      await cartWithItems.continueShoppingButton.click();

      await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.header.cartBadge).toHaveText('2');
    },
  );
});
