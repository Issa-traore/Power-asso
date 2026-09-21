import { requireOrganization } from "@/lib/guards";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { organization } = await requireOrganization();
  const baseDomain = process.env.APP_BASE_DOMAIN || "localhost";
  const port = process.env.NODE_ENV === "development" ? ":3000" : "";
  const siteUrl = `http://${organization.slug}.${baseDomain}${port}`;

  return (
    <div className="flex">
      <AdminNav orgName={organization.name} siteUrl={siteUrl} />
      <main className="min-h-screen flex-1 bg-neutral-50 p-8">{children}</main>
    </div>
  );
}
