import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventory-item.component';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly header: HeaderComponent;
  readonly inventoryList: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.inventoryList = page.getByTestId('inventory-list');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  item(productName: string): InventoryItemComponent {
    const root = this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    return new InventoryItemComponent(root);
  }

  async addToCart(productName: string): Promise<void> {
    await this.item(productName).addToCartButton.click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.item(productName).removeButton.click();
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.item(productName).name.click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async visibleNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async visiblePrices(): Promise<string[]> {
    return this.itemPrices.allInnerTexts();
  }
}
