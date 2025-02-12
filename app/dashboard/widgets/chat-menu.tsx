import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FormSwitch from "@/components/elements/form/FormSwitch";

interface ChatMenuProps {
  isOpen: boolean;
  data: Array<{
    id: string;
    botActive: boolean;
  }>;
  onBotToggle: (id: string) => void;
  onDelete: () => void;
  onBlock: () => void;
  onReport: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({
  isOpen,
  data,
  onBotToggle,
  onDelete,
  onBlock,
  onReport,
}) => {
  const menuItems = [
    {
      label: data[0]?.botActive ? "Deactivate Bot" : "Activate Bot",
      action: () => onBotToggle(data[0]?.id),
      icon: (
        <FormSwitch
          fieldsetId={`fieldset-${data[0]?.id}`}
          handleChange={() => onBotToggle(data[0]?.id)}
          switchId={`switch-${data[0]?.id}`}
          selfEnd
          switchChecked={data[0]?.botActive}
          switchName="activateBot"
        />
      ),
      customClass: "text-gray-700",
    },
    {
      label: "Delete",
      action: onDelete,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      customClass: "text-red-500 hover:bg-red-50",
    },
    {
      label: "Block",
      action: onBlock,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604M18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604M18.364 5.63604L5.63604 18.364"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      customClass: "text-orange-500 hover:bg-orange-50",
    },
    {
      label: "Report",
      action: onReport,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      customClass: "text-yellow-500 hover:bg-yellow-50",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="messageMenu"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 overflow-hidden"
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`flex justify-between w-full items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors duration-200 ${item.customClass}`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </span>
                {index !== menuItems.length - 1 && (
                  <motion.div
                    className="h-px bg-gray-200 w-full absolute bottom-0 left-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatMenu;
