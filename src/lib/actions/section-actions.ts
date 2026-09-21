"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";
import { parseSectionContent, defaultSectionContent, type SectionTypeKey } from "@/lib/sections/schema";
import type { SectionType } from "@prisma/client";

async function assertOwnsSection(sectionId: string) {
  const session = await requireOrgSession();
  const section = await prisma.section.findUniqueOrThrow({ where: { id: sectionId } });
  if (section.organizationId !== session.organizationId) throw new Error("Accès refusé");
  return { session, section };
}

function revalidateSite(slug: string) {
  revalidatePath(`/site/${slug}`);
}

export async function addSection(type: SectionTypeKey) {
  const session = await requireOrgSession();
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
    include: { subscription: { include: { plan: true } } },
  });

  const maxSections = (org.subscription?.plan.features as { maxSections?: number } | null)?.maxSections;
  if (typeof maxSections === "number") {
    const count = await prisma.section.count({ where: { organizationId: org.id } });
    if (count >= maxSections) {
      throw new Error(`Votre forfait est limité à ${maxSections} sections. Passez à un forfait supérieur pour en ajouter davantage.`);
    }
  }

  const maxOrder = await prisma.section.aggregate({
    where: { organizationId: org.id },
    _max: { order: true },
  });

  const section = await prisma.section.create({
    data: {
      organizationId: org.id,
      type: type as SectionType,
      order: (maxOrder._max.order ?? -1) + 1,
      content: defaultSectionContent(type) as never,
    },
  });

  revalidateSite(org.slug);
  return section.id;
}

export async function toggleSection(sectionId: string, enabled: boolean) {
  const { section } = await assertOwnsSection(sectionId);
  await prisma.section.update({ where: { id: sectionId }, data: { enabled } });
  const org = await prisma.organization.findUniqueOrThrow({ where: { id: section.organizationId } });
  revalidateSite(org.slug);
}

export async function deleteSection(sectionId: string) {
  const { section } = await assertOwnsSection(sectionId);
  await prisma.section.delete({ where: { id: sectionId } });
  const org = await prisma.organization.findUniqueOrThrow({ where: { id: section.organizationId } });
  revalidateSite(org.slug);
}

export async function reorderSections(orderedIds: string[]) {
  const session = await requireOrgSession();
  const sections = await prisma.section.findMany({ where: { id: { in: orderedIds } } });
  if (sections.some((s) => s.organizationId !== session.organizationId)) throw new Error("Accès refusé");

  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.section.update({ where: { id }, data: { order: index } })),
  );

  const org = await prisma.organization.findUniqueOrThrow({ where: { id: session.organizationId } });
  revalidateSite(org.slug);
}

export async function updateSectionContent(sectionId: string, content: unknown) {
  const { section } = await assertOwnsSection(sectionId);
  const parsed = parseSectionContent(section.type as SectionTypeKey, content);
  await prisma.section.update({ where: { id: sectionId }, data: { content: parsed as never } });
  const org = await prisma.organization.findUniqueOrThrow({ where: { id: section.organizationId } });
  revalidateSite(org.slug);
}
