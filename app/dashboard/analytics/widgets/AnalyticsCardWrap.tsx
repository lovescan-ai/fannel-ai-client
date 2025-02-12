import React from "react";

const AnalyticsCardWrap: React.FC<{
  id?: string;
  padding?: string;
  height?: string;
  children: React.ReactNode;
}> = ({ id, padding, height, children }) => {
  return (
    <div
      id={id}
      className={`${padding ? padding : "pt-7 pb-14 px-8"} ${
        height || ""
      } rounded-20 text-left flex flex-col gap-6 mulish--regular bg-white shadow--bot--card`}
    >
      {children}
    </div>
  );
};

export default AnalyticsCardWrap;
