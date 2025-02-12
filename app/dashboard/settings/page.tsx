import React from "react";
import DashBody from "../widgets/DashBody";
import SettingsWrap from "./SettingsWrap";
import { getUserData } from "@/lib/supabase/action";
import { redirect } from "next/navigation";

const page = async () => {
  const result = await getUserData();

  if ("redirect" in result) {
    return redirect(result.redirect as string);
  }
  return (
    <DashBody bgColor="white" hideOverflow={false} padding="normal">
      <SettingsWrap user={result.user} />
    </DashBody>
  );
};

export default page;
