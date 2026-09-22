"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePlatformSession } from "@/lib/guards";
import type { OrgStatus } from "@prisma/client";

export async function setOrganizationStatus(organizationId: string, status: OrgStatus) {
  await requirePlatformSession();
  await prisma.organization.update({ where: { id: organizationId }, data: { status } });
  revalidatePath("/platform");
}

export async function upsertPlan(_prev: { error?: string } | undefined, formData: FormData) {
  await requirePlatformSession();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const monthlyPriceCents = Math.round(Number(formData.get("price") ?? 0) * 100);
  const currency = String(formData.get("currency") ?? "XOF");
  const maxSections = Number(formData.get("maxSections") ?? 10);
  const storageMb = Number(formData.get("storageMb") ?? 500);
  const customDomain = formData.get("customDomain") === "on";
  const isActive = formData.get("isActive") === "on";

  if (!name || !slug || monthlyPriceCents < 0) {
    return { error: "Merci de renseigner un nom, un identifiant et un prix valides." };
  }

  const data = {
    name,
    slug,
    monthlyPriceCents,
    currency,
    features: { maxSections, storageMb, customDomain, removeBranding: customDomain },
    isActive,
  };

  if (id) {
    await prisma.plan.update({ where: { id }, data });
  } else {
    await prisma.plan.create({ data });
  }

  revalidatePath("/platform/plans");
  return { error: undefined };
}
