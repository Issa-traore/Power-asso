"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Trash2, Pencil, Plus } from "lucide-react";
import { toggleSection, deleteSection, reorderSections, addSection } from "@/lib/actions/section-actions";
import { SECTION_LABELS, type SectionTypeKey } from "@/lib/sections/schema";

type SectionRow = { id: string; type: SectionTypeKey; enabled: boolean; order: number };

const ALL_TYPES = Object.keys(SECTION_LABELS) as SectionTypeKey[];

export function SectionList({ sections }: { sections: SectionRow[] }) {
  const [items, setItems] = useState(sections);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    startTransition(async () => {
      await reorderSections(next.map((s) => s.id));
      router.refresh();
    });
  }

  function handleToggle(id: string, enabled: boolean) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    startTransition(async () => {
      await toggleSection(id, enabled);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer cette section ?")) return;
    setItems((prev) => prev.filter((s) => s.id !== id));
    startTransition(async () => {
      await deleteSection(id);
      router.refresh();
    });
  }

  function handleAdd(type: SectionTypeKey) {
    setError(null);
    startTransition(async () => {
      try {
        await addSection(type);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors de l'ajout de la section.");
      }
    });
  }

  return (
    <div>
      <ul className="space-y-2">
        {items.map((section, index) => (
          <li
            key={section.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || pending}
                  className="text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || pending}
                  className="text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <div className="text-sm font-medium">{SECTION_LABELS[section.type]}</div>
                <div className="text-xs text-neutral-500">{section.enabled ? "Visible" : "Masquée"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-neutral-500">
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => handleToggle(section.id, e.target.checked)}
                />
                Visible
              </label>
              <Link href={`/admin/site/sections/${section.id}`} className="text-neutral-500 hover:text-neutral-900">
                <Pencil className="h-4 w-4" />
              </Link>
              <button onClick={() => handleDelete(section.id)} className="text-neutral-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 rounded-lg border border-dashed border-neutral-300 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Plus className="h-4 w-4" /> Ajouter une section
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleAdd(type)}
              disabled={pending}
              className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 disabled:opacity-50"
            >
              {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
