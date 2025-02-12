"use client";

import Link from "next/link";
import React, { useState } from "react";

interface FormPasswordProps {
  display?: string;
  colSpan?: string;
  eyeIcon?: boolean;
  handleBlur: () => void;
  borderRadius?: string;
  radiusLeft?: string;
  labelColor?: string;
  required?: boolean;
  value: string;
  fieldError?: boolean;
  labelFont?: string;
  forgot?: boolean;
  remAndForgot?: boolean;
  labelFontSize?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  placeholder?: string;
  id?: string;
  paddingY?: string;
  paddingX?: string;
  fontSize?: string;
}

const FormPassword: React.FC<FormPasswordProps> = ({
  display,
  colSpan,
  eyeIcon,
  handleBlur,
  borderRadius,
  radiusLeft,
  labelColor,
  required,
  value,
  fieldError,
  labelFont,
  forgot,
  remAndForgot,
  labelFontSize,
  handleChange,
  label,
  name,
  placeholder,
  id,
  paddingY,
  paddingX,
  fontSize,
}) => {
  const [visible, setVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setVisible(!visible);
  };

  return (
    <fieldset
      className={`w-full gap-2.5 flex flex-col ${
        colSpan ? colSpan : "col-span-1"
      }`}
    >
      {label && (
        <label
          htmlFor={id || "password"}
          className={`${labelFont ? labelFont : "mulish--regular"} ${
            labelColor ? labelColor : ""
          }`}
        >
          {label || "Name"}
        </label>
      )}
      <div
        className={`w-full ${
          borderRadius ? borderRadius : "rounded-2xl"
        } border-1 ${
          fieldError
            ? "border-brandRed1x focus-within:border-brandRed1x"
            : "border-brandGray11x focus-within:border-black"
        } bg-white flex flex-row items-center justify-between ${
          paddingX ? paddingX : eyeIcon && "pr-4 "
        } focus-within:border-1`}
      >
        <input
          type={visible ? "text" : "password"}
          onChange={handleChange}
          onBlur={handleBlur}
          value={value}
          id={id || "password"}
          name={name || "password"}
          placeholder={placeholder || ""}
          className={`${paddingY ? paddingY : "py-2.5 "} ${
            radiusLeft ? radiusLeft : "rounded-l-2xl"
          } pl-4 focus:outline-none placeholder:text-brandGray10x autofill:bg-transparent ${
            fontSize || "text-sm"
          } w-full bg-transparent`}
          required={required || true}
        />
        {eyeIcon && (
          <button
            onClick={handlePasswordVisibility}
            type="button"
            className="relative w-fit group"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className={`group-hover:stroke-brandBlue2x`}
                opacity="0.4"
                d="M12.9833 10C12.9833 11.65 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.65 7.0166 10C7.0166 8.35 8.34993 7.01667 9.99993 7.01667C11.6499 7.01667 12.9833 8.35 12.9833 10Z"
                stroke="#999DA2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={`group-hover:stroke-brandBlue2x`}
                d="M10.0001 16.8917C12.9418 16.8917 15.6834 15.1583 17.5918 12.1583C18.3418 10.9833 18.3418 9.00833 17.5918 7.83333C15.6834 4.83333 12.9418 3.1 10.0001 3.1C7.05845 3.1 4.31678 4.83333 2.40845 7.83333C1.65845 9.00833 1.65845 10.9833 2.40845 12.1583C4.31678 15.1583 7.05845 16.8917 10.0001 16.8917Z"
                stroke="#999DA2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className={` ${
                visible || "hidden"
              } group-hover:bg-brandBlue2x absolute top-fiftyPercent left-fiftyPercent -translate-x-fiftyPercent -translate-y-fiftyPercent h-6 w-0.5 rotate-45 bg-brandGray3x`}
            ></div>
          </button>
        )}
      </div>
      {forgot && (
        <div className={`pt-2 flex w-full justify-end`}>
          <Link
            className={`text-brandBlue1x font-semibold text-sm italic text-right`}
            href={"/auth/forgot-password"}
          >
            Forgot password?
          </Link>
        </div>
      )}
      {remAndForgot && (
        <div
          className={`flex flex-row items-center gap-10 justify-between py-4`}
        >
          <label
            htmlFor="remember"
            className={`flex gap-3 items-center xs:text-xs bxs:text-xs text-sm text-black cursor-pointer`}
          >
            <input
              type="checkbox"
              name="remember"
              id="remember"
              className={`accent-brandBlue2x`}
            />
            Remember me
          </label>
        </div>
      )}
    </fieldset>
  );
};

export default FormPassword;
