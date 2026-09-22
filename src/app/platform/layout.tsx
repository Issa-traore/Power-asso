import Image from "next/image";
import Link from "next/link";
import { requirePlatformSession } from "@/lib/guards";
import { logout } from "@/lib/actions/auth-actions";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  await requirePlatformSession();

  return (
    <div className="flex">
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-4">
          <Image src="/brand/power-asso-icon.png" alt="Power-asso" width={28} height={28} className="h-7 w-7" />
          <span className="text-sm font-semibold">Administration plateforme</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <Link href="/platform" className="block rounded px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            Associations
          </Link>
          <Link href="/platform/plans" className="block rounded px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            Forfaits
          </Link>
        </nav>
        <form action={logout} className="border-t border-neutral-200 p-3">
          <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100">
            Déconnexion
          </button>
        </form>
      </aside>
      <main className="min-h-screen flex-1 bg-neutral-50 p-8">{children}</main>
    </div>
  );
}
