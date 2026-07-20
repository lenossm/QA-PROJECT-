/**
 * The SauceDemo product catalogue is static, which makes exact-value
 * assertions reliable. Prices are asserted from this single source of truth
 * so a catalogue change breaks tests in one obvious place.
 */
export interface Product {
  name: string;
  price: number;
}

export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltShirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
  redShirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} satisfies Record<string, Product>;

export const catalogueSize = Object.keys(products).length;

/** SauceDemo applies a flat 8% tax at checkout. */
export const TAX_RATE = 0.08;

export function expectedTax(subtotal: number): number {
  return Math.round(subtotal * TAX_RATE * 100) / 100;
}
