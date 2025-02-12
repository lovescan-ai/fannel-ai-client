import React from "react";

const FormSwitch: React.FC<{
  fieldsetId: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  switchName: string;
  switchId: string;
  switchChecked?: boolean;
  selfEnd?: boolean;
  [key: string]: any;
}> = ({
  fieldsetId,
  handleChange,
  switchName,
  switchId,
  switchChecked,
  selfEnd,
  ...rest
}) => {
  return (
    <fieldset
      id={fieldsetId}
      className={`relative inline-block w-11 min-w-11 mr-2 align-middle select-none transition duration-200 ease-in toggle-wrap ${
        selfEnd ? "justify-self-end self-end" : ""
      }`}
    >
      <input
        onChange={handleChange}
        {...rest}
        checked={!!switchChecked}
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

export default FormSwitch;
