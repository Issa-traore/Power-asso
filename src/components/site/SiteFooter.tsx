import Link from "next/link";
import type { SiteSettings } from "@prisma/client";

type NavLink = { label: string; href: string };
type SocialLink = { platform: string; url: string };

export function SiteFooter({ settings, basePath }: { settings: SiteSettings; basePath: string }) {
  const navLinks = (Array.isArray(settings.navLinks) ? settings.navLinks : []) as NavLink[];
  const socialLinks = (Array.isArray(settings.socialLinks) ? settings.socialLinks : []) as SocialLink[];

  return (
    <footer className="text-white" style={{ background: settings.secondaryColor }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-wide">{settings.siteName}</div>
            {settings.footerText && <p className="mt-3 text-sm text-white/70">{settings.footerText}</p>}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3 text-sm text-white/70">
                {socialLinks.map((s) => (
                  <a key={s.platform} href={s.url} className="hover:text-white">
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Navigation</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={`${basePath}${link.href}`} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Contact</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {settings.contactEmail && <li>{settings.contactEmail}</li>}
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              {settings.contactAddress && <li>{settings.contactAddress}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} {settings.siteName} — Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
