import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Rewritten requests (real subdomain/custom domain, via proxy.ts) should generate
 * root-relative links ("/adherer"); direct hits on the fallback `/site/[slug]` path
 * (used without DNS/wildcard-domain setup) need the `/site/{slug}` prefix instead.
 */
export async function getTenantBasePath(slug: string): Promise<string> {
  const isRewritten = (await headers()).has("x-tenant-slug");
  return isRewritten ? "" : `/site/${slug}`;
}

export async function getPublicOrganization(slug: string) {
  return prisma.organization.findUnique({
    where: { slug },
    include: {
      settings: true,
      sections: { where: { enabled: true }, orderBy: { order: "asc" } },
    },
  });
}

export async function getOrganizationByCustomDomain(domain: string) {
  return prisma.organization.findFirst({
    where: { customDomain: domain, customDomainStatus: "VERIFIED" },
    select: { slug: true },
  });
}
