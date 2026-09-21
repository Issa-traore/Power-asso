"use client";

import { useActionState } from "react";
import { joinAsMember } from "@/lib/actions/member-actions";

export function JoinForm({ slug, primaryColor }: { slug: string; primaryColor: string }) {
  const [state, formAction, pending] = useActionState(joinAsMember, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <label className="block text-sm font-medium">Nom complet</label>
        <input name="fullName" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input type="email" name="email" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Mot de passe</label>
        <input type="password" name="password" required minLength={6} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        style={{ background: primaryColor }}
      >
        {pending ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
