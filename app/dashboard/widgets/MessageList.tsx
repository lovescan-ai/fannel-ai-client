"use client";

import React, { useState } from "react";
import MsgPreview from "./MsgPreview";
import { SearchIcon } from "lucide-react";
import { BotSettings, Creator } from "@prisma/client";
import Skeleton from "@/components/ui/skeleton";

interface MessageListProps {
  handleClick: (conversationID: string) => void;
  selectedMsgId: string;
  data: any[];
  selectedCreatorId: string;
  setSelectedCreatorId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  creators: Creator[];
  selectedCreator: (Creator & { botSettings: BotSettings | null }) | null;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  handleClick,
  selectedMsgId,
  data,
  selectedCreatorId,
  setSelectedCreatorId,
  creators,
  selectedCreator,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((msg) =>
    msg.otherPersonInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full md:h-screen w-full md:w-thirtyPercent md:border-r md:border-r-gray-200 md:max-w-md md:min-w-322 flex flex-col bg-white">
      <div className="sticky top-0 left-0 bg-white z-10 p-4 border-b border-gray-200">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <div className="relative w-1/2">
            <select
              className="w-full p-2 pl-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
            >
              <option value="">Select a creator</option>
              {creators?.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {creator.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300"
          />
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {isLoading
          ? // Skeleton loader
            Array.from({ length: 15 }).map((_, index) => (
              <div key={index} className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="70%" height="20px" />
                    <Skeleton width="100%" height="16px" />
                  </div>
                </div>
              </div>
            ))
          : filteredData.map((msg, idx) => (
              <MsgPreview
                key={idx}
                isSelected={selectedMsgId === msg.conversationID}
                id={msg.id}
                handleClick={() => handleClick(msg.conversationID)}
                dp={msg.otherPersonInfo.avatar}
                name={msg.otherPersonInfo.name}
                message={msg.latestMessage.text}
                lastSeen={msg.latestMessage.created_at}
                isActive={msg.isActive || false}
                isBotActive={selectedCreator?.botSettings?.isActive || false}
                platformName={msg.platformName || ""}
                platformIcon={msg.platformIcon || ""}
              />
            ))}
      </div>
    </div>
  );
};

export default MessageList;
