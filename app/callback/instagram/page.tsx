import { getUserData } from "@/lib/supabase/action";
import InstagramCallback from "./layout";
import { redirect } from "next/navigation";

export default async function Page() {
  const result = await getUserData();

  if ("redirect" in result) {
    return redirect(result.redirect as string);
  }

  return <InstagramCallback />;
}
