"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ToggleSwitch from "./switch2";
import { UserIcon, LightningIcon } from "@/components/icons";
import Button from "./button";
import { Loader } from "lucide-react";
// PricingPlans toggle section (update this part in your PricingPlans component)
const PricingToggle = ({
  isAnnual,
  onToggle,
}: {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
}) => {
  return (
    <div className="text-center mb-2">
      <div className="inline-flex items-center justify-center w-full max-w-xs my-6">
        <div className="flex items-center gap-4">
          <p
            className={`text-brandBlue4x mulish--semibold tracking-tighter ${
              !isAnnual ? "font-bold" : ""
            }`}
          >
            Monthly
          </p>

          <ToggleSwitch
            className="!h-8"
            initialState={isAnnual}
            onToggle={onToggle}
          />

          <p
            className={`text-brandBlue4x mulish--semibold tracking-tighter ${
              isAnnual ? "font-bold" : ""
            }`}
          >
            Annually
          </p>

          <div className="w-20 h-7">
            <AnimatePresence>
              {isAnnual && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#e5e9fd] text-brandBlue4x border border-brandBlue4x rounded-lg h-7 px-2 text-xs mulish--bold"
                >
                  Save 30%
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PricingCardProps {
  type: string;
  price: string;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  isAnnual: boolean;
}
// Updated PricingCard component with animated price
const PricingCard = ({
  type,
  price,
  onClick,
  disabled,
  loading,
  isAnnual,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "w-full space-y-4 sm:space-y-6 rounded-2xl bg-white px-4 sm:px-8 py-4 sm:py-6",
        type === "agency" && "bg-brandBlue4x"
      )}
      style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start flex-col">
          {type === "creator" ? (
            <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
          ) : (
            <LightningIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          )}
        </div>
        <motion.div
          key={price} // This forces a re-render and animation when price changes
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "text-lg sm:text-xl md:text-2xl font-bold text-black",
            type === "agency" && "text-white"
          )}
        >
          {price}
          <span
            className={cn(
              "text-xs sm:text-sm md:text-base font-normal text-black",
              type === "agency" && "text-white"
            )}
          >
            {isAnnual ? "/year" : "/month"}
          </span>
        </motion.div>
      </div>

      {/* Rest of the PricingCard component remains the same */}
      <div className="flex flex-col items-start space-y-2">
        <p
          className={cn(
            "text-black text-2xl sm:text-3xl mulish--bold flex items-center gap-2 flex-wrap",
            type === "agency" && "text-white"
          )}
        >
          {type === "creator" ? "Creator" : "Agencies"}
          {type === "agency" && (
            <span className="text-xs !text-black mulish--bold block !bg-[#FCC946] rounded-lg p-1.5 text-center">
              Popular 🔥
            </span>
          )}
        </p>
        <p
          className={cn(
            "text-base sm:text-lg mulish--semibold text-[#425067]",
            type === "agency" && "text-white"
          )}
        >
          {type === "creator"
            ? "Perfect for individual models managing one account."
            : "Designed for agencies managing up to 5 creators."}
        </p>
      </div>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "!w-full !bg-[#F2F2F2] hover:!bg-brandBlue4x hover:!text-white !text-black !rounded-xl py-3 !text-base mulish--bold !h-12 flex items-center justify-center",
          type === "agency" &&
            "!bg-white !text-brandBlue4x hover:!bg-white hover:!text-brandBlue4x"
        )}
      >
        {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
        {loading ? "Processing..." : "Get Started"}
      </Button>
    </div>
  );
};

export { PricingToggle, PricingCard };
