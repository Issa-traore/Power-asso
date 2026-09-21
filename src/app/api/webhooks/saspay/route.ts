import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySaspayWebhookSignature, type SaspayWebhookEvent } from "@/lib/payments/saspay";
import { applyPaymentResult, reconcilePendingSaspayPayments } from "@/lib/payments/reconcile";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const timestamp = request.headers.get("x-webhook-timestamp");

  if (!verifySaspayWebhookSignature(rawBody, signature, timestamp)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: SaspayWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const paymentId = event.data?.metadata?.payment_id as string | undefined;
  if (paymentId && event.event.startsWith("transaction.")) {
    const status = event.event === "transaction.success" ? "SUCCESS" : "FAILED";
    await applyPaymentResult(paymentId, status, event).catch(() => null);
  }

  // Fallback: SasPay's documented example payload doesn't show a guaranteed field
  // linking the transaction back to our checkout session, so we also re-verify
  // any other recent pending payments directly against the gateway.
  await reconcilePendingSaspayPayments().catch(() => null);

  return NextResponse.json({ ok: true });
}
