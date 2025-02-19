import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  console.log("middleware running");
  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname === "/dashboard") {
    const response = NextResponse.next();

    // Add cache control headers to prevent CSS caching issues
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  const protectedRoutes = "dashboard";

  if (request.nextUrl.pathname.startsWith(`/${protectedRoutes}`) && !user) {
    console.log("No user found redirecting to signin from middleware");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const path = request.nextUrl.pathname;

  if (path === "/") {
    console.log("redirecting to dashboard");
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  const subscription = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  if (!subscription) {
    console.log("No subscription");
    return NextResponse.redirect(new URL("/auth/pricing", request.url));
  }

  if (subscription.data?.status === "canceled") {
    return NextResponse.redirect(new URL("/auth/pricing", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
