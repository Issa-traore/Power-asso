"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField, Repeater } from "./SectionFormShell";

export function NewsNewsletterForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"NEWS_NEWSLETTER"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Actualités & newsletter" onSave={() => updateSectionContent(sectionId, content)}>
      <TextField label="Titre de la section" value={content.heading} onChange={(v) => setContent({ ...content, heading: v })} />

      <div>
        <div className="mb-2 text-sm font-medium">Articles / événements</div>
        <Repeater
          items={content.articles}
          onChange={(articles) => setContent({ ...content, articles })}
          newItem={{ tag: "Article", imageUrl: "", date: "", title: "Nouvel article", excerpt: "", href: "#" }}
          addLabel="+ Ajouter un article"
          renderItem={(item, update) => (
            <>
              <TextField label="Étiquette" value={item.tag} onChange={(tag) => update({ tag })} />
              <TextField label="Date" value={item.date} onChange={(date) => update({ date })} />
              <TextField label="Titre" value={item.title} onChange={(title) => update({ title })} />
              <TextField label="Lien" value={item.href} onChange={(href) => update({ href })} />
              <div className="sm:col-span-2">
                <TextField label="Extrait" value={item.excerpt} onChange={(excerpt) => update({ excerpt })} />
              </div>
              <div className="sm:col-span-2">
                <ImageField label="Image" value={item.imageUrl} onChange={(imageUrl) => update({ imageUrl })} />
              </div>
            </>
          )}
        />
      </div>

      <TextField label="Badge newsletter" value={content.newsletterBadge} onChange={(v) => setContent({ ...content, newsletterBadge: v })} />
      <TextField label="Titre newsletter" value={content.newsletterHeading} onChange={(v) => setContent({ ...content, newsletterHeading: v })} />
      <TextField label="Texte newsletter" value={content.newsletterText} onChange={(v) => setContent({ ...content, newsletterText: v })} textarea />
      <TextField label="Texte du bouton" value={content.newsletterButtonLabel} onChange={(v) => setContent({ ...content, newsletterButtonLabel: v })} />

      <ImageField label="Image de la citation" value={content.quoteImageUrl} onChange={(v) => setContent({ ...content, quoteImageUrl: v })} />
      <TextField label="Texte de la citation" value={content.quoteText} onChange={(v) => setContent({ ...content, quoteText: v })} textarea />
    </SectionFormShell>
  );
}
