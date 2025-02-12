import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log("Code:", code);

  if (code) {
    console.log("Received Instagram authorization code:", code);
    return NextResponse.redirect(new URL("/account", req.url));
  } else {
    // Handle error case
    return NextResponse.redirect(new URL("/auth-error", req.url));
  }
};
