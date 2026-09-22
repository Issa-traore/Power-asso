"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie, hashPassword, verifyPassword } from "@/lib/auth";
import { defaultSectionContent } from "@/lib/sections/schema";

export type ActionState = { error?: string } | undefined;

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  await createSessionCookie({
    userId: user.id,
    role: user.role,
    organizationId: user.organizationId,
    email: user.email,
    name: user.name,
  });

  redirect(user.role === "PLATFORM_ADMIN" ? "/platform" : "/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}

const DEFAULT_SECTION_ORDER = ["HERO", "STATS", "FEATURES", "NETWORK_MAP", "NEWS_NEWSLETTER", "COMMUNITY_GRID", "CTA_FOOTER"] as const;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function register(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const orgName = String(formData.get("orgName") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!orgName || !name || !email || password.length < 6) {
    return { error: "Merci de remplir tous les champs (mot de passe : 6 caractères minimum)." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Un compte existe déjà avec cet e-mail." };

  const baseSlug = slugify(orgName) || "association";
  let slug = baseSlug;
  let attempt = 1;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${attempt++}`;
  }

  const plan = await prisma.plan.findFirst({ where: { isActive: true }, orderBy: { monthlyPriceCents: "asc" } });
  if (!plan) return { error: "Aucun plan d'abonnement n'est configuré. Contactez la plateforme." };

  const passwordHash = await hashPassword(password);

  const { org, user } = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({ data: { name: orgName, slug, status: "TRIAL" } });

    await tx.siteSettings.create({
      data: {
        organizationId: org.id,
        siteName: orgName,
        navLinks: [
          { label: "Association", href: "#about" },
          { label: "Actualités", href: "#news" },
        ],
      },
    });

    await tx.subscription.create({
      data: {
        organizationId: org.id,
        planId: plan.id,
        status: "TRIALING",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    const user = await tx.user.create({
      data: { email, passwordHash, name, role: "ORG_ADMIN", organizationId: org.id },
    });

    for (let i = 0; i < DEFAULT_SECTION_ORDER.length; i++) {
      const type = DEFAULT_SECTION_ORDER[i];
      await tx.section.create({
        data: { organizationId: org.id, type, order: i, content: defaultSectionContent(type) as never },
      });
    }

    return { org, user };
  });

  await createSessionCookie({ userId: user.id, role: "ORG_ADMIN", organizationId: org.id, email, name });

  redirect("/admin");
}
