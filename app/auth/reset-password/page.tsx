import React from "react";
import AuthWrap from "../widgets/AuthWrap";
import ResetPassword from "./ResetPassword";

const page = () => {
  return (
    <AuthWrap previewImg="">
      <ResetPassword />
    </AuthWrap>
  );
};

export default page;
