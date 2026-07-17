import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth-token";
import { defaultLocale, locales } from "@/lib/i18n";
import { routing } from "@/lib/routing";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = locales.some((locale) =>
    pathname.startsWith(`/${locale}/admin`),
  );

  if (isAdminRoute) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = token ? await verifyAdminToken(token) : null;

    if (!session) {
      const locale =
        locales.find((candidate) => pathname.startsWith(`/${candidate}`)) ||
        defaultLocale;
      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url),
      );
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
