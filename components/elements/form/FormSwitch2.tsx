import React from "react";

const FormSwitch2 = ({
  fieldsetId,
  handleChange,
  switchName,
  value,
  switchId,
  switchChecked,
  selfEnd,
  ...rest
}: {
  fieldsetId: string;
  handleChange: (name: string, value: boolean) => void;
  switchName: string;
  value: string;
  switchId: string;
  switchChecked?: boolean;
  selfEnd?: boolean;
  [key: string]: any;
}) => {
  const handleFieldsetClick = () => {
    handleChange(switchName, !switchChecked);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(switchName, e.target.checked);
  };

  return (
    <fieldset
      id={fieldsetId}
      onClick={handleFieldsetClick}
      className={`relative inline-block w-11 min-w-11 mr-2 align-middle select-none transition duration-200 ease-in toggle-wrap ${
        selfEnd ? "justify-self-end self-end" : ""
      } cursor-pointer`}
    >
      <input
        onChange={handleSelectChange}
        checked={switchChecked}
        {...rest}
        type="checkbox"
        name={switchName}
        id={switchId}
        className="toggle-checkbox absolute checked:left-6 left-1 peer top-fiftyPercent -translate-y-fiftyPercent block w-4 min-w-4 min-h-4 h-4 rounded-full bg-white appearance-none cursor-pointer"
      />
      <label
        htmlFor={switchId}
        className="toggle-label block overflow-hidden h-6 min-h-6 rounded-full bg-brandGray34x/50 peer-checked:bg-brandBlue4x cursor-pointer"
      ></label>
    </fieldset>
  );
};

export default FormSwitch2;
