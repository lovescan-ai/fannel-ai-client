import Image from "next/image";
import React from "react";
import transparentAuth from "../../../public/transparent-auth.png";

const AuthImageSection = ({
  previewImg,
  previewAlt,
}: {
  previewImg?: string;
  previewAlt?: string;
}) => {
  return (
    <div
      className={`bg-brandBlue4x w-fiftyPercent hidden md:flex flex-col pt-10 pb-12 pl-8 pr-7 items-center justify-center fixed top-0 right-0 h-screen max-h-screen`}
    >
      <div className={`relative py-10 w-full`}>
        <Image
          src={transparentAuth}
          className={``}
          alt="Preview of Dashboard"
        />
        {previewImg && (
          <div
            className={`absolute top-fiftyPercent left-fiftyPercent -translate-x-fiftyPercent -translate-y-fiftyPercent w-eightyPercent`}
          >
            <Image
              src={previewImg}
              className={``}
              alt={`${previewAlt} || 'Preview of Dashboard'`}
            />
          </div>
        )}
      </div>
      {/* <div className={`text-white pr-16`}>
            <h1 className={`text-3xl mulish--regular`}>All your chat in one place</h1>
            <h2 className={`text-xl pt-4`}>OnlyFans has never got easier to manage, in a single dashboard you can manage over 2000+ conversations your style</h2>
        </div>
        <div className={`self-end h-full overflow-hidden`}>
        <Image src={preview} className={``} alt='Preview of Dashboard' />
        </div> */}
    </div>
  );
};

export default AuthImageSection;
