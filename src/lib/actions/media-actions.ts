"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";
import { saveUpload } from "@/lib/media/storage";

export async function uploadMedia(formData: FormData) {
  const session = await requireOrgSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Aucun fichier fourni.");

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
    include: { subscription: { include: { plan: true } } },
  });

  const storageMb = (org.subscription?.plan.features as { storageMb?: number } | null)?.storageMb;
  if (typeof storageMb === "number") {
    const used = await prisma.media.aggregate({ where: { organizationId: org.id }, _sum: { sizeBytes: true } });
    const usedMb = (used._sum.sizeBytes ?? 0) / (1024 * 1024);
    if (usedMb >= storageMb) {
      throw new Error(`Quota de stockage atteint (${storageMb} Mo). Passez à un forfait supérieur.`);
    }
  }

  const saved = await saveUpload(org.id, file);

  const media = await prisma.media.create({
    data: {
      organizationId: org.id,
      url: saved.url,
      filename: saved.filename,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
      width: saved.width,
      height: saved.height,
    },
  });

  revalidatePath("/admin/media");
  return media;
}

export async function deleteMedia(mediaId: string) {
  const session = await requireOrgSession();
  const media = await prisma.media.findUniqueOrThrow({ where: { id: mediaId } });
  if (media.organizationId !== session.organizationId) throw new Error("Accès refusé");
  await prisma.media.delete({ where: { id: mediaId } });
  revalidatePath("/admin/media");
}
