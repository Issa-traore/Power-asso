import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getOrganizationByCustomDomain } from "@/lib/tenant";

// Multi-tenant routing: every subscribing association gets a public homepage at
// {slug}.{APP_BASE_DOMAIN} or on its own custom domain. Both are rewritten here to
// the internal /site/[slug] route so a single Next.js app serves every tenant.
// The root app domain itself (APP_BASE_DOMAIN with no subdomain) serves the
// marketing/login/admin/platform pages and is left untouched.

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const baseDomain = (process.env.APP_BASE_DOMAIN || "localhost").toLowerCase();

  if (!host || host === baseDomain || host === `www.${baseDomain}`) {
    return NextResponse.next();
  }

  let slug: string | null = null;

  if (host.endsWith(`.${baseDomain}`)) {
    slug = host.slice(0, -(baseDomain.length + 1));
  } else {
    const org = await getOrganizationByCustomDomain(host).catch(() => null);
    slug = org?.slug ?? null;
  }

  if (!slug) return NextResponse.next();

  // Marks the request as tenant-rewritten so the page knows generated links can be
  // host-root-relative ("/adherer") instead of prefixed with "/site/{slug}" — the
  // prefix is only needed when this route is hit directly (dev/demo without DNS).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-slug", slug);

  const url = request.nextUrl.clone();
  url.pathname = `/site/${slug}${request.nextUrl.pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|uploads|favicon.ico).*)"],
};
