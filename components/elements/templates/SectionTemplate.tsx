import React from "react";

const SectionTemplate: React.FC<{
  id?: string;
  bgColor?: string;
  padding?: string;
  children: React.ReactNode;
}> = ({ id, bgColor, padding, children }) => {
  return (
    <div
      id={id}
      className={`${padding ? padding : "px-4 md:px-8 lg:px-24"} ${
        bgColor ? bgColor : ""
      } w-full`}
    >
      {children}
    </div>
  );
};

export default SectionTemplate;
