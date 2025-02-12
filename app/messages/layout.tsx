import "../globals.css";
import "../fonts.css";
import Image from "next/image";
import React, { ReactNode } from "react";
import { redHat, travels, trap, paytone, mulish } from "../../fonts/fonts";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Paytone+One&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${travels.variable} ${trap.variable} ${redHat.variable} ${mulish.variable} ${paytone.variable} font-normal bg-white h-screen`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
