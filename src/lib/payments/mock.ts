import "server-only";

import { prisma } from "@/lib/prisma";
import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProvider, VerifyResult } from "./types";

// Dev/test provider: no external HTTP calls. The "checkout" is a page inside
// this app (/mock-pay/[paymentId]) where a human clicks Success/Failure —
// letting the entire subscription flow be exercised before real SasPay
// merchant credentials exist.

export const mockProvider: PaymentProvider = {
  name: "MOCK",

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const paymentId = input.metadata.payment_id;
    if (!paymentId) throw new Error("mock provider requires metadata.payment_id");
    const base = process.env.APP_BASE_URL || "http://localhost:3000";
    const url = new URL(`/mock-pay/${paymentId}`, base);
    url.searchParams.set("return", input.returnUrl);
    return { checkoutUrl: url.toString(), providerRef: paymentId, raw: { mock: true } };
  },

  async verify(providerRef: string): Promise<VerifyResult> {
    const payment = await prisma.payment.findUnique({ where: { id: providerRef } });
    if (!payment) return { status: "FAILED", raw: null };
    return { status: payment.status, raw: payment };
  },
};
