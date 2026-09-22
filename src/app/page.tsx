import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Globe2, Image as ImageIcon, CreditCard, LayoutTemplate } from "lucide-react";

export const dynamic = "force-dynamic";

function formatAmount(cents: number, currency: string) {
  return `${(cents / 100).toLocaleString("fr-FR")} ${currency}`;
}

export default async function Home() {
  const plans = await prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceCents: "asc" } });

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-extrabold tracking-tight">Power-asso</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            Connexion
          </Link>
          <Link href="/register" className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
            Créer mon site
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Le site web de votre association, prêt en quelques minutes.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-600">
          Personnalisez votre page d&apos;accueil, vos images et vos couleurs. Gérez vos adhérents et votre abonnement en ligne — sans écrire une ligne de code.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/register" className="rounded bg-amber-600 px-6 py-3 text-sm font-semibold text-white">
            Démarrer gratuitement
          </Link>
          <Link href="/site/boulangers-afrique" className="rounded border border-neutral-300 px-6 py-3 text-sm font-semibold">
            Voir un exemple
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-4">
          {[
            { icon: LayoutTemplate, title: "Page d'accueil modulable", text: "Activez, réorganisez et personnalisez chaque bloc de votre page." },
            { icon: ImageIcon, title: "Vos propres images", text: "Importez logo, photos et visuels depuis votre médiathèque." },
            { icon: Globe2, title: "Votre propre adresse", text: "Sous-domaine inclus, domaine personnalisé sur les forfaits Pro." },
            { icon: CreditCard, title: "Abonnement en ligne", text: "Paiement mobile money & carte via SasPay." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-neutral-200 p-5">
              <f.icon className="h-6 w-6 text-amber-600" />
              <div className="mt-3 font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-neutral-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {plans.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-center text-2xl font-bold">Des forfaits simples</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-neutral-200 p-6 text-center">
                <div className="font-semibold">{plan.name}</div>
                <div className="mt-2 text-2xl font-bold">
                  {formatAmount(plan.priceCents, plan.currency)}
                  <span className="text-sm font-normal text-neutral-500">/{plan.interval === "YEARLY" ? "an" : "mois"}</span>
                </div>
                <Link href="/register" className="mt-4 inline-block rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                  Choisir
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Power-asso
      </footer>
    </div>
  );
}
