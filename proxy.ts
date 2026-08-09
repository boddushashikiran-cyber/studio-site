import { NextRequest, NextResponse } from "next/server";
import { getExpectedAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function proxy(request: NextRequest) {
  // The login page itself must stay reachable without a valid cookie —
  // otherwise there'd be no way to ever log in.
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const expectedToken = await getExpectedAdminToken();
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!expectedToken || cookieToken !== expectedToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
