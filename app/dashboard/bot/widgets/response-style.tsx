import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ResponseStyle = ({
  setSliderValue,
  sliderValue: propSliderValue,
  handleSaveSettings,
}: {
  setSliderValue: (value: number) => void;
  sliderValue: number;
  handleSaveSettings: () => void;
}) => {
  const [isCustomized, setIsCustomized] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(propSliderValue);

  useEffect(() => {
    setLocalSliderValue(propSliderValue);
  }, [propSliderValue]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLocalSliderValue(value);
    setSliderValue(value);
  };

  const getStyleRepresentation = (value: number) => {
    const styles = ["Formal", "Professional", "Neutral", "Casual", "Flirty"];
    const index = Math.min(
      Math.floor(value * (styles.length - 1)),
      styles.length - 1
    );
    return styles[index];
  };

  const getStyleEmoji = (style: string) => {
    const emojis: { [key: string]: string } = {
      Formal: "🎩",
      Professional: "👔",
      Neutral: "😐",
      Casual: "👋",
      Flirty: "😉",
    };
    return emojis[style] || "";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center">
          Response Style
          <svg
            className="ml-2 text-brandBlue4x w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 16v-4M12 8h.01"
            />
          </svg>
        </h2>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isCustomized}
              onChange={() => setIsCustomized(!isCustomized)}
            />
            <div
              className={`block w-10 h-6 rounded-full ${
                isCustomized ? "bg-brandBtext-brandBlue4x" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                isCustomized ? "transform translate-x-full" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>

      {isCustomized && (
        <>
          <p className="text-lg mb-4">Customize your response style</p>

          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localSliderValue}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                    localSliderValue * 100
                  }%, #E5E7EB ${localSliderValue * 100}%, #E5E7EB 100%)`,
                }}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #3b82f6;
                  cursor: pointer;
                }
              `}</style>
            </div>
            <div className="flex justify-center items-center mb-4 h-12">
              <AnimatePresence mode="wait">
                <motion.span
                  key={getStyleRepresentation(localSliderValue)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-semibold"
                >
                  {getStyleEmoji(getStyleRepresentation(localSliderValue))}{" "}
                  {getStyleRepresentation(localSliderValue)}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex justify-between">
              <div className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center text-sm">
                🎩 Formal
              </div>
              <div className="bg-white border border-gray-200 rounded-full px-3 py-1 flex items-center text-sm">
                🌶️ Flirty
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-6 py-1.5 border border-brandBlue4x rounded-lg text-brandBlue4x hover:bg-gray-50">
              Cancel
            </button>
            <button
              className="px-6 py-1.5 bg-brandBlue4x text-white rounded-lg hover:bg-brandBlue4x"
              onClick={handleSaveSettings}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResponseStyle;
