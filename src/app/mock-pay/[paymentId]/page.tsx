import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { simulateMockPayment } from "@/lib/actions/mock-pay-actions";

export default async function MockPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ paymentId: string }>;
  searchParams: Promise<{ return?: string }>;
}) {
  const { paymentId } = await params;
  const { return: returnUrl } = await searchParams;
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Simulateur de paiement (mode test)</div>
        <div className="mt-3 text-2xl font-bold">{(payment.amountCents / 100).toLocaleString("fr-FR")} {payment.currency}</div>
        <p className="mt-2 text-sm text-neutral-500">
          Cette page remplace la page de paiement SasPay tant que PAYMENT_PROVIDER=mock.
        </p>

        <div className="mt-6 space-y-2">
          <form action={simulateMockPayment.bind(null, paymentId, returnUrl ?? "/admin/billing", true)}>
            <button type="submit" className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Simuler un paiement réussi
            </button>
          </form>
          <form action={simulateMockPayment.bind(null, paymentId, returnUrl ?? "/admin/billing", false)}>
            <button type="submit" className="w-full rounded border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700">
              Simuler un échec
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
