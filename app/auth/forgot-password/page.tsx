import React from "react";
import AuthWrap from "../widgets/AuthWrap";
import ForgotPassword from "./ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = () => {
  return (
    <AuthWrap previewImg="">
      <ForgotPassword />
    </AuthWrap>
  );
};

export default page;
