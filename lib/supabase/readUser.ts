"use server";

import { createClient } from "./server";

export async function readUserData() {
  const supabase = createClient();
  const data = await supabase.auth.getUser();

  console.log("Authenticated data", data);
  return data;
}
