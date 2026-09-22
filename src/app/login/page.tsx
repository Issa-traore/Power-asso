"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { login } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Image src="/brand/power-asso-icon.png" alt="Power-asso" width={40} height={40} className="h-10 w-10" />
        <h1 className="mt-4 text-xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-neutral-500">Accédez à votre espace d&apos;administration.</p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">E-mail ou identifiant</label>
            <input name="email" type="text" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input name="password" type="password" required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-neutral-900 underline">
            Créer mon association
          </Link>
        </p>
      </div>
    </div>
  );
}
