import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";

const MessageHeader = ({
  type,
}: {
  type: "greeting" | "follow_up" | "cta";
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const getMessageTitle = () => {
    switch (type) {
      case "greeting":
        return "Greeting";
      case "follow_up":
        return "Follow-Up";
      case "cta":
        return "CTA";
      default:
        return "";
    }
  };

  const getTooltipContent = () => {
    switch (type) {
      case "greeting":
        return "Automatically send greeting message to new users who comment on your Instagram posts.";
      case "follow_up":
        return "Follow-up message will be sent after the selected time if the user hasn't clicked the link from your previous CTA.";
      case "cta":
        return "CTA message will be sent at the end of the interaction to guide the user to your page.";
      default:
        return "";
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 5,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="flex items-center gap-2 relative">
      <p className="mulish--semibold text-lg mb-4">
        {getMessageTitle()} Message
      </p>
      <div
        className="relative"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <HelpCircle className="h-4 w-4 text-brandBlue4x cursor-help mb-4" />

        <AnimatePresence>
          {isTooltipVisible && (
            <motion.div
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg px-4 py-2 shadow-lg z-50"
            >
              {getTooltipContent()}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform rotate-45 w-2 h-2 bg-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageHeader;
