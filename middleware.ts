import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth";

const PUBLIC_PREFIXES = ["/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const secret = process.env.APP_SESSION_SECRET;
  const expected = process.env.APP_ACCESS_PASSWORD;
  if (!secret || !expected) {
    return new NextResponse(
      "Server misconfigured: APP_ACCESS_PASSWORD or APP_SESSION_SECRET is missing.",
      { status: 500 },
    );
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token, secret);
  if (valid) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
