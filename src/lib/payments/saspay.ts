import "server-only";

import crypto from "crypto";
import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProvider, VerifyResult } from "./types";

// Reference: https://docs.saspay.me/ — mobile money & card aggregator for West/Central Africa.
// We use the hosted "checkout session" flow (not softpay direct-push) so the customer is
// redirected to SasPay's own payment page and we never touch card/mobile money numbers.

function baseUrl() {
  return process.env.SASPAY_BASE_URL?.replace(/\/+$/, "") || "https://api.saspay.me/api/v1";
}

function apiKey() {
  const key = process.env.SASPAY_API_KEY;
  if (!key) throw new Error("SASPAY_API_KEY is not set");
  return key;
}

async function saspayFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const raw = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`SasPay ${init?.method ?? "GET"} ${path} failed (${res.status}): ${JSON.stringify(raw)}`);
  }
  return raw;
}

function normalizeStatus(status: unknown, paidAt: unknown): "PENDING" | "SUCCESS" | "FAILED" {
  if (paidAt) return "SUCCESS";
  const s = String(status ?? "").toUpperCase();
  if (s.includes("PAID") || s.includes("SUCCESS") || s.includes("COMPLETE")) return "SUCCESS";
  if (s.includes("FAIL") || s.includes("CANCEL") || s.includes("EXPIRE")) return "FAILED";
  return "PENDING";
}

export const saspayProvider: PaymentProvider = {
  name: "SASPAY",

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const raw = await saspayFetch("/checkout-sessions/", {
      method: "POST",
      body: JSON.stringify({
        amount: (input.amountCents / 100).toFixed(2),
        currency: input.currency,
        description: input.description,
        customer_email: input.customerEmail,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        return_url: input.returnUrl,
        metadata: input.metadata,
      }),
    });
    const data = raw as { id: string; checkout_url: string };
    return { checkoutUrl: data.checkout_url, providerRef: data.id, raw };
  },

  async verify(providerRef: string): Promise<VerifyResult> {
    const raw = await saspayFetch(`/checkout-sessions/${providerRef}/`);
    const data = raw as { status: unknown; paid_at: unknown };
    return { status: normalizeStatus(data.status, data.paid_at), raw };
  },
};

/**
 * Every SasPay webhook request is signed over `${timestamp}.${rawBody}` with HMAC-SHA256
 * using the per-endpoint signing secret (shown once in the SasPay dashboard). Must run on
 * the untouched raw request body — re-serializing the parsed JSON would break the signature.
 */
export function verifySaspayWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
): boolean {
  const secret = process.env.SASPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader || !timestampHeader) return false;

  const toleranceSeconds = 300;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestampHeader)) > toleranceSeconds) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${timestampHeader}.${rawBody}`).digest("hex");

  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export type SaspayWebhookEvent = {
  event: string;
  data: {
    id?: string;
    reference?: string;
    status?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  };
};
