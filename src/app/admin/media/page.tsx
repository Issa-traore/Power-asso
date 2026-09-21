import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const session = await requireOrgSession();
  const items = await prisma.media.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, filename: true, sizeBytes: true },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Médiathèque</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Importez vos images, puis copiez leur URL dans les blocs de votre page d&apos;accueil.
      </p>
      <div className="mt-6">
        <MediaLibrary items={items} />
      </div>
    </div>
  );
}
