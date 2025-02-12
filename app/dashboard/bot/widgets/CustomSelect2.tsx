import React from "react";

const CustomSelect2 = ({
  id,
  name,
  selfEnd,
  handleChange,
  value,
  children,
}: {
  id: string;
  name: string;
  selfEnd?: boolean;
  handleChange: (name: string, value: string) => void;
  value: string;
  children: React.ReactNode;
}) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Value:", e.target.value);
    handleChange(name, e.target.value);
  };
  return (
    <label
      htmlFor={id}
      className={`flex flex-row gap-2 items-center cursor-pointer ${
        selfEnd ? "justify-self-end self-end" : ""
      } ${"w-fit"} mulish--regular relative`}
    >
      <select
        id={id}
        value={value}
        onChange={handleSelectChange}
        name={name}
        className={`py-0 pl-0 pr-10 text-sm ${"text-right"} custom--select bg-transparent focus:outline-none outline-none border-none focus:border-none`}
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

export default CustomSelect2;
