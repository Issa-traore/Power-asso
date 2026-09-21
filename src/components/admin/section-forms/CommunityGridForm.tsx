"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField, IconSelect, Repeater } from "./SectionFormShell";

type Column = SectionContent<"COMMUNITY_GRID">["left"];

function ColumnEditor({ label, column, onChange }: { label: string; column: Column; onChange: (c: Column) => void }) {
  return (
    <div className="rounded border border-neutral-200 p-4">
      <div className="mb-3 text-sm font-semibold">{label}</div>
      <div className="space-y-4">
        <TextField label="Titre de la colonne" value={column.heading} onChange={(heading) => onChange({ ...column, heading })} />
        <ImageField label="Image" value={column.imageUrl} onChange={(imageUrl) => onChange({ ...column, imageUrl })} />
        <Repeater
          items={column.items}
          onChange={(items) => onChange({ ...column, items })}
          newItem={{ icon: "globe", title: "Élément", description: "", href: "#" }}
          addLabel="+ Ajouter un élément"
          renderItem={(item, update) => (
            <>
              <IconSelect label="Icône" value={item.icon} onChange={(icon) => update({ icon })} />
              <TextField label="Titre" value={item.title} onChange={(title) => update({ title })} />
              <TextField label="Lien" value={item.href} onChange={(href) => update({ href })} />
              <div className="sm:col-span-2">
                <TextField label="Description" value={item.description} onChange={(description) => update({ description })} />
              </div>
            </>
          )}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <TextField label="Bouton — texte" value={column.cta?.label ?? ""} onChange={(v) => onChange({ ...column, cta: { label: v, href: column.cta?.href ?? "#" } })} />
          <TextField label="Bouton — lien" value={column.cta?.href ?? ""} onChange={(v) => onChange({ ...column, cta: { label: column.cta?.label ?? "", href: v } })} />
        </div>
      </div>
    </div>
  );
}

export function CommunityGridForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"COMMUNITY_GRID"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Communauté (double colonne)" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Titre général (optionnel)" value={content.heading} onChange={(v) => setContent({ ...content, heading: v })} />
      <ColumnEditor label="Colonne gauche" column={content.left} onChange={(left) => setContent({ ...content, left })} />
      <ColumnEditor label="Colonne droite" column={content.right} onChange={(right) => setContent({ ...content, right })} />
    </SectionFormShell>
  );
}
