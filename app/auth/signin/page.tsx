import React from "react";
import LoginForm from "./SigninForm";
import AuthWrap from "../widgets/AuthWrap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signin",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = async () => {
  return (
    <AuthWrap previewImg="">
      <div>
        <LoginForm />
      </div>
    </AuthWrap>
  );
};

export default page;
