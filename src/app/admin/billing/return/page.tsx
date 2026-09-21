import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";
import { getPaymentProvider, applyPaymentResult } from "@/lib/payments";

export default async function BillingReturnPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const session = await requireOrgSession();
  const { payment: paymentId } = await searchParams;

  let payment = paymentId ? await prisma.payment.findUnique({ where: { id: paymentId } }) : null;

  if (payment && payment.organizationId === session.organizationId && payment.status === "PENDING" && payment.providerRef) {
    try {
      const result = await getPaymentProvider().verify(payment.providerRef);
      if (result.status !== "PENDING") {
        payment = await applyPaymentResult(payment.id, result.status, result.raw);
      }
    } catch {
      // The gateway may be briefly unreachable right after redirect — the user can
      // still check status later from the billing page, or the webhook will catch it.
    }
  }

  const success = payment?.status === "SUCCESS";
  const failed = payment?.status === "FAILED";

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      {success && (
        <>
          <h1 className="text-2xl font-bold text-emerald-600">Paiement confirmé 🎉</h1>
          <p className="mt-2 text-sm text-neutral-600">Votre abonnement est maintenant actif.</p>
        </>
      )}
      {failed && (
        <>
          <h1 className="text-2xl font-bold text-red-600">Paiement échoué</h1>
          <p className="mt-2 text-sm text-neutral-600">Le paiement n&apos;a pas pu être confirmé. Vous pouvez réessayer.</p>
        </>
      )}
      {!success && !failed && (
        <>
          <h1 className="text-2xl font-bold">Paiement en cours de vérification</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Cela peut prendre quelques instants. Rafraîchissez la page de facturation si nécessaire.
          </p>
        </>
      )}
      <Link href="/admin/billing" className="mt-6 inline-block rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
        Retour à l&apos;abonnement
      </Link>
    </div>
  );
}
