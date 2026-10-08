import { NextResponse, type NextRequest } from "next/server";

// Redirection de confort uniquement : la VRAIE vérification des droits est faite côté serveur
// dans chaque page, action et route (ne jamais se reposer sur le proxy pour la sécurité).
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("__Host-session") || request.cookies.has("session");
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
