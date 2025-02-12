import React from "react";
// import {} from "./"
import { Inter, Red_Hat_Display, Paytone_One, Mulish } from "next/font/google";
import localFont from "next/font/local";

const travels = localFont({
  src: [
    {
      path: "../assets/fonts/tt-travels/TT-Travels-Next-Trial-Black-Italic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-mulish",
});

const trap = localFont({
  src: [
    {
      path: "../assets/fonts/trap/Trap-Black.otf",
      weight: "900",
    },
    {
      path: "../assets/fonts/trap/Trap-ExtraBold.otf",
      weight: "800",
    },
    {
      path: "../assets/fonts/trap/Trap-Bold.otf",
      weight: "700",
    },
    {
      path: "../assets/fonts/trap/Trap-SemiBold.otf",
      weight: "600",
    },
    {
      path: "../assets/fonts/trap/Trap-Medium.otf",
      weight: "500",
    },
    {
      path: "../assets/fonts/trap/Trap-Regular.otf",
      weight: "400",
    },
    {
      path: "../assets/fonts/trap/Trap-Light.otf",
      weight: "300",
    },
  ],
  variable: "--font-trap",
});

const inter = Inter({ subsets: ["latin"], display: "swap" });
const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-redHat",
  display: "swap",
});
const paytone = Paytone_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-paytone",
  display: "swap",
});
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-mulish",
  display: "swap",
});

const fonts = () => {
  return <div>fonts</div>;
};

export { inter, redHat, travels, trap, paytone, mulish };

export default fonts;
