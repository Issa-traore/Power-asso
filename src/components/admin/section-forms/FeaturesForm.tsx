"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { SectionFormShell, TextField, IconSelect, Repeater } from "./SectionFormShell";

export function FeaturesForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"FEATURES"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Grille de fonctionnalités" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Titre de la section" value={content.heading} onChange={(v) => setContent({ ...content, heading: v })} />
      <Repeater
        items={content.items}
        onChange={(items) => setContent({ ...content, items })}
        newItem={{ icon: "globe", title: "Nouvelle fonctionnalité", description: "" }}
        addLabel="+ Ajouter une carte"
        renderItem={(item, update) => (
          <>
            <IconSelect label="Icône" value={item.icon} onChange={(icon) => update({ icon })} />
            <TextField label="Titre" value={item.title} onChange={(title) => update({ title })} />
            <div className="sm:col-span-2">
              <TextField label="Description" value={item.description} onChange={(description) => update({ description })} />
            </div>
          </>
        )}
      />
    </SectionFormShell>
  );
}
