"use client";

import { useActionState } from "react";
import { upsertPlan } from "@/lib/actions/platform-actions";
import type { Plan } from "@prisma/client";

export function PlanForm({ plan, onDone }: { plan?: Plan; onDone?: () => void }) {
  const [state, formAction, pending] = useActionState(upsertPlan, undefined);
  const features = (plan?.features as { maxSections?: number; storageMb?: number; customDomain?: boolean }) ?? {};

  return (
    <form
      action={async (formData) => {
        await formAction(formData);
        onDone?.();
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <input type="hidden" name="id" defaultValue={plan?.id ?? ""} />
      <div>
        <label className="block text-xs font-medium text-neutral-500">Nom</label>
        <input name="name" defaultValue={plan?.name} required className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Identifiant (slug)</label>
        <input name="slug" defaultValue={plan?.slug} required className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Prix</label>
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={plan ? plan.priceCents / 100 : undefined}
          required
          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Devise</label>
        <input name="currency" defaultValue={plan?.currency ?? "XOF"} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Périodicité</label>
        <select name="interval" defaultValue={plan?.interval ?? "MONTHLY"} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm">
          <option value="MONTHLY">Mensuel</option>
          <option value="YEARLY">Annuel</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Nombre de sections max</label>
        <input type="number" name="maxSections" defaultValue={features.maxSections ?? 10} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500">Stockage (Mo)</label>
        <input type="number" name="storageMb" defaultValue={features.storageMb ?? 500} className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm" />
      </div>
      <div className="flex items-center gap-4 pt-5">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="customDomain" defaultChecked={features.customDomain ?? false} /> Domaine personnalisé
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={plan?.isActive ?? true} /> Actif
        </label>
      </div>
      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Enregistrement..." : plan ? "Mettre à jour" : "Créer le forfait"}
        </button>
      </div>
    </form>
  );
}
