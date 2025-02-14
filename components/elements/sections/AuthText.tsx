import React from "react";
import AuthButton from "../buttons/AuthButton";

interface AuthTextProps {
  id?: string;
  header?: string;
  text?: string;
  buttonText?: string;
  handleClick?: () => void;
  noBorder?: boolean;
  btnBorder?: string;
  btnBorderRadius?: string;
  noButton?: boolean;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  buttonType?: "button" | "submit" | "reset";
  disabled?: boolean;
  btnBgColor?: string;
  btnTextColor?: string;
}

const AuthText: React.FC<AuthTextProps> = ({
  id,
  header,
  text,
  buttonText,
  handleClick,
  noBorder,
  btnBorder,
  btnBorderRadius,
  noButton,
  hasIcon,
  icon,
  buttonType,
  disabled,
  btnBgColor,
  btnTextColor,
}) => {
  return (
    <div className={`w-full`}>
      <h2 className={`text-3xl mulish--bold text-brandDarkPurple1x pb-4`}>
        {header || "Sign Up"}
      </h2>
      <p className={`text-lg mulish--regular text-black`}>
        {text || "Manage all your conversations in one place."}
      </p>
      <div
        className={`w-full ${noButton ? "" : "pt-12"} pb-7 flex items-center`}
      >
        {noButton || (
          <AuthButton
            type={buttonType}
            disabled={disabled}
            border={btnBorder}
            borderRadius={btnBorderRadius}
            hasIcon={hasIcon}
            icon={icon}
            bgColor={btnBgColor}
            textColor={btnTextColor}
            handleClick={handleClick}
            btnText={buttonText}
          />
        )}
      </div>
      {noBorder || (
        <div className={`flex flex-row items-center gap-2 text-xs text-black`}>
          <div className={`w-full h-1px bg-black`}></div>
          <p className={`whitespace-nowrap`}>Or with email</p>
          <div className={`w-full h-1px bg-black`}></div>
        </div>
      )}
    </div>
  );
};

export default AuthText;
