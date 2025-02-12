"use client";

import React, { useState } from "react";
import AccountDetail from "./AccountDetail";
import Billing from "./Billing";
import Resources from "./Resources";
import useReadUser from "@/lib/hooks/use-read-user";
import { User } from "@prisma/client";

type SettingsOption = {
  id: string;
  text: string;
  element: React.ReactNode;
};

// Update component props type
const SettingsWrap: React.FC<{ user: User }> = ({ user }) => {
  const [tab, setTab] = useState<string>("accountDetail");
  const options: SettingsOption[] = [
    {
      id: "accountDetail",
      text: "Account Detail",
      element: <AccountDetail user={user} />,
    },
    {
      id: "billing",
      text: "Billing",
      element: <Billing />,
    },
    {
      id: "resources",
      text: "Resources",
      element: <Resources />,
    },
  ];

  return (
    <>
      <div
        className={`lg:pt-20 pt-0 px-2 lg:px-0 pb-10 lg:max-w-2xl w-full lg:mx-auto flex flex-col gap-6 mulish--regular`}
      >
        <div className={`flex items-center lg:pt-5 pt-5 pb-0`}>
          <div
            className={`overflow-x-auto w-full font-semibold  grid grid-cols-3 gap-2 mx-auto p-2 bg-brandLightBlue4x text-black rounded-10`}
          >
            {options.map((option, idx) => {
              return (
                <button
                  id={option.id}
                  key={idx}
                  onClick={() => setTab(option.id)}
                  className={`${
                    tab === option.id
                      ? "bg-brandBlue4x text-white"
                      : "bg-transparent hover:bg-white/70 text-black"
                  } whitespace-nowrap overflow-ellipsis active:translate-y-1 text-sm md:text-base hover:drop-shadow-md transition-all ease-in-out duration-300 rounded-10 px-4 md:px-6 py-2`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="">
        <div>{options.filter((option) => option.id === tab)[0]?.element}</div>
      </div>
    </>
  );
};

export default SettingsWrap;
