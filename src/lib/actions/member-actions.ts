"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createMemberSessionCookie, clearMemberSessionCookie } from "@/lib/member-auth";
import { getTenantBasePath } from "@/lib/tenant";
import { redirect } from "next/navigation";

export type MemberActionState = { error?: string } | undefined;

// `slug` travels as a hidden form field (not a bound argument) — combining
// useActionState with action.bind(null, ...) hangs indefinitely in this
// Next.js 16.3.5 dev build (Turbopack); a plain action reference + form field
// avoids that broken code path (see form components for the hidden input).

export async function joinAsMember(_prev: MemberActionState, formData: FormData): Promise<MemberActionState> {
  const slug = String(formData.get("slug") ?? "");
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return { error: "Association introuvable." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !fullName || password.length < 6) {
    return { error: "Merci de renseigner un nom, un e-mail valide et un mot de passe d'au moins 6 caractères." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.member.upsert({
    where: { organizationId_email: { organizationId: org.id, email } },
    update: {},
    create: { organizationId: org.id, email, fullName, passwordHash, status: "PENDING" },
  });

  const basePath = await getTenantBasePath(slug);
  redirect(`${basePath}/adherer?success=1`);
}

export async function loginAsMember(_prev: MemberActionState, formData: FormData): Promise<MemberActionState> {
  const slug = String(formData.get("slug") ?? "");
  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return { error: "Association introuvable." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const member = await prisma.member.findUnique({ where: { organizationId_email: { organizationId: org.id, email } } });
  if (!member || !(await verifyPassword(password, member.passwordHash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }

  await createMemberSessionCookie({ memberId: member.id, organizationId: org.id, fullName: member.fullName });
  const basePath = await getTenantBasePath(slug);
  redirect(`${basePath}/espace-membre`);
}

export async function logoutMember(slug: string) {
  await clearMemberSessionCookie();
  const basePath = await getTenantBasePath(slug);
  redirect(`${basePath}/espace-membre`);
}
