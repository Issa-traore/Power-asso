"use server";

import dns from "dns/promises";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireOrgSession } from "@/lib/guards";

export type DomainActionState = { error?: string; success?: string } | undefined;

const DOMAIN_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})+$/i;

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

async function requireCustomDomainFeature(organizationId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    include: { plan: true },
  });
  const allowed = Boolean((subscription?.plan.features as { customDomain?: boolean } | null)?.customDomain);
  if (!allowed) {
    throw new Error("Le domaine personnalisé n'est pas inclus dans votre forfait actuel. Passez à un forfait supérieur pour l'activer.");
  }
}

export async function setCustomDomain(_prev: DomainActionState, formData: FormData): Promise<DomainActionState> {
  const session = await requireOrgSession();

  try {
    await requireCustomDomainFeature(session.organizationId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Action non autorisée." };
  }

  const domain = normalizeDomain(String(formData.get("domain") ?? ""));
  if (!DOMAIN_RE.test(domain)) {
    return { error: "Merci de saisir un nom de domaine valide, par exemple www.monassociation.org." };
  }

  const existing = await prisma.organization.findUnique({ where: { customDomain: domain } });
  if (existing && existing.id !== session.organizationId) {
    return { error: "Ce domaine est déjà utilisé par une autre association." };
  }

  await prisma.organization.update({
    where: { id: session.organizationId },
    data: { customDomain: domain, customDomainStatus: "PENDING" },
  });

  revalidatePath("/admin/site/domain");
  return { success: "Domaine enregistré. Configurez votre DNS puis lancez la vérification." };
}

export async function removeCustomDomain() {
  const session = await requireOrgSession();
  await prisma.organization.update({
    where: { id: session.organizationId },
    data: { customDomain: null, customDomainStatus: "PENDING" },
  });
  revalidatePath("/admin/site/domain");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- useActionState requires this exact (prevState, formData) signature
export async function verifyCustomDomain(_prev: DomainActionState, _formData: FormData): Promise<DomainActionState> {
  const session = await requireOrgSession();
  const org = await prisma.organization.findUniqueOrThrow({ where: { id: session.organizationId } });
  if (!org.customDomain) return { error: "Aucun domaine à vérifier." };

  const baseDomain = process.env.APP_BASE_DOMAIN || "localhost";
  const serverIp = process.env.APP_SERVER_IP; // optional: set this to auto-verify apex/root domains via their A record
  let verified = false;
  let sawARecordOnly = false;

  try {
    const cnames = await dns.resolveCname(org.customDomain);
    verified = cnames.some((c) => c.toLowerCase() === baseDomain.toLowerCase() || c.toLowerCase().endsWith(`.${baseDomain.toLowerCase()}`));
  } catch {
    // No CNAME (common for apex/root domains, which must use an A record instead) — fall through.
  }

  if (!verified) {
    try {
      const addresses = await dns.resolve4(org.customDomain);
      if (serverIp) {
        verified = addresses.includes(serverIp);
      } else if (addresses.length > 0) {
        sawARecordOnly = true; // an A record exists, but this deployment has no APP_SERVER_IP to check it against
      }
    } catch {
      // Neither a usable CNAME nor an A record was found.
    }
  }

  if (!verified) {
    return {
      error: sawARecordOnly
        ? "Un enregistrement A a été trouvé, mais cette instance ne peut pas confirmer automatiquement qu'il pointe vers le bon serveur. Préférez un sous-domaine (ex. www.votreassociation.org) avec un enregistrement CNAME, qui peut être vérifié automatiquement."
        : "Aucun enregistrement DNS valide n'a été trouvé pour ce domaine. Vérifiez la configuration chez votre registrar puis réessayez (la propagation DNS peut prendre jusqu'à 24h).",
    };
  }

  await prisma.organization.update({
    where: { id: session.organizationId },
    data: { customDomainStatus: "VERIFIED" },
  });

  revalidatePath("/admin/site/domain");
  return { success: "Domaine vérifié et actif !" };
}
