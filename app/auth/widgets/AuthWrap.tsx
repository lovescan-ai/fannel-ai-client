import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthImageSection from "./AuthImageSection";
import AltAuthImageSection from "./AltAuthImageSection";
import logo from "../../../public/logo/logo.png";

interface AuthWrapProps {
  previewImg: string;
  previewMini?: string;
  previewAlt?: string;
  zIndex?: string;
  previewMiniAlt?: string;
  altImageSection?: boolean;
  children: React.ReactNode;
  className?: string;
  isPricing?: boolean;
}

const AuthWrap: React.FC<AuthWrapProps> = ({
  previewImg,
  previewMini,
  previewAlt,
  zIndex,
  previewMiniAlt,
  altImageSection,
  children,
  className,
  isPricing,
}) => {
  return (
    <div className={`grid md:grid-cols-2 h-full mulish--regular`}>
      <div
        className={`bg-white ${zIndex} flex flex-col ${
          isPricing ? "lg:gap-10 gap-5" : "lg:gap-28"
        } gap-12 lg:py-16 py-8 px-6 sm:px-10 lg:px-24`}
      >
        <div>
          <Link href={"/"}>
            {" "}
            <Image src={logo} alt={"Flannel"} className={`w-52 h-auto`} />{" "}
          </Link>
        </div>
        <div className={className}>{children}</div>
      </div>

      {altImageSection ? (
        <AltAuthImageSection
          previewImg={previewImg}
          previewAlt={previewAlt ?? ""}
          previewMini={previewMini ?? ""}
          previewMiniAlt={previewMiniAlt ?? ""}
        />
      ) : (
        <AuthImageSection previewImg={previewImg} previewAlt={previewAlt} />
      )}
    </div>
  );
};

export default AuthWrap;
