import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ChatMenu from "./chat-menu";
import { ChevronLeft } from "lucide-react";

interface User {
  name: string;
  username: string;
  avatarUrl: string;
  botActive: boolean;
  status: "online" | "away" | "offline";
  lastSeen?: string;
}

const statusColors = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-gray-400",
};

interface ChatHeaderProps {
  setTranslate: (value: boolean) => void;
  user: User;
}

export default function ChatHeader({ setTranslate, user }: ChatHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const rotate = useMotionValue(0);
  const scale = useTransform(rotate, [0, 270], [1, 1.2]);

  console.log(user);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-2 py-4 rounded-lg shadow-md flex items-center justify-between"
    >
      <div className="flex items-center space-x-1">
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setTranslate(false)}
        >
          <ChevronLeft className="w-7 h-7 text-gray-600" />
        </button>

        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s Avatar`}
            width={56}
            height={56}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 ${
              statusColors[user.status]
            } rounded-full border-2 border-white`}
          ></div>
        </motion.div>

        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">@{user.username}</span>
            {user.botActive && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Bot Active
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {user.status === "online"
              ? "Active now"
              : `Last seen ${user.lastSeen}`}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <motion.div className="relative">
          <motion.button
            style={{ rotate, scale }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen((prev) => !prev);
              rotate.set(isOpen ? 0 : 270);
            }}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </motion.button>

          <ChatMenu
            isOpen={isOpen}
            data={[
              {
                id: "1",
                botActive: user.botActive,
              },
            ]}
            onBotToggle={() => {
              console.log("Bot toggled");
            }}
            onDelete={() => {
              console.log("Delete clicked");
            }}
            onBlock={() => {
              console.log("Block clicked");
            }}
            onReport={() => {
              console.log("Report clicked");
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
