import React, { useState, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import DashNavData from "@/data/DashNavData";
import useComponentVisible from "@/utils/useHideOnClickOutside";
import logo from "../../../public/logo/logo.png";
import logo2 from "../../../public/logo/Flannel-Logo.png";
import useAuth from "@/lib/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface NavProps {
  navState: boolean;
  setNavState: React.Dispatch<React.SetStateAction<boolean>>;
  closeMobileNav: () => void;
}

const Nav: React.FC<NavProps> = ({ navState, setNavState, closeMobileNav }) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const { handleSignOut, signingOut } = useAuth();

  useComponentVisible("#dashNav", "#closeMobileNav", closeMobileNav);

  useLayoutEffect(() => {}, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setIsExpanded((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav
      id="dashNav"
      className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out ${
        navState ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static ${isExpanded ? "w-64" : "w-20"}`}
    >
      <div className="flex flex-col h-full relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 via-blue-400/10 to-blue-500/10 opacity-60" />
        <div className="absolute inset-0 backdrop-blur-sm" />

        <div className="relative z-10 flex flex-col h-full py-6">
          <div
            className={`flex items-center mb-8 ${
              isExpanded ? "justify-between px-4" : "justify-center"
            }`}
          >
            <Link
              href="/dashboard"
              className={`group flex items-center space-x-3 relative ${
                isExpanded ? "w-full" : "w-8 h-8"
              }`}
            >
              <div
                className={`relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isExpanded ? "w-full h-auto" : "w-8 h-8"
                }`}
              >
                <Image
                  src={isExpanded ? logo : logo2}
                  alt="Flannel logo"
                  width={isExpanded ? 200 : 32}
                  height={isExpanded ? 32 : 32}
                  objectFit="contain"
                  className="w-full"
                />
              </div>
            </Link>
          </div>

          <ul className="flex-grow space-y-3 overflow-y-auto px-3">
            {DashNavData.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link}
                  onClick={() => {
                    closeMobileNav();
                  }}
                  className={`flex items-center ${
                    isExpanded ? "justify-start" : "justify-center"
                  } h-12 px-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                    pathname === item.link
                      ? "text-white"
                      : "text-[#496AEB] hover:text-white"
                  }`}
                >
                  <span
                    className={`absolute inset-0 bg-[#496AEB] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      pathname === item.link ? "opacity-100" : ""
                    }`}
                  ></span>
                  <span
                    className={`text-xl flex-shrink-0 z-10 transition-all duration-300 ${
                      isExpanded ? "" : "mx-auto"
                    } group-hover:text-white ${
                      pathname === item.link
                        ? "text-white"
                        : "text-[#496AEB] group-hover:text-white"
                    }`}
                  >
                    {pathname === item.link
                      ? item.activeIcon("currentColor")
                      : item.icon("currentColor")}
                  </span>
                  {isExpanded && (
                    <span className="ml-4 font-medium whitespace-nowrap z-10 group-hover:text-white">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto px-4 space-y-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center justify-center w-full h-12 hover:text-blue-800 text-white rounded-lg transition-all duration-300 relative overflow-hidden group ${
                isExpanded ? "bg-blue-100" : "bg-transparent"
              }`}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="absolute inset-0 bg-[#496AEB] opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-300 relative z-10 ${
                  isExpanded ? "" : "rotate-180"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
              {isExpanded && (
                <span className="ml-3 whitespace-nowrap z-10 font-medium group-hover:text-blue-800 flex items-center">
                  Toggle{" "}
                  <kbd className="ml-2 px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded">
                    Ctrl + S
                  </kbd>
                </span>
              )}
            </button>
            <button
              onClick={() => handleSignOut()}
              disabled={signingOut}
              className={`flex items-center w-full h-12 text-[#496AEB] bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                isExpanded ? "px-4" : "px-2"
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {signingOut ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-3 whitespace-nowrap z-10 font-medium group-hover:text-blue-800">
                    Logging out...
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0 z-10 transition-transform duration-300 group-hover:rotate-12 text-[#496AEB]"
                  >
                    <path
                      d="M18 0H15C11.7 0 9 2.7 9 6V10.8H16.5C17.1626 10.8 17.7 11.3373 17.7 12C17.7 12.6633 17.1626 13.2 16.5 13.2H9V18C9 21.3 11.7 24 15 24H18C21.3 24 24 21.3 24 18V6C24 2.7 21.3 0 18 0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.09723 10.8001L5.44272 9.45423C5.91149 8.98604 5.91149 8.22611 5.44272 7.75734C4.97395 7.28857 4.21459 7.28857 3.74582 7.75734L0.352128 11.1511C0.295872 11.2074 0.245232 11.27 0.201024 11.3362C0.197664 11.3409 0.195408 11.345 0.192768 11.3497C0.153024 11.4106 0.118896 11.4757 0.090768 11.5442C0.088512 11.5495 0.08664 11.5542 0.084768 11.5595C0.057744 11.6262 0.036768 11.6954 0.022896 11.7681C0.021792 11.7715 0.021792 11.7762 0.021024 11.7798C0.007872 11.8512 0 11.9251 0 12.0001C0 12.0001 0 12.0001 0 12.0012C0 12.0762 0.007872 12.1501 0.021024 12.2204C0.021792 12.2251 0.021792 12.2297 0.022896 12.2332C0.036768 12.3048 0.057792 12.3751 0.084768 12.4407C0.08664 12.4465 0.088512 12.4512 0.090768 12.4571C0.118896 12.5251 0.153024 12.5907 0.192768 12.6517C0.195408 12.6564 0.197664 12.6598 0.201024 12.6645C0.24528 12.7314 0.29592 12.7935 0.352128 12.8497L3.74587 16.2434C3.98026 16.4778 4.28698 16.595 4.59413 16.595C4.90128 16.595 5.20838 16.4778 5.44277 16.2434C5.91154 15.7746 5.91154 15.0142 5.44277 14.5465L4.09723 13.2001H9V10.8001H4.09723Z"
                      fill="currentColor"
                    />
                  </svg>
                  {isExpanded && (
                    <span className="ml-3 whitespace-nowrap z-10 font-medium text-[#496AEB]">
                      Log out
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
