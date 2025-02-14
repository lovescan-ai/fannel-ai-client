import React, { Suspense } from "react";
import AuthWrap from "../widgets/AuthWrap";
import ConnectSocials from "./ConnectSocials";
import previewImg from "@/public/connect-socials-preview.svg";
import { Metadata } from "next";
import { getCurrentCreator } from "@/lib/supabase/action";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Connect Socials",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = async () => {
  const creator = await getCurrentCreator();

  if (creator?.connectedInstagram && creator?.instagramAccessToken) {
    return redirect("/");
  }

  return (
    <AuthWrap
      previewImg={previewImg as any}
      previewAlt={"Connect socials - Conversation Sample"}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ConnectSocials />
      </Suspense>
    </AuthWrap>
  );
};

export default page;
