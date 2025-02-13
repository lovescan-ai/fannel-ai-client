"use client";

import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { redHat, travels, trap, paytone, mulish } from "@/fonts/fonts";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/core/styles/Modal.css";
import logo from "@/public/logo-in-circle.png";

import { ColorSchemeScript } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "@/app/dashboard/widgets/Nav";
import TopProgressBar from "@/components/ui/top-bar";
import Providers from "@/providers/main";
import { Toaster } from "sonner";

const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);
  const [navState, setNavState] = useState(false);
  const pathname = usePathname();

  const toggleMobileNav = () => {
    setNavState((prevState) => !prevState);
  };

  const closeMobileNav = () => {
    setNavState(false);
  };

  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    const body = document.querySelector("body");
    const scrollPosition = window.pageYOffset;
    if (navState && !isAuthPage) {
      body && (body.style.overflow = "hidden");
      body && (body.style.height = "100vh");
    } else {
      body && (body.style.overflow = "");
      body && (body.style.height = "");
    }
    window.scrollTo(0, scrollPosition);
  }, [navState, isAuthPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLayoutLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <html
        lang="en"
        className={
          isAuthPage
            ? ""
            : `${pathname === "/dashboard" ? "h-full md:h-auto" : ""}`
        }
      >
        <head>
          <ColorSchemeScript />
        </head>
        <body
          className={`${travels.variable} ${trap.variable} ${redHat.variable} ${
            mulish.variable
          } ${paytone.variable} font-normal mulish-regular ${
            isAuthPage
              ? "min-h-screen flex flex-col"
              : `flex w-full relative ${
                  pathname === "/dashboard"
                    ? "md:h-screen h-full overflow-hidden"
                    : "md:h-screen md:overflow-y-hidden"
                }`
          } bg-white`}
        >
          <Providers>
            {!isAuthPage && !isLayoutLoading && (
              <Nav
                navState={navState}
                setNavState={setNavState}
                closeMobileNav={closeMobileNav}
              />
            )}
            <div
              className={
                isAuthPage
                  ? "flex-grow flex flex-col"
                  : "w-full h-full flex flex-col md:block"
              }
            >
              {!isAuthPage && (
                <div className="w-full bg-brandBlue2x px-2 py-3 flex md:hidden flex-row gap-10 justify-between sticky top-0 left-0 z-20">
                  <Link href={"/dashboard"} className="flex px-4">
                    <Image
                      src={logo}
                      alt="Flannel logo"
                      className="w-8 aspect-square"
                    />
                  </Link>

                  <div className="justify-self-end xl:hidden">
                    <button
                      id="closeMobileNav"
                      aria-label="toggle menu"
                      onClick={toggleMobileNav}
                      className="h-full z-70 transition-all duration-300 space-y-1 xl:hidden group"
                    >
                      <div
                        className={`bg-brandGray12x w-6 h-0.5 rounded-ten group-hover:bg-brandGray12x ${
                          navState
                            ? "rotate-45 origin-center translate-y-0.75"
                            : ""
                        } transition-all duration-300 ease-in-out`}
                      ></div>
                      <div
                        className={`bg-brandGray12x w-6 h-0.5 rounded-ten ${
                          navState
                            ? "hidden transition-all duration-100 ease-in-out"
                            : "transition-all duration-300 ease-in-out group-hover:bg-brandGray12x"
                        }`}
                      ></div>
                      <div
                        className={`bg-brandGray12x w-6 h-0.5 rounded-ten group-hover:bg-brandGray12x ${
                          navState
                            ? "-rotate-45 origin-center -translate-y-0.75"
                            : ""
                        } transition-all duration-300 ease-in-out`}
                      ></div>
                      <span className="sr-only">Menu</span>
                    </button>
                  </div>
                </div>
              )}
              <TopProgressBar />
              {children}
              <Analytics />
              <SpeedInsights />
            </div>
          </Providers>
        </body>
      </html>
    </>
  );
};

export default IndexLayout;
