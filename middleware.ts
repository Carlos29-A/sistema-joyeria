import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/productos")) {
    if (!req.auth?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const role = (req.auth.user as { role?: string }).role;

    if (role !== "administrador" && req.method !== "GET") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/api/:path*"],
};
