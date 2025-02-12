import React from "react";

interface BasicButtonProps {
  id?: string;
  text?: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  bgColor?: string;
  fontType?: string;
  fontSize?: string;
  disabled?: boolean;
  disabledStyle?: string;
  padding?: string;
  textColor?: string;
  borderRadius?: string;
  width?: string;
  className?: string;
}

const BasicButton = ({
  id,
  text,
  handleClick,
  bgColor,
  fontType,
  fontSize,
  disabled,
  disabledStyle,
  padding,
  textColor,
  borderRadius,
  width,
  className,
}: BasicButtonProps) => {
  return (
    <button
      id={id}
      onClick={handleClick}
      disabled={disabled}
      className={`${bgColor ? bgColor : "bg-black"} ${
        disabled
          ? "disabled:bg-brandGray10x disabled:text-white cursor-progress"
          : disabledStyle
      } ${width ? width : ""} ${textColor ? textColor : "text-white"} ${
        borderRadius ? borderRadius : "rounded-50px"
      } ${padding ? padding : "px-3.5 py-1.5"} ${fontType ? fontType : ""} ${
        fontSize ? fontSize : ""
      } ${className}`}
    >
      {text || "Basic Button"}
    </button>
  );
};

export default BasicButton;
