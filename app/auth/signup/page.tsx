import React from "react";
import AuthWrap from "../widgets/AuthWrap";
import SignUpForm from "./SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const Page = async () => {
  return (
    <AuthWrap previewImg="">
      <div>
        <SignUpForm />
      </div>
    </AuthWrap>
  );
};

export default Page;
