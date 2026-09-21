"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { ImageField } from "@/components/admin/ImageField";
import { SectionFormShell, TextField } from "./SectionFormShell";

export function TestimonialForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"TESTIMONIAL"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Témoignage" onSave={() => updateSectionContent(sectionId, content)}>
      <ImageField label="Image de fond" value={content.imageUrl} onChange={(v) => setContent({ ...content, imageUrl: v })} />
      <TextField label="Citation" value={content.quote} onChange={(v) => setContent({ ...content, quote: v })} textarea />
      <TextField label="Auteur" value={content.author} onChange={(v) => setContent({ ...content, author: v })} />
    </SectionFormShell>
  );
}
