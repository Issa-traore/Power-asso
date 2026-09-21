export type NormalizedPaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface CreateCheckoutInput {
  amountCents: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  returnUrl: string;
  /** Passed through to the provider so we can correlate async notifications back to our records. */
  metadata: Record<string, string>;
}

export interface CreateCheckoutResult {
  checkoutUrl: string;
  providerRef: string;
  raw: unknown;
}

export interface VerifyResult {
  status: NormalizedPaymentStatus;
  raw: unknown;
}

export interface PaymentProvider {
  name: "SASPAY" | "MOCK";
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verify(providerRef: string): Promise<VerifyResult>;
}
