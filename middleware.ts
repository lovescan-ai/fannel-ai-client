import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  console.log("middleware running");
  const { supabase, response } = createClient(request);

  // Check for user first
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("authenticated user", user);

  // Check if attempting to access protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // If no user and trying to access protected route, redirect to signin
  if (isProtectedRoute && !user) {
    console.log("No user found redirecting to signin from middleware");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Only check subscription if user exists and on protected route
  if (user && isProtectedRoute) {
    try {
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // If no subscription or error, redirect to pricing
      if (error || !subscription) {
        console.log("No subscription");
        return NextResponse.redirect(new URL("/auth/pricing", request.url));
      }

      // Check subscription status
      if (subscription.status === "canceled" && subscription.credits <= 0) {
        return NextResponse.redirect(new URL("/auth/pricing", request.url));
      }
    } catch (err) {
      console.error("Error checking subscription:", err);
      // On error, still let them proceed but log it
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
