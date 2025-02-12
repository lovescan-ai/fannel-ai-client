import Link from "next/link";
import React from "react";

const AltAuthPage = ({
  id,
  link,
  text,
  linkText,
  textSize,
  textPos,
}: {
  id?: string;
  link: string;
  text?: string;
  linkText?: string;
  textSize?: string;
  textPos?: string;
}) => {
  return (
    <div
      id={id}
      className={`${textSize ? textSize : "text-sm"} font-medium ${
        textPos ? textPos : "text-center"
      } pt-8`}
    >
      <p>
        {text || "Place action text here"}{" "}
        <Link className={`text-brandBlue2x mulish--bold`} href={link}>
          {linkText || "Action"}
        </Link>
      </p>
    </div>
  );
};

export default AltAuthPage;
