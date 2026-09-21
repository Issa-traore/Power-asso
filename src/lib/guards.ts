import "server-only";

import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireOrgSession(): Promise<SessionPayload & { organizationId: string }> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "PLATFORM_ADMIN") redirect("/platform");
  if (!session.organizationId) redirect("/login");
  return session as SessionPayload & { organizationId: string };
}

export async function requirePlatformSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PLATFORM_ADMIN") redirect("/admin");
  return session;
}

export async function requireOrganization() {
  const session = await requireOrgSession();
  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
    include: { settings: true, subscription: { include: { plan: true } } },
  });
  return { session, organization };
}
