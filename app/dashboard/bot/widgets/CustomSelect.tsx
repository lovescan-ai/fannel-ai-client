import React from "react";

interface CustomSelectProps {
  id: string;
  name: string;
  width?: string;
  selfEnd?: boolean;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  textPos?: string;
  moreToSelect?: string;
  moreToLabel?: string;
  children: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  width,
  selfEnd,
  handleChange,
  textPos,
  moreToSelect,
  moreToLabel,
  children,
}) => {
  return (
    <label
      htmlFor={id}
      className={`flex flex-row gap-2 items-center ${moreToLabel} cursor-pointer ${
        selfEnd ? "justify-self-end self-end" : ""
      } ${width ? width : "w-fit"} mulish--regular relative`}
    >
      <select
        id={id}
        onChange={handleChange}
        name={name}
        className={`py-0 pl-0 ${width} ${moreToSelect} pr-10 text-sm ${
          textPos ? textPos : "text-right"
        } custom--select bg-transparent focus:outline-none outline-none border-none focus:border-none`}
      >
        {children}
      </select>

      <div
        className={`rounded-5 p-0.5 bg-brandGray34x/10 absolute top-fiftyPercent -translate-y-fiftyPercent right-0 pointer-events-none`}
      >
        <svg
          className={``}
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M12.5 5.83L15.67 9L17.08 7.59L12.5 3L7.91003 7.59L9.33003 9L12.5 5.83ZM12.5 18.17L9.33003 15L7.92003 16.41L12.5 21L17.09 16.41L15.67 15L12.5 18.17Z"
            fill="black"
          />
        </svg>
      </div>
    </label>
  );
};

export default CustomSelect;
