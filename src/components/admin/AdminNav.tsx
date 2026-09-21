"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth-actions";
import { LayoutDashboard, LayoutTemplate, Image as ImageIcon, CreditCard, Settings, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/site", label: "Page d'accueil", icon: LayoutTemplate },
  { href: "/admin/site/settings", label: "Apparence & en-tête", icon: Settings },
  { href: "/admin/media", label: "Médiathèque", icon: ImageIcon },
  { href: "/admin/billing", label: "Abonnement", icon: CreditCard },
];

export function AdminNav({ orgName, siteUrl }: { orgName: string; siteUrl: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <div className="text-sm font-semibold">{orgName}</div>
        <a href={siteUrl} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 underline">
          Voir le site public →
        </a>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium ${
                active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="border-t border-neutral-200 p-3">
        <button type="submit" className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </form>
    </aside>
  );
}
