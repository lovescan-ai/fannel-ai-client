import { useState } from "react";

interface ToggleSwitchProps {
  initialState?: boolean;
  className?: string;
  onToggle?: (isOn: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialState = false,
  onToggle,
  className,
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div
      className={`w-[60px] h-7 flex items-center border border-brandBlue4x rounded-full p-1 cursor-pointer ${
        isOn ? "bg-brandBlue4x" : "bg-white"
      }`}
      onClick={handleToggle}
    >
      <div
        className={`${
          isOn ? "bg-white" : "border-1 border-brandBlue4x"
        } w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-[30px]" : ""
        }`}
      ></div>
    </div>
  );
};

export default ToggleSwitch;
