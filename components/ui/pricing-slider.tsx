"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface PricingTier {
  messages: number;
  price: number;
}

const PricingSlider: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<PricingTier>({
    messages: 10000,
    price: 19,
  });
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const messages = Number(event.target.value);
    const price = calculatePrice(messages);
    setSelectedTier({ messages, price });
  };

  const calculatePrice = (messages: number): number => {
    if (messages <= 10000) return 19;
    if (messages <= 25000) return 39;
    if (messages <= 50000) return 69;
    if (messages <= 75000) return 99;
    return 129;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
  };

  const sliderMarks: number[] = [
    2500, 5000, 10000, 25000, 50000, 75000, 100000,
  ];

  const count = useMotionValue(10000);
  const roundedCount = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = animate(count, selectedTier.messages, { duration: 0.5 });
    return animation.stop;
  }, [selectedTier.messages]);

  useEffect(() => {
    const updateSliderBackground = () => {
      if (sliderRef.current) {
        const percentage =
          ((selectedTier.messages - 2500) / (100000 - 2500)) * 100;
        sliderRef.current.style.setProperty(
          "--slider-percentage",
          `${percentage}%`
        );
      }
    };

    updateSliderBackground();
  }, [selectedTier.messages]);

  return (
    <div className="py-10 w-full lg:px-0 px-2">
      <div className="w-full max-w-2xl text-center mx-auto">
        <h3 className="text-[55px] font-bold font-mulish text-brandBlue4x">
          Increase your limits
        </h3>
        <p className="text-xl leading-relaxed font-mulish text-brandDarkPurple1x">
          Every creator and agency has unique needs. Customize your AI
          generation limits so you only pay for what you need, when you need it.
        </p>
      </div>
      <div className="w-full h-72 mt-10 relative z-50 justify-center items-center grid grid-cols-2 gap-3 max-auto bg-brandBlue4x text-white border-2 border-brandBlue4x rounded-xl">
        <div className="flex-1 w-full md:w-auto mb-6 md:mb-0 px-6">
          <h2 className="text-xl mb-4 font-medium">
            How many messages do you want to add?
          </h2>
          <div className="relative" ref={sliderRef}>
            <input
              type="range"
              min={2500}
              max={100000}
              step={100}
              value={selectedTier.messages}
              onChange={handleSliderChange}
              className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, #97F2D1 var(--slider-percentage), white var(--slider-percentage))",
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #97f2d1;
                border: 2px solid white;
                cursor: pointer;
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #97f2d1;
                border: 2px solid white;
                cursor: pointer;
              }
            `}</style>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            {sliderMarks.map((mark) => (
              <span key={mark}>{formatNumber(mark)}</span>
            ))}
          </div>
        </div>
        <div className="md:ml-8 text-center md:text-right px-6 h-full bg-white flex items-center flex-col justify-center rounded-tl-none rounded-bl-none rounded-br-xl rounded-tr-xl">
          <div className="w-full px-4 flex items-center justify-between">
            <div className="text-2xl font-mulish text-black">
              <motion.span>
                {formatNumber(Math.round(roundedCount.get()))}
              </motion.span>{" "}
              AI Messages
            </div>
            <div className="text-brandBlue4x font-bold">
              <span className="text-7xl font-mulish">
                ${selectedTier.price}
              </span>
              <span className="text-xl">/Month</span>
            </div>
          </div>
          <button className="mt-4 w-full rounded-full text-white bg-brandBlue4x hover:bg-brandBlue4x/90 font-bold py-2 px-4 h-14 hover:bg-blue-100 transition duration-300">
            Get started
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSlider;
