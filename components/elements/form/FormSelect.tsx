import { ChevronDownIcon } from "lucide-react";
import React from "react";

interface FormSelectProps {
  fieldsetId?: string;
  label?: string;
  labelFont?: string;
  labelColor?: string;
  id?: string;
  value?: string;
  handleBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  borderRadius?: string;
  border?: string;
  moreInputClasses?: string;
  fieldError?: boolean;
  required?: boolean;
  name?: string;
  colSpan?: string;
  handleChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  padding?: string;
  labelClassName?: string;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  fieldsetId,
  label,
  labelFont,
  labelColor,
  id,
  value,
  handleBlur,
  borderRadius,
  border,
  moreInputClasses,
  fieldError,
  required,
  name,
  colSpan,
  handleChange,
  children,
  padding,
  labelClassName,
  className,
  ...rest
}) => {
  return (
    <fieldset
      id={fieldsetId}
      className={`gap-2 flex flex-col ${
        colSpan ? colSpan : "col-span-1"
      } text-black`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`${labelFont ? labelFont : "mulish--regular"} ${
            labelColor ? labelColor : ""
          } ${labelClassName}`}
        >
          {label || "Name"}
        </label>
      )}

      <div className="relative">
        <select
          autoFocus={false}
          required={required || true}
          onChange={handleChange}
          onBlur={handleBlur}
          name={name}
          {...rest}
          id={id}
          value={value}
          className={`${
            padding ? padding : "px-4 py-2.5 h-11"
          } w-full text-sm ${moreInputClasses || ""}  ${
            value ? "text-black" : "text-brandGray10x"
          } ${borderRadius ? borderRadius : "rounded-2xl"} ${
            border ? border : "border-1 focus:border-1"
          } ${
            fieldError
              ? "border-brandRed1x focus:border-brandRed1x"
              : "border-brandGray10x focus:border-black"
          } focus:outline-none outline-none ring-none focus:border-1 bg-white appearance-none ${className}`}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </fieldset>
  );
};

export default FormSelect;
