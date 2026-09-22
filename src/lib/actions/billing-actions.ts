"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";
import { getPaymentProvider } from "@/lib/payments";
import { computeTotalCents, isBillingMonths, type BillingMonths } from "@/lib/billing/durations";

export async function startCheckout(planId: string, months: BillingMonths) {
  const session = await requireOrgSession();
  if (!isBillingMonths(months)) throw new Error("Durée d'abonnement invalide.");

  const [org, plan, user] = await Promise.all([
    prisma.organization.findUniqueOrThrow({ where: { id: session.organizationId }, include: { subscription: true } }),
    prisma.plan.findUniqueOrThrow({ where: { id: planId } }),
    prisma.user.findUniqueOrThrow({ where: { id: session.userId } }),
  ]);

  if (!org.subscription) throw new Error("Aucun abonnement à mettre à jour.");

  const amountCents = computeTotalCents(plan.monthlyPriceCents, months);

  // The plan takes effect only once the payment succeeds (see applyPaymentResult);
  // marking it INCOMPLETE now avoids granting paid features before that happens.
  await prisma.subscription.update({
    where: { id: org.subscription.id },
    data: { planId: plan.id, status: "INCOMPLETE" },
  });

  const payment = await prisma.payment.create({
    data: {
      organizationId: org.id,
      subscriptionId: org.subscription.id,
      provider: process.env.PAYMENT_PROVIDER === "saspay" ? "SASPAY" : "MOCK",
      amountCents,
      currency: plan.currency,
      periodMonths: months,
      status: "PENDING",
    },
  });

  const provider = getPaymentProvider();
  const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

  const result = await provider.createCheckout({
    amountCents,
    currency: plan.currency,
    description: `Abonnement ${plan.name} (${months} mois) — ${org.name}`,
    customerEmail: user.email,
    customerName: user.name,
    returnUrl: `${appBaseUrl}/admin/billing/return?payment=${payment.id}`,
    metadata: { payment_id: payment.id, organization_id: org.id, plan_id: plan.id, months: String(months) },
  });

  await prisma.payment.update({ where: { id: payment.id }, data: { providerRef: result.providerRef } });

  redirect(result.checkoutUrl);
}
