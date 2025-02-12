import BotLayout from "@/components/layouts/bot-layout";
import { getUserData } from "@/lib/supabase/action";
import { redirect } from "next/navigation";

export default async function Page() {
  const result = await getUserData();

  if ("redirect" in result) {
    return redirect(result.redirect as string);
  }
  return <BotLayout />;
}
