"use server";

import React from "react";
import Accounts from "./Accounts";
import { getUserData } from "@/lib/supabase/action";
import { redirect } from "next/navigation";

const Page = async () => {
  const result = await getUserData();

  if ("redirect" in result) {
    return redirect(result.redirect as string);
  }
  return (
    <>
      <Accounts />
    </>
  );
};

export default Page;
