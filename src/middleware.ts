import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route (needs auth)
  const isAdminRoute = locales.some((l) =>
    pathname.startsWith(`/${l}/admin`)
  );

  if (isAdminRoute) {
    const token = request.cookies.get("kidorly-admin-token")?.value;
    if (!token) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
