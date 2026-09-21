import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSiteSettingsPage() {
  const session = await requireOrgSession();
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { organizationId: session.organizationId } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Apparence & en-tête</h1>
      <p className="mt-1 text-sm text-neutral-500">Logo, couleurs, menu et pied de page de votre site public.</p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
