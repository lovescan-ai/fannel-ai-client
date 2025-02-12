import Image from "next/image";
import React from "react";
import transparentAuth from "../../../public/transparent-auth.png";

const AltAuthImageSection = ({
  previewImg,
  previewMini,
  previewMiniAlt,
  previewAlt,
}: {
  previewImg: string;
  previewMini: string;
  previewMiniAlt: string;
  previewAlt: string;
}) => {
  return (
    <div
      className={`bg-brandBlue4x w-fiftyPercent hidden md:flex flex-col pt-10 z-20 pb-12 items-center justify-center fixed top-0 right-0 h-screen max-h-screen`}
    >
      <div className={`relative py-10 w-full`}>
        <Image
          src={transparentAuth}
          className={``}
          alt="Preview of Dashboard"
        />
        <div
          className={`absolute hiw--gradient top-fiftyPercent left-0 -translate-x-20 z-10 rounded-r-30 py-4 pr-4 -translate-y-fiftyPercent w-ninetyPercent`}
        >
          <Image
            src={previewImg}
            className={`rounded-r-30 w-full -z-10`}
            alt={`${previewAlt} || 'Preview of Dashboard'`}
          />
        </div>
      </div>
    </div>
  );
};

export default AltAuthImageSection;
