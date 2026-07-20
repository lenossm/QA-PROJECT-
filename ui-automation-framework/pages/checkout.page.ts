import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';
import { InventoryItemComponent } from '../components/inventory-item.component';
import type { CheckoutCustomer } from '../data/checkout';

/**
 * SauceDemo's checkout is a three-step wizard on consecutive URLs. The steps
 * share navigation and never appear independently, so one page object with
 * clearly grouped locators is easier to maintain than three near-empty classes.
 */
export class CheckoutPage {
  readonly header: HeaderComponent;

  // Step one: customer information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step two: overview
  readonly overviewItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly finishButton: Locator;

  // Completion
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(readonly page: Page) {
    this.header = new HeaderComponent(page);

    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');

    this.overviewItems = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.paymentInfo = page.getByTestId('payment-info-value');
    this.shippingInfo = page.getByTestId('shipping-info-value');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  overviewItem(productName: string): InventoryItemComponent {
    const root = this.overviewItems.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    return new InventoryItemComponent(root);
  }

  /** Fills only provided fields so negative tests can leave inputs empty. */
  async fillCustomerInformation({ firstName, lastName, postalCode }: Partial<CheckoutCustomer>) {
    if (firstName) {
      await this.firstNameInput.fill(firstName);
    }
    if (lastName) {
      await this.lastNameInput.fill(lastName);
    }
    if (postalCode) {
      await this.postalCodeInput.fill(postalCode);
    }
  }

  async submitCustomerInformation(customer: Partial<CheckoutCustomer>): Promise<void> {
    await this.fillCustomerInformation(customer);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }
}
