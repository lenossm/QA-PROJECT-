export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const defaultCustomer: CheckoutCustomer = {
  firstName: 'Elene',
  lastName: 'Molashvili',
  postalCode: '0100',
};

/** Error messages rendered by the checkout information form. */
export const checkoutErrors = {
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;
