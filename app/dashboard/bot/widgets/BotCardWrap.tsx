import React, { ReactNode } from "react";

interface BotCardWrapProps {
  id?: string;
  children: ReactNode;
  noFlex?: boolean;
  padding?: string;
  borderRadius?: string;
  bgColor?: string;
  border?: string;
  shadow?: string;
}

const BotCardWrap: React.FC<BotCardWrapProps> = ({
  id,
  children,
  noFlex,
  padding,
  borderRadius,
  bgColor,
  border,
  shadow,
}) => {
  return (
    <div
      id={id}
      className={`
      ${bgColor || "bg-white"}
      ${shadow || "shadow--bot--card"}
      ${border || ""}
      mulish--regular
      ${padding || "px-5 py-4"}
      ${borderRadius || "rounded-10"}
      ${
        noFlex
          ? ""
          : "flex gap-10 justify-between items-center xs:flex xs:flex-col xs:items-start"
      }
    `}
    >
      {children}
    </div>
  );
};

export default BotCardWrap;
