import { prisma } from "@/lib/prisma";
import { OrgStatusSelect } from "@/components/platform/OrgStatusSelect";

export default async function PlatformOrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: { subscription: { include: { plan: true } }, users: { where: { role: "ORG_ADMIN" }, take: 1 } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Associations abonnées</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">Association</th>
              <th className="px-4 py-2">Admin</th>
              <th className="px-4 py-2">Forfait</th>
              <th className="px-4 py-2">Domaine</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Créée le</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 font-medium">
                  {org.name}
                  <div className="text-xs text-neutral-400">{org.slug}</div>
                </td>
                <td className="px-4 py-2">{org.users[0]?.email ?? "—"}</td>
                <td className="px-4 py-2">{org.subscription?.plan.name ?? "—"}</td>
                <td className="px-4 py-2">
                  {org.customDomain ? (
                    <span className={org.customDomainStatus === "VERIFIED" ? "text-emerald-600" : "text-amber-600"}>
                      {org.customDomain}
                    </span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <OrgStatusSelect organizationId={org.id} status={org.status} />
                </td>
                <td className="px-4 py-2 text-neutral-500">{org.createdAt.toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
