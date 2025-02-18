import { getUserData } from "@/lib/supabase/action";
import InstagramCallback from "./layout";

export default async function Page() {
  await getUserData();

  return <InstagramCallback />;
}
