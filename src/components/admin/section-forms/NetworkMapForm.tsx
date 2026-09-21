"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField, IconSelect, Repeater } from "./SectionFormShell";

export function NetworkMapForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"NETWORK_MAP"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Réseau / carte" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Titre" value={content.heading} onChange={(v) => setContent({ ...content, heading: v })} />
      <ImageField label="Image de carte" value={content.mapImageUrl} onChange={(v) => setContent({ ...content, mapImageUrl: v })} />

      <div>
        <div className="mb-2 text-sm font-medium">Statistiques</div>
        <Repeater
          items={content.stats}
          onChange={(stats) => setContent({ ...content, stats })}
          newItem={{ icon: "globe", value: "0", label: "Statistique" }}
          addLabel="+ Ajouter une statistique"
          renderItem={(item, update) => (
            <>
              <IconSelect label="Icône" value={item.icon} onChange={(icon) => update({ icon })} />
              <TextField label="Valeur" value={item.value} onChange={(value) => update({ value })} />
              <TextField label="Libellé" value={item.label} onChange={(label) => update({ label })} />
            </>
          )}
        />
      </div>

      <TextField label="Titre du bloc latéral" value={content.sideHeading} onChange={(v) => setContent({ ...content, sideHeading: v })} />
      <TextField label="Texte du bloc latéral" value={content.sideText} onChange={(v) => setContent({ ...content, sideText: v })} textarea />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Bouton — texte" value={content.primaryCta?.label ?? ""} onChange={(v) => setContent({ ...content, primaryCta: { label: v, href: content.primaryCta?.href ?? "#" } })} />
        <TextField label="Bouton — lien" value={content.primaryCta?.href ?? ""} onChange={(v) => setContent({ ...content, primaryCta: { label: content.primaryCta?.label ?? "", href: v } })} />
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Liens rapides</div>
        <Repeater
          items={content.links}
          onChange={(links) => setContent({ ...content, links })}
          newItem={{ icon: "globe", label: "Lien", href: "#" }}
          addLabel="+ Ajouter un lien"
          renderItem={(item, update) => (
            <>
              <IconSelect label="Icône" value={item.icon} onChange={(icon) => update({ icon })} />
              <TextField label="Libellé" value={item.label} onChange={(label) => update({ label })} />
              <TextField label="Lien" value={item.href} onChange={(href) => update({ href })} />
            </>
          )}
        />
      </div>
    </SectionFormShell>
  );
}
