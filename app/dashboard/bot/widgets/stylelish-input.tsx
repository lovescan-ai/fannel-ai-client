import { isValid, format } from "date-fns";
import React, { useCallback } from "react";
import { Clock } from "lucide-react";

interface StylishTimeInputProps {
  value: string;
  onChange: (name: string, value: string | null) => void;
  name: string;
}

const StylishTimeInput = React.memo(
  ({ value, onChange, name }: StylishTimeInputProps) => {
    const handleTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value;
        if (timeValue) {
          const currentDate = new Date();
          const [hours, minutes] = timeValue.split(":");
          currentDate.setHours(
            parseInt(hours, 10),
            parseInt(minutes, 10),
            0,
            0
          );

          if (isValid(currentDate)) {
            // Pass only "HH:mm" format
            onChange(name, format(currentDate, "HH:mm"));
          } else {
            onChange(name, null);
          }
        } else {
          onChange(name, null);
        }
      },
      [onChange, name]
    );

    return (
      <div className="relative">
        <input
          type="time"
          name={name}
          id={name}
          value={value}
          onChange={handleTimeChange}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
        />
        <div className="border bg-brandBlue4x/10 rounded-lg py-1 px-4 flex items-center space-x-2 pointer-events-none">
          <Clock size={18} className="text-brandBlue4x" />
          <span className="text-brandBlue4x font-medium">
            {value || "Select time"}
          </span>
        </div>
      </div>
    );
  }
);

export default StylishTimeInput;
