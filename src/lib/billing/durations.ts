export type BillingMonths = 1 | 3 | 12;

export const BILLING_DURATIONS: { months: BillingMonths; label: string; multiplier: number; badge?: string }[] = [
  { months: 1, label: "1 mois", multiplier: 1 },
  { months: 3, label: "3 mois", multiplier: 3 * 0.95, badge: "-5%" },
  { months: 12, label: "12 mois", multiplier: 10, badge: "2 mois offerts" },
];

export function isBillingMonths(value: number): value is BillingMonths {
  return value === 1 || value === 3 || value === 12;
}

/** Total price in cents for `months` of a plan whose base price is `monthlyPriceCents`. */
export function computeTotalCents(monthlyPriceCents: number, months: BillingMonths): number {
  const duration = BILLING_DURATIONS.find((d) => d.months === months);
  if (!duration) throw new Error(`Unsupported billing duration: ${months}`);
  return Math.round(monthlyPriceCents * duration.multiplier);
}
