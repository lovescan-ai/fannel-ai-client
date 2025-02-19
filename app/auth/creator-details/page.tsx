"use server";

import React, { Suspense } from "react";
import AuthWrap from "../widgets/AuthWrap";
import previewImg from "../../../public/creator-details-preview.png";
import CreatorDetails from "./CreatorDetails";
import { Loader } from "lucide-react";
import {
  getCreator,
  getSubscriptionById,
  getUser,
} from "@/lib/supabase/action";
import { redirect } from "next/navigation";

const page = async () => {
  const data = await getUser();
  const creator = await getCreator(data?.id as string);
  const subscription = await getSubscriptionById(data?.id as string);

  if (creator?.connectedCreator && creator?.connectedInstagram) {
    if (subscription?.status === "active") {
      return redirect("/");
    } else {
      return redirect("/auth/pricing");
    }
  }
  return (
    <AuthWrap
      previewImg={previewImg as any}
      previewAlt={"Creator details - Flannel review"}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-brandBlue2x w-10 h-10" />
          </div>
        }
      >
        <CreatorDetails />
      </Suspense>
    </AuthWrap>
  );
};

export default page;
