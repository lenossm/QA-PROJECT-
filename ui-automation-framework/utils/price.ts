/** Converts a UI price label such as "$29.99" into a number for comparisons. */
export function parsePrice(label: string): number {
  const value = Number(label.replace('$', ''));
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse price from label: "${label}"`);
  }
  return value;
}

/** Formats a number as the "$xx.xx" label SauceDemo renders. */
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
