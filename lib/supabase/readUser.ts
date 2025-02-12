"use server";

import { createClient } from "./server";

export async function readUserData() {
  const supabase = createClient();
  return await supabase.auth.getUser();
}
