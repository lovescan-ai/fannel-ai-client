import React from "react";
import VerifyEmail from "./VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = async () => {
  return (
    <div>
      <VerifyEmail />
    </div>
  );
};

export default page;
