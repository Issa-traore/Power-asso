"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField } from "./SectionFormShell";

export function CtaFooterForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"CTA_FOOTER"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Bandeau d'appel à l'action" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Titre" value={content.heading} onChange={(v) => setContent({ ...content, heading: v })} />
      <TextField label="Texte" value={content.text} onChange={(v) => setContent({ ...content, text: v })} textarea />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Bouton principal — texte" value={content.primaryCta.label} onChange={(v) => setContent({ ...content, primaryCta: { ...content.primaryCta, label: v } })} />
        <TextField label="Bouton principal — lien" value={content.primaryCta.href} onChange={(v) => setContent({ ...content, primaryCta: { ...content.primaryCta, href: v } })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Bouton secondaire — texte" value={content.secondaryCta?.label ?? ""} onChange={(v) => setContent({ ...content, secondaryCta: { label: v, href: content.secondaryCta?.href ?? "#" } })} />
        <TextField label="Bouton secondaire — lien" value={content.secondaryCta?.href ?? ""} onChange={(v) => setContent({ ...content, secondaryCta: { label: content.secondaryCta?.label ?? "", href: v } })} />
      </div>
      <ImageField label="Image de fond" value={content.backgroundImageUrl} onChange={(v) => setContent({ ...content, backgroundImageUrl: v })} />
    </SectionFormShell>
  );
}
