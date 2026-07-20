import { test, expect } from '../../fixtures/test';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/price';

test.describe('Product details', () => {
  test(
    'opening a product shows its full details',
    { tag: ['@regression'] },
    async ({ authenticatedPage, productDetailsPage }) => {
      await authenticatedPage.openProductDetails(products.fleeceJacket.name);

      await expect(productDetailsPage.page).toHaveURL(/inventory-item\.html\?id=\d+/);
      await expect(productDetailsPage.name).toHaveText(products.fleeceJacket.name);
      await expect(productDetailsPage.price).toHaveText(formatPrice(products.fleeceJacket.price));
      await expect(productDetailsPage.description).not.toBeEmpty();
      await expect(productDetailsPage.addToCartButton).toBeEnabled();
    },
  );

  test(
    'back-to-products returns to the full inventory',
    { tag: ['@regression'] },
    async ({ authenticatedPage, productDetailsPage }) => {
      await authenticatedPage.openProductDetails(products.onesie.name);
      await expect(productDetailsPage.name).toHaveText(products.onesie.name);

      await productDetailsPage.backToProducts();

      await expect(authenticatedPage.page).toHaveURL(/inventory\.html/);
      await expect(authenticatedPage.header.title).toHaveText('Products');
      await expect(authenticatedPage.items).not.toHaveCount(0);
    },
  );

  test(
    'product added from the details page appears in the cart',
    { tag: ['@regression'] },
    async ({ authenticatedPage, productDetailsPage, cartPage }) => {
      await authenticatedPage.openProductDetails(products.boltShirt.name);
      await productDetailsPage.addToCartButton.click();

      await expect(productDetailsPage.header.cartBadge).toHaveText('1');

      await productDetailsPage.header.openCart();
      await expect(cartPage.item(products.boltShirt.name).name).toBeVisible();
    },
  );
});
