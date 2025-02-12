import { getUserById } from "@/lib/supabase/action";
import { readUserData } from "@/lib/supabase/readUser";
import { NextResponse } from "next/server";

export async function GET() {
  const userData = await readUserData();

  if (!userData) {
    console.log(userData);
    return NextResponse.json({ error: "User not found!" }, { status: 400 });
  }

  let user = await getUserById(userData.data.user?.id as string);

  return NextResponse.json(user);
}
