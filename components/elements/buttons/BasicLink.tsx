import Link from "next/link";
import React from "react";

const BasicLink = ({
  id,
  text,
  link,
  bgColor,
  fontType,
  fontSize,
  padding,
  flex,
  textColor,
  borderRadius,
  width,
}: {
  id?: string;
  text?: string;
  link: string;
  bgColor?: string;
  fontType?: string;
  fontSize?: string;
  padding?: string;
  flex?: string;
  textColor?: string;
  borderRadius?: string;
  width?: string;
}) => {
  return (
    <Link
      id={id}
      href={`${link}`}
      className={`${bgColor ? bgColor : "bg-black"} ${flex} ${
        width ? width : ""
      } ${textColor ? textColor : "text-white"} ${
        borderRadius ? borderRadius : "rounded-50px"
      } ${padding ? padding : "px-3.5 py-1.5"} ${fontType ? fontType : ""} ${
        fontSize ? fontSize : ""
      }`}
    >
      {text || "Basic Link"}
    </Link>
  );
};

export default BasicLink;
