import "../globals.css";
import "../fonts.css";
import React, { ReactNode } from "react";
import { redHat, travels, trap, paytone, mulish } from "../../fonts/fonts";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`${travels.variable} ${trap.variable} ${redHat.variable} ${mulish.variable} ${paytone.variable} font-normal mulish-regular`}
    >
      {children}
    </div>
  );
};
export default RootLayout;
