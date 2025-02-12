import React from "react";

const NoMessageIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-brandBlue4x"
  >
    <path
      d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7V12M11.9941 15H12.0031"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NoMessage = () => {
  return (
    <div className="bg-brandLightBlue4x/80 w-full h-full p-8 rounded-lg flex flex-col justify-center items-center space-y-4">
      <div className="animate-float">
        <NoMessageIcon />
      </div>
      <h2 className="text-2xl font-bold text-brandBlue4x text-center animate-fadeIn">
        No message selected yet
      </h2>
      <p className="text-base text-brandBlue4x/80 text-center animate-fadeIn animation-delay-300">
        Click on a chat to see the conversation
      </p>
    </div>
  );
};

export default NoMessage;
