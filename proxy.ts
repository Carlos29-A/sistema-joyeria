import { auth } from "./lib/auth";

export default auth((req) => {
   const role = (req.auth as { role?: string } | undefined)?.role;
    const isAdmin = role === "administrador";
    if (!isAdmin && req.nextUrl.pathname.startsWith("/admin")){
         return Response.redirect(new URL("/login", req.url));
    }
})

export const config = {
    matcher: ["/admin/:path*"],
}