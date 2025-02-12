"use client";

import { signOut } from "next-auth/react";
import React from "react";

const Resources = () => {
  const resourceOptions = [
    {
      id: "contact",
      name: "Contact Us",
      isButton: true,
      action: null,
      link: "https://fannel.ai/contact",
    },
    {
      id: "terms",
      name: "Terms of Use",
      isButton: true,
      action: null,
      link: "https://fannel.ai/terms-of-service",
    },
    {
      id: "privacy",
      name: "Privacy Policy",
      isButton: true,
      link: "https://fannel.ai/terms-of-service",
    },
    {
      id: "logout",
      name: "Log Out",
      isButton: true,
      action: signOut,
    },
  ];

  return (
    <div className={`flex flex-col gap-5 pb-10 max-w-2xl mx-auto`}>
      {resourceOptions.map((resource, idx) => {
        return (
          <div
            key={idx}
            className={`w-full rounded-10 mulish--regular flex flex-row gap-10 justify-between settings--form--gradient text-lg bg-white py-4 px-7`}
          >
            <p>{resource.name}</p>
            <button
              type={"button"}
              onClick={resource.action ? () => resource.action() : undefined}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Resources;
