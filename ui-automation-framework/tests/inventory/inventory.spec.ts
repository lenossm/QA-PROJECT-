import { test, expect } from '../../fixtures/test';
import { products, catalogueSize } from '../../data/products';
import { formatPrice, parsePrice } from '../../utils/price';

test.describe('Inventory', () => {
  test(
    'inventory page loads after login with the full catalogue',
    { tag: ['@smoke', '@regression'] },
    async ({ authenticatedPage }) => {
      await expect(authenticatedPage.header.title).toHaveText('Products');
      await expect(authenticatedPage.items).toHaveCount(catalogueSize);
    },
  );

  test(
    'every product card shows name, description, price and an add-to-cart button',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await expect(authenticatedPage.items).toHaveCount(catalogueSize);

      for (let i = 0; i < catalogueSize; i++) {
        const card = authenticatedPage.items.nth(i);
        await expect(card.getByTestId('inventory-item-name')).not.toBeEmpty();
        await expect(card.getByTestId('inventory-item-desc')).not.toBeEmpty();
        await expect(card.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
        await expect(card.getByRole('button', { name: 'Add to cart' })).toBeEnabled();
      }
    },
  );

  test(
    'known product shows the expected name and price',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      const backpack = authenticatedPage.item(products.backpack.name);
      await expect(backpack.name).toHaveText(products.backpack.name);
      await expect(backpack.price).toHaveText(formatPrice(products.backpack.price));
    },
  );

  test(
    'sorting by name A→Z orders products alphabetically',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.sortBy('az');

      const names = await authenticatedPage.visibleNames();
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    },
  );

  test(
    'sorting by name Z→A orders products reverse-alphabetically',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.sortBy('za');

      const names = await authenticatedPage.visibleNames();
      expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    },
  );

  test(
    'sorting by price low→high orders products by ascending price',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.sortBy('lohi');

      const prices = (await authenticatedPage.visiblePrices()).map(parsePrice);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    },
  );

  test(
    'sorting by price high→low orders products by descending price',
    { tag: ['@regression'] },
    async ({ authenticatedPage }) => {
      await authenticatedPage.sortBy('hilo');

      const prices = (await authenticatedPage.visiblePrices()).map(parsePrice);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    },
  );
});
