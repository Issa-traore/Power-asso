"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "@/lib/actions/auth-actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">Créez le site de votre association</h1>
        <p className="mt-1 text-sm text-neutral-500">14 jours d&apos;essai, sans engagement.</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom de l&apos;association</label>
            <input name="orgName" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Votre nom</label>
            <input name="name" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input name="email" type="email" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input name="password" type="password" required minLength={6} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Création..." : "Créer mon site"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-medium text-neutral-900 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
