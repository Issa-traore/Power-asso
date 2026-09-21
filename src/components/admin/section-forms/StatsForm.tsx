"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { SectionFormShell, TextField, IconSelect, Repeater } from "./SectionFormShell";

export function StatsForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"STATS"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Bandeau de statistiques" onSave={() => updateSectionContent(sectionId, content)}>
      <Repeater
        items={content.items}
        onChange={(items) => setContent({ items })}
        newItem={{ icon: "globe", value: "0", label: "Nouvelle statistique" }}
        addLabel="+ Ajouter une statistique"
        renderItem={(item, update) => (
          <>
            <IconSelect label="Icône" value={item.icon} onChange={(icon) => update({ icon })} />
            <TextField label="Valeur" value={item.value} onChange={(value) => update({ value })} />
            <TextField label="Libellé" value={item.label} onChange={(label) => update({ label })} />
          </>
        )}
      />
    </SectionFormShell>
  );
}
