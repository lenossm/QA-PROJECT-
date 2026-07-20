import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventory-item.component';

export class CartPage {
  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  item(productName: string): InventoryItemComponent {
    const root = this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    return new InventoryItemComponent(root);
  }

  quantityOf(productName: string): Locator {
    return this.item(productName).root.getByTestId('item-quantity');
  }

  async removeItem(productName: string): Promise<void> {
    await this.item(productName).removeButton.click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
