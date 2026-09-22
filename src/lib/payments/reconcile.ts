import "server-only";

import { addMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { NormalizedPaymentStatus } from "./types";
import { saspayProvider } from "./saspay";

/** Idempotently applies a provider result to our Payment + Subscription + Organization records. */
export async function applyPaymentResult(paymentId: string, status: NormalizedPaymentStatus, raw: unknown) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { subscription: true },
  });
  if (!payment || payment.status === "SUCCESS") return payment; // already settled, no-op

  const dbStatus = status === "SUCCESS" ? "SUCCESS" : status === "FAILED" ? "FAILED" : "PENDING";

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: dbStatus, rawPayload: raw as never },
  });

  if (status === "SUCCESS" && payment.subscription) {
    const now = new Date();
    await prisma.subscription.update({
      where: { id: payment.subscription.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: addMonths(now, payment.periodMonths),
        cancelAtPeriodEnd: false,
      },
    });
    await prisma.organization.update({
      where: { id: payment.organizationId },
      data: { status: "ACTIVE" },
    });
  }

  return updated;
}

/**
 * SasPay's webhook example payload doesn't document a field that maps a transaction
 * back to the checkout session id we stored as providerRef, so alongside best-effort
 * correlation in the webhook route we also sweep recent pending SasPay payments here
 * and re-verify each one directly against the gateway (the safe fallback the docs
 * themselves recommend: "never trust a cached status").
 */
export async function reconcilePendingSaspayPayments() {
  const pending = await prisma.payment.findMany({
    where: {
      provider: "SASPAY",
      status: "PENDING",
      providerRef: { not: null },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  for (const payment of pending) {
    try {
      const result = await saspayProvider.verify(payment.providerRef!);
      if (result.status !== "PENDING") {
        await applyPaymentResult(payment.id, result.status, result.raw);
      }
    } catch {
      // Best-effort sweep — a single failing lookup shouldn't block the others.
    }
  }
}
