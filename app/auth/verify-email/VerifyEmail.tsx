"use client";

import BasicLink from "@/components/elements/buttons/BasicLink";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import logo from "../../../public//logo/logo.png";

const VerifyEmail = () => {
  // Mock data
  const mockState = {
    loading: false,
    error: false,
    validToken: true,
  };

  return (
    <div
      className={"min-h-screen h-screen px-4 md:px-8 lg:px-24 flex flex-col"}
    >
      <div className="pt-8">
        <Image src={logo} alt="Flannel logo" className={`w-20`} />
      </div>

      <div
        className={`flex flex-col gap-2 items-center h-full justify-center py-20 text-center text-xl font-semibold text-brandBlue4x`}
      >
        {mockState.loading ? (
          <p>Verifying your email ...</p>
        ) : mockState.error || !mockState.validToken ? (
          <div className={`flex flex-col gap-4 items-center`}>
            <p>Something went wrong</p>
            <p className={`text-xs text-black`}>Token couldn't be verified</p>
          </div>
        ) : (
          <div className={`flex flex-col gap-4 items-center`}>
            <p>Successfully verified your email</p>
            <BasicLink
              id="login-link"
              link="/auth/login"
              text="Proceed to Login"
              fontSize="text-base"
              width="w-fit"
              bgColor="bg-blue-500"
              fontType="font-semibold"
              padding="py-2 px-4"
              flex="flex"
              textColor="text-white"
              borderRadius="rounded"
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyEmail;
