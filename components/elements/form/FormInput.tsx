import React from "react";

interface FormInputProps {
  fieldsetId?: string;
  display?: string;
  colSpan?: string;
  rowSpan?: string;
  required?: boolean;
  value?: string;
  borderRadius?: string;
  maxLength?: number;
  fieldError?: boolean;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  labelColor?: string;
  moreInputClasses?: string;
  labelFont?: string;
  label?: string;
  bgColor?: string;
  name?: string;
  border?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  padding?: string;
  [key: string]: any;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  fieldsetId,
  display,
  colSpan,
  rowSpan,
  required,
  value,
  borderRadius,
  maxLength,
  fieldError,
  handleChange,
  handleBlur,
  labelColor,
  moreInputClasses,
  labelFont,
  label,
  bgColor,
  name,
  border,
  type,
  placeholder,
  id,
  padding,
  className,
  labelClassName,
  disabled,
  ...rest
}) => {
  return (
    <fieldset
      id={fieldsetId}
      className={`gap-2 flex flex-col ${
        colSpan ? colSpan : "col-span-1"
      } w-full`}
    >
      {label && (
        <label
          htmlFor={id || "fullName"}
          className={`${labelClassName} ${
            labelFont ? labelFont : "mulish--regular"
          } ${labelColor ? labelColor : ""}`}
        >
          {label || "Name"}
        </label>
      )}
      <input
        type={type || "text"}
        {...rest}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        onBlur={handleBlur}
        required={required || true}
        id={id || "fullName"}
        name={name || "fullName"}
        placeholder={placeholder || "Fullname"}
        className={`${className} ${padding ? padding : "px-4 py-2.5"} text-sm ${
          moreInputClasses || ""
        } ${
          borderRadius ? borderRadius : "rounded-2xl"
        } text-black placeholder:text-brandGray10x w-full ${
          border ? border : "border-1 focus:border-1"
        } ${
          fieldError
            ? "border-brandRed1x focus:border-brandRed1x"
            : "border-brandGray11x focus:border-black"
        } focus:outline-none ${bgColor ? bgColor : "bg-white"}`}
      />
    </fieldset>
  );
};

export default FormInput;
