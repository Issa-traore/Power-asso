"use client";

import { useActionState } from "react";
import { updateSiteSettings } from "@/lib/actions/settings-actions";
import { ImageField } from "@/components/admin/ImageField";
import { useState } from "react";
import type { SiteSettings } from "@prisma/client";

type NavLink = { label: string; href: string };
type SocialLink = { platform: string; url: string };

function linesFromNav(links: NavLink[]) {
  return links.map((l) => `${l.label} | ${l.href}`).join("\n");
}
function linesFromSocial(links: SocialLink[]) {
  return links.map((l) => `${l.platform} | ${l.url}`).join("\n");
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, undefined);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl ?? "");

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Identité</h2>
        <div>
          <label className="block text-sm font-medium">Nom du site</label>
          <input name="siteName" defaultValue={settings.siteName} required className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slogan</label>
          <input name="tagline" defaultValue={settings.tagline ?? ""} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <input type="hidden" name="logoUrl" value={logoUrl} />
        <ImageField label="Logo" value={logoUrl} onChange={setLogoUrl} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Couleur principale</label>
            <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="mt-1 h-10 w-full rounded border border-neutral-300" />
          </div>
          <div>
            <label className="block text-sm font-medium">Couleur secondaire</label>
            <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor} className="mt-1 h-10 w-full rounded border border-neutral-300" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Navigation (en-tête)</h2>
        <div>
          <label className="block text-sm font-medium">Liens de menu (un par ligne, format : Libellé | /lien)</label>
          <textarea
            name="navLinks"
            defaultValue={linesFromNav((settings.navLinks as NavLink[] | null) ?? [])}
            rows={4}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-mono text-xs"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showAdherer" defaultChecked={settings.showAdherer} /> Afficher le bouton &quot;Adhérer&quot;
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input name="adhererLabel" defaultValue={settings.adhererLabel} className="rounded border border-neutral-300 px-2 py-1 text-sm" />
            <input name="adhererHref" defaultValue={settings.adhererHref} className="rounded border border-neutral-300 px-2 py-1 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showMemberArea" defaultChecked={settings.showMemberArea} /> Afficher &quot;Espace membre&quot;
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input name="memberAreaLabel" defaultValue={settings.memberAreaLabel} className="rounded border border-neutral-300 px-2 py-1 text-sm" />
            <input name="memberAreaHref" defaultValue={settings.memberAreaHref} className="rounded border border-neutral-300 px-2 py-1 text-sm" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase text-neutral-500">Pied de page & contact</h2>
        <div>
          <label className="block text-sm font-medium">Texte du pied de page</label>
          <textarea name="footerText" defaultValue={settings.footerText ?? ""} rows={2} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Réseaux sociaux (un par ligne, format : Plateforme | URL)</label>
          <textarea
            name="socialLinks"
            defaultValue={linesFromSocial((settings.socialLinks as SocialLink[] | null) ?? [])}
            rows={3}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-mono text-xs"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <input name="contactEmail" placeholder="E-mail" defaultValue={settings.contactEmail ?? ""} className="rounded border border-neutral-300 px-3 py-2 text-sm" />
          <input name="contactPhone" placeholder="Téléphone" defaultValue={settings.contactPhone ?? ""} className="rounded border border-neutral-300 px-3 py-2 text-sm" />
          <input name="contactAddress" placeholder="Adresse" defaultValue={settings.contactAddress ?? ""} className="rounded border border-neutral-300 px-3 py-2 text-sm" />
        </div>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">Paramètres enregistrés ✓</p>}

      <button type="submit" disabled={pending} className="rounded bg-neutral-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
