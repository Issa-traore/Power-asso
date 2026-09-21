import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { SectionList } from "@/components/admin/SectionList";
import type { SectionTypeKey } from "@/lib/sections/schema";

export default async function AdminSitePage() {
  const session = await requireOrgSession();
  const sections = await prisma.section.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { order: "asc" },
    select: { id: true, type: true, enabled: true, order: true },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Page d&apos;accueil</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Réorganisez, activez/désactivez ou modifiez chaque bloc de votre page d&apos;accueil publique.
      </p>

      <div className="mt-6">
        <SectionList sections={sections.map((s) => ({ ...s, type: s.type as SectionTypeKey }))} />
      </div>
    </div>
  );
}
