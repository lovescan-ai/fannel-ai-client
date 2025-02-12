"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface DashBodyProps {
  bgColor?: string;
  hideOverflow?: boolean;
  padding?: string;
  children: React.ReactNode;
}

const DashBody: React.FC<DashBodyProps> = ({
  bgColor,
  hideOverflow,
  padding,
  children,
}) => {
  const pathname = usePathname();
  return (
    <div
      className={`${
        padding
          ? padding
          : `pt-8 px-8 md:px-10 ${
              pathname === "/dashboard" ? "pb-48" : "pb-10"
            } lg:pb-24`
      } ${bgColor ? bgColor : ""} ${
        hideOverflow
          ? `${hideOverflow || "overflow-y-hidden"}`
          : "overflow-y-auto"
      } h-full w-full flex flex-col max-w-full overflow-x-hidden`}
    >
      <div className={`w-full h-full`}>{children}</div>
    </div>
  );
};

export default DashBody;
