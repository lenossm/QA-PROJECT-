import type { Locator, Page } from '@playwright/test';

/**
 * App bar shared by every authenticated screen (inventory, product details,
 * cart, checkout). Modelled once as a component instead of duplicating the
 * cart badge / burger menu locators in each page object.
 */
export class HeaderComponent {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly openMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.openMenuButton.click();
    await this.logoutLink.click();
  }
}
