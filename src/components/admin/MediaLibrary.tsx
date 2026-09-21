"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload } from "lucide-react";
import { uploadMedia, deleteMedia } from "@/lib/actions/media-actions";

type MediaItem = { id: string; url: string; filename: string; sizeBytes: number };

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.append("file", file);
        await uploadMedia(fd);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Supprimer ce média ?")) return;
    startTransition(async () => {
      await deleteMedia(id);
      router.refresh();
    });
  }

  return (
    <div>
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
        <Upload className="h-4 w-4" />
        {uploading ? "Envoi..." : "Importer des images"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.filename} className="h-28 w-full object-cover" />
            <button
              onClick={() => handleDelete(item.id)}
              disabled={pending}
              className="absolute right-1 top-1 rounded bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.url);
              }}
              className="block w-full truncate bg-white px-2 py-1 text-left text-[10px] text-neutral-500"
              title="Copier l'URL"
            >
              {item.url}
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-neutral-500">Aucune image importée pour le moment.</p>}
      </div>
    </div>
  );
}
