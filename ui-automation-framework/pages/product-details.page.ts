import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class ProductDetailsPage {
  readonly header: HeaderComponent;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}
