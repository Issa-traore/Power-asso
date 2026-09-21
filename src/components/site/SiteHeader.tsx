import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

type NavLink = { label: string; href: string };

export function SiteHeader({ settings, basePath }: { settings: SiteSettings; basePath: string }) {
  const navLinks = (Array.isArray(settings.navLinks) ? settings.navLinks : []) as NavLink[];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href={basePath || "/"} className="flex items-center gap-3">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.siteName} width={40} height={40} className="h-10 w-10 rounded object-contain" />
          ) : (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ background: settings.primaryColor }}
            >
              {settings.siteName.slice(0, 1)}
            </span>
          )}
          <span className="text-sm font-bold uppercase leading-tight tracking-wide">{settings.siteName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={`${basePath}${link.href}`} className="hover:text-neutral-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {settings.showAdherer && (
            <Link
              href={`${basePath}${settings.adhererHref}`}
              className="rounded px-4 py-2 text-sm font-semibold text-white"
              style={{ background: settings.primaryColor }}
            >
              {settings.adhererLabel}
            </Link>
          )}
          {settings.showMemberArea && (
            <Link
              href={`${basePath}${settings.memberAreaHref}`}
              className="hidden rounded px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
              style={{ background: settings.secondaryColor }}
            >
              {settings.memberAreaLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
