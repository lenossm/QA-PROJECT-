import type { Locator } from '@playwright/test';

/**
 * A single product card. The same markup is rendered on the inventory page
 * and inside the cart, so both page objects reuse this component to read
 * product data and click the Add/Remove buttons.
 */
export class InventoryItemComponent {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(readonly root: Locator) {
    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
  }

  async priceValue(): Promise<string> {
    return this.price.innerText();
  }
}
