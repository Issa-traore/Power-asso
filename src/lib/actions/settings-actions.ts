"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";

export type ActionState = { error?: string; success?: boolean } | undefined;

function parseNavLinks(raw: string): { label: string; href: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((s) => s.trim());
      return { label: label || "Lien", href: href || "#" };
    });
}

function parseSocialLinks(raw: string): { platform: string; url: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [platform, url] = line.split("|").map((s) => s.trim());
      return { platform: platform || "Lien", url: url || "#" };
    });
}

export async function updateSiteSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireOrgSession();

  const siteName = String(formData.get("siteName") ?? "").trim();
  if (!siteName) return { error: "Le nom du site est obligatoire." };

  await prisma.siteSettings.update({
    where: { organizationId: session.organizationId },
    data: {
      siteName,
      tagline: String(formData.get("tagline") ?? "") || null,
      logoUrl: String(formData.get("logoUrl") ?? "") || null,
      primaryColor: String(formData.get("primaryColor") ?? "#C8901F"),
      secondaryColor: String(formData.get("secondaryColor") ?? "#1F1B16"),
      navLinks: parseNavLinks(String(formData.get("navLinks") ?? "")),
      showAdherer: formData.get("showAdherer") === "on",
      adhererLabel: String(formData.get("adhererLabel") ?? "ADHÉRER"),
      adhererHref: String(formData.get("adhererHref") ?? "/adherer"),
      showMemberArea: formData.get("showMemberArea") === "on",
      memberAreaLabel: String(formData.get("memberAreaLabel") ?? "ESPACE MEMBRE"),
      memberAreaHref: String(formData.get("memberAreaHref") ?? "/espace-membre"),
      footerText: String(formData.get("footerText") ?? "") || null,
      socialLinks: parseSocialLinks(String(formData.get("socialLinks") ?? "")),
      contactEmail: String(formData.get("contactEmail") ?? "") || null,
      contactPhone: String(formData.get("contactPhone") ?? "") || null,
      contactAddress: String(formData.get("contactAddress") ?? "") || null,
    },
  });

  const org = await prisma.organization.findUniqueOrThrow({ where: { id: session.organizationId } });
  revalidatePath(`/site/${org.slug}`);

  return { success: true };
}
