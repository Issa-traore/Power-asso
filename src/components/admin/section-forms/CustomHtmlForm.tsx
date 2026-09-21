"use client";

import { useState } from "react";
import { updateSectionContent } from "@/lib/actions/section-actions";
import type { SectionContent } from "@/lib/sections/schema";
import { SectionFormShell } from "./SectionFormShell";

export function CustomHtmlForm({ sectionId, initial }: { sectionId: string; initial: SectionContent<"CUSTOM_HTML"> }) {
  const [content, setContent] = useState(initial);

  return (
    <SectionFormShell title="Bloc HTML personnalisé" onSave={() => updateSectionContent(sectionId, content)}>
      <textarea
        value={content.html}
        onChange={(e) => setContent({ html: e.target.value })}
        rows={12}
        className="w-full rounded border border-neutral-300 px-3 py-2 font-mono text-xs"
      />
      <p className="text-xs text-neutral-500">Ce bloc est affiché tel quel sur votre page publique. À utiliser avec précaution.</p>
    </SectionFormShell>
  );
}
