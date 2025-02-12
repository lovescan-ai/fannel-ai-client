import React from "react";
import Link from "next/link";
import logo from "@/public/logo/logo.png";
import Image from "next/image";
export default function LogoAppBar() {
  return (
    <div
      className={`bg-white z-50 flex flex-col gap-28 py-5 px-6 sm:px-10 lg:px-24`}
    >
      <div>
        <Link href={"/"}>
          {" "}
          <Image src={logo} alt={"Flannel"} className={`w-36 h-auto`} />{" "}
        </Link>
      </div>
    </div>
  );
}
