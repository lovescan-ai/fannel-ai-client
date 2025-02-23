import React, { Suspense } from "react";
import AuthWrap from "../widgets/AuthWrap";
import ConnectSocials from "./ConnectSocials";
import previewImg from "@/public/connect-socials-preview.svg";
import { Metadata } from "next";
import { getCurrentCreator } from "@/lib/supabase/action";
import { redirect } from "next/navigation";
import { readUserData } from "@/lib/supabase/readUser";
import prisma from "@/lib/db";

export const metadata: Metadata = {
  title: "Connect Socials",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = async () => {
  const {
    data: { user },
  } = await readUserData();

  if (!user) {
    return redirect("/auth/signin");
  }

  const creator = await prisma.creator.findFirst({
    where: {
      userId: user.id,
      connectedCreator: false,
      connectedInstagram: false,
    },
  });

  if (!creator) {
    return redirect("/dashboard");
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
