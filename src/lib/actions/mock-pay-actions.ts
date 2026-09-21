"use server";

import { redirect } from "next/navigation";
import { applyPaymentResult } from "@/lib/payments";

export async function simulateMockPayment(paymentId: string, returnUrl: string, succeed: boolean) {
  await applyPaymentResult(paymentId, succeed ? "SUCCESS" : "FAILED", { mock: true, succeed });
  redirect(returnUrl || "/admin/billing");
}
