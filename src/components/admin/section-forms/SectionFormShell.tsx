"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function SectionFormShell({
  title,
  onSave,
  children,
}: {
  title: string;
  onSave: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await onSave();
        setSaved(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement.");
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600">Enregistré ✓</span>}
          <button
            onClick={handleSave}
            disabled={pending}
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      )}
    </div>
  );
}

export function IconSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const options = ["globe", "users", "graduation", "handshake", "book", "trending", "heart", "pin", "calendar", "mail", "lightbulb", "message", "handheart", "users2", "map"];
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 rounded border border-neutral-300 px-2 py-1 text-sm">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Repeater<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  newItem: T;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative rounded border border-neutral-200 p-3">
          <button
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-red-600"
          >
            Supprimer
          </button>
          <div className="grid gap-2 pr-16 sm:grid-cols-2">
            {renderItem(item, (patch) => {
              const next = [...items];
              next[i] = { ...next[i], ...patch };
              onChange(next);
            }, i)}
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, newItem])}
        className="rounded border border-dashed border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
      >
        {addLabel}
      </button>
    </div>
  );
}
