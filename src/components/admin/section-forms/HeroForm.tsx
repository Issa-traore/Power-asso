"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField } from "./SectionFormShell";

export function HeroForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"HERO"> }) {
  const [content, setContent] = useState(initial);
  const set = <K extends keyof typeof content>(key: K, value: (typeof content)[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionFormShell title="Bannière d'accueil" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Accroche (petit texte au-dessus du titre)" value={content.eyebrow} onChange={(v) => set("eyebrow", v)} />
      <TextField label="Titre — ligne 1" value={content.titleLine1} onChange={(v) => set("titleLine1", v)} />
      <TextField label="Titre — ligne 2" value={content.titleLine2} onChange={(v) => set("titleLine2", v)} />
      <TextField label="Titre — ligne mise en couleur" value={content.titleHighlight} onChange={(v) => set("titleHighlight", v)} />
      <TextField label="Description" value={content.description} onChange={(v) => set("description", v)} textarea />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Bouton principal — texte" value={content.primaryCta.label} onChange={(v) => set("primaryCta", { ...content.primaryCta, label: v })} />
        <TextField label="Bouton principal — lien" value={content.primaryCta.href} onChange={(v) => set("primaryCta", { ...content.primaryCta, href: v })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Bouton secondaire — texte" value={content.secondaryCta?.label ?? ""} onChange={(v) => set("secondaryCta", { label: v, href: content.secondaryCta?.href ?? "#" })} />
        <TextField label="Bouton secondaire — lien" value={content.secondaryCta?.href ?? ""} onChange={(v) => set("secondaryCta", { label: content.secondaryCta?.label ?? "", href: v })} />
      </div>
      <ImageField label="Image de fond" value={content.backgroundImageUrl} onChange={(v) => set("backgroundImageUrl", v)} />
    </SectionFormShell>
  );
}
