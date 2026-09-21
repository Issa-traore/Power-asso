import "server-only";

import type { PaymentProvider } from "./types";
import { saspayProvider } from "./saspay";
import { mockProvider } from "./mock";

export function getPaymentProvider(): PaymentProvider {
  return process.env.PAYMENT_PROVIDER === "saspay" ? saspayProvider : mockProvider;
}

export * from "./types";
export { verifySaspayWebhookSignature } from "./saspay";
export * from "./reconcile";
