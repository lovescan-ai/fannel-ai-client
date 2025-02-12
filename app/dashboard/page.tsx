import React, { Suspense } from "react";
import { getUserData } from "@/lib/supabase/action";
import { redirect } from "next/navigation";
import AnalyticsPage from "./analytics/main";

const Page = async () => {
  const result = await getUserData();

  if ("redirect" in result) {
    return redirect(result.redirect as string);
  }
  return (
    <>
      <Suspense>
        <AnalyticsPage />
      </Suspense>
    </>
  );
};

export default Page;
