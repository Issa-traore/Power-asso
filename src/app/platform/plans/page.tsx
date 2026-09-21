import { prisma } from "@/lib/prisma";
import { PlanForm } from "@/components/platform/PlanForm";

export default async function PlatformPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { priceCents: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Forfaits d&apos;abonnement</h1>
      <p className="mt-1 text-sm text-neutral-500">Ces forfaits sont proposés à toutes les associations abonnées.</p>

      <div className="mt-6 space-y-4">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border border-neutral-200 bg-white p-5">
            <PlanForm plan={plan} />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Nouveau forfait</h2>
        <PlanForm />
      </div>
    </div>
  );
}
