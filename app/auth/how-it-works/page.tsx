import React from "react";
import HowItWorks from "./HowItWorks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

const page = () => {
  return (
    <div>
      <HowItWorks />
    </div>
  );
};

export default page;
