"use client";

import React from "react";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

interface MsgPreviewProps {
  id: string;
  isSelected: boolean;
  dp: string;
  name: string;
  message: string;
  lastSeen: string | number;
  isActive: boolean;
  isBotActive: boolean;
  platformName: string;
  platformIcon: React.ReactNode;
  handleClick: () => void;
}

const MsgPreview = ({
  id,
  isSelected,
  dp,
  name,
  message,
  lastSeen,
  isActive = true,
  isBotActive,
  platformName,
  platformIcon,
  handleClick,
}: MsgPreviewProps) => {
  return (
    <button
      id={id}
      onClick={handleClick}
      className={`w-full px-4 py-3 transition-all duration-200 ${
        isSelected ? "bg-brandBlue4x/10" : "hover:bg-gray-50"
      } border-b border-gray-200 focus:outline-none`}
    >
      <div className="flex items-start">
        <div className="relative mr-3 w-10 h-10">
          <img
            src={dp}
            alt={name}
            width={50}
            height={50}
            className="rounded-full w-10 h-10 object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
        </div>

        <div className="flex-grow min-w-0 text-left">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate mr-2">
              {name}
            </h3>
            <span className="text-xs text-brandBlue4x whitespace-nowrap flex items-center">
              {isActive ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Online
                </>
              ) : (
                <ReactTimeAgo
                  date={
                    typeof lastSeen === "string"
                      ? Date.parse(lastSeen) || Date.now()
                      : lastSeen
                  }
                  locale="en-US"
                />
              )}
            </span>
          </div>
          <p className="text-sm text-gray-600 text-left truncate">{message}</p>
        </div>

        <div className="flex flex-col items-end ml-2 space-y-1">
          {isBotActive && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brandBlue4x"
            >
              <path
                d="M19.9924 10.608C19.9924 10.176 19.9924 9.52801 19.9924 8.88001C19.9924 7.51201 18.8884 6.40801 17.5204 6.40801C17.1124 6.40801 16.8004 6.09601 16.8004 5.68801V5.52001C16.8004 5.11201 16.4884 4.80001 16.0804 4.80001H15.9124C15.5044 4.80001 15.1924 5.11201 15.1924 5.52001V5.68801C15.1924 6.09601 14.8804 6.40801 14.4724 6.40801H13.3204C12.9124 6.40801 12.6004 6.09601 12.6004 5.68801V4.99201C12.6004 4.80001 12.6724 4.60801 12.8164 4.48801C13.2244 4.12801 13.3684 3.48001 12.9604 2.83201C12.9124 2.76001 12.8404 2.68801 12.7684 2.64001C11.8084 2.01601 10.8004 2.68801 10.8004 3.60001C10.8004 3.93601 10.9444 4.24801 11.1844 4.46401C11.3284 4.58401 11.4004 4.77601 11.4004 4.96801V5.66401C11.4004 6.07201 11.0884 6.38401 10.6804 6.38401H9.52839C9.12039 6.38401 8.80839 6.07201 8.80839 5.66401V5.52001C8.80839 5.11201 8.49639 4.80001 8.08839 4.80001H7.92039C7.51239 4.80001 7.20039 5.11201 7.20039 5.52001V5.68801C7.20039 6.09601 6.88839 6.40801 6.48039 6.40801C5.11239 6.40801 4.00839 7.51201 4.00839 8.88001V10.584C4.00839 10.896 3.81639 11.16 3.50439 11.256C2.85639 11.472 2.40039 12.072 2.40039 12.768V15.96C2.40039 16.68 2.85639 17.28 3.50439 17.472C3.79239 17.568 4.00839 17.832 4.00839 18.144V19.152C4.00839 20.472 5.08839 21.552 6.40839 21.552H17.6164C18.9364 21.552 20.0164 20.472 20.0164 19.152V18.168C20.0164 17.856 20.2084 17.592 20.5204 17.496C21.1684 17.28 21.6244 16.68 21.6244 15.984V12.792C21.6244 12.072 21.1684 11.472 20.5204 11.28C20.2084 11.184 19.9924 10.92 19.9924 10.608ZM7.20039 12.792C7.08039 11.88 7.84839 11.112 8.76039 11.208C9.38439 11.28 9.88839 11.784 9.96039 12.408C10.0804 13.32 9.31239 14.088 8.40039 13.992C7.80039 13.92 7.29639 13.416 7.20039 12.792ZM14.4004 18.408H9.62439C9.24039 18.408 8.90439 18.144 8.80839 17.784C8.71239 17.28 9.09639 16.824 9.60039 16.824H14.3524C14.7844 16.824 15.1684 17.136 15.1924 17.592C15.2164 18.024 14.8564 18.408 14.4004 18.408ZM15.7204 13.968C14.6884 14.184 13.8004 13.296 14.0404 12.288C14.1604 11.784 14.5684 11.352 15.0964 11.256C16.1284 11.04 17.0164 11.928 16.7764 12.936C16.6564 13.44 16.2244 13.848 15.7204 13.968Z"
                fill="currentColor"
              />
            </svg>
          )}
          {platformIcon && <div className="text-xs">{platformIcon}</div>}
        </div>
      </div>
    </button>
  );
};

export default MsgPreview;
