"use client";

import { useActionState } from "react";
import { setCustomDomain, verifyCustomDomain, removeCustomDomain } from "@/lib/actions/domain-actions";

export function DomainManager({
  customDomain,
  status,
  baseDomain,
}: {
  customDomain: string | null;
  status: "PENDING" | "VERIFIED";
  baseDomain: string;
}) {
  const [setState, setAction, setPending] = useActionState(setCustomDomain, undefined);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyCustomDomain, undefined);

  return (
    <div className="space-y-6">
      {customDomain ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">Domaine actuel</div>
              <div className="text-lg font-semibold">{customDomain}</div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {status === "VERIFIED" ? "Actif" : "En attente de vérification"}
            </span>
          </div>

          {status === "PENDING" && (
            <div className="mt-4 rounded-md bg-neutral-50 p-4 text-sm text-neutral-700">
              <p className="font-medium">Configurez votre DNS chez le registrar où vous avez acheté ce nom de domaine :</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Pour un sous-domaine (ex. <code>www.votreassociation.org</code>) : créez un enregistrement{" "}
                  <strong>CNAME</strong> pointant vers <code>{baseDomain}</code>.
                </li>
                <li>
                  Pour un domaine racine (ex. <code>votreassociation.org</code>) : créez un enregistrement <strong>A</strong>{" "}
                  pointant vers l&apos;adresse IP de votre serveur.
                </li>
              </ul>
              <p className="mt-2 text-neutral-500">La propagation DNS peut prendre jusqu&apos;à 24h.</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <form action={verifyAction}>
              <button
                type="submit"
                disabled={verifyPending}
                className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {verifyPending ? "Vérification..." : "Vérifier la configuration DNS"}
              </button>
            </form>
            <form action={removeCustomDomain}>
              <button type="submit" className="text-sm text-neutral-500 underline hover:text-red-600">
                Retirer ce domaine
              </button>
            </form>
          </div>
          {verifyState?.error && <p className="mt-2 text-sm text-red-600">{verifyState.error}</p>}
          {verifyState?.success && <p className="mt-2 text-sm text-emerald-600">{verifyState.success}</p>}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          Aucun domaine personnalisé n&apos;est configuré. Votre site reste accessible sur votre sous-domaine gratuit.
        </p>
      )}

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">{customDomain ? "Changer de domaine" : "Ajouter un domaine personnalisé"}</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Vous devez d&apos;abord acheter ce nom de domaine chez un registrar (OVH, Namecheap, Google Domains...).
        </p>
        <form action={setAction} className="mt-3 flex gap-2">
          <input
            type="text"
            name="domain"
            placeholder="www.votreassociation.org"
            required
            className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={setPending}
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {setPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
        {setState?.error && <p className="mt-2 text-sm text-red-600">{setState.error}</p>}
        {setState?.success && <p className="mt-2 text-sm text-emerald-600">{setState.success}</p>}
      </div>
    </div>
  );
}
