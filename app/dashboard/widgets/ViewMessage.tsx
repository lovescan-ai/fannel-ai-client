import React, { useState, useRef, useEffect } from "react";
import DashBody from "./DashBody";
import useComponentVisible from "@/utils/useHideOnClickOutside";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { Participants } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Skeleton from "@/components/ui/skeleton";

interface Message {
  sender_id: string | number;
  text: string;
  botActive?: boolean;
  id: string | number;
  read?: boolean;
  avatar?: string;
}

interface ViewMessageProps {
  setTranslate: (value: boolean) => void;
  data: Message[];
  currentUserID: string | number;
  thread: Participants;
  isLoading: boolean;
}

const ViewMessage: React.FC<ViewMessageProps> = ({
  setTranslate,
  data,
  currentUserID,
  thread,
  isLoading,
}) => {
  const [__, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useComponentVisible("#messageMenu", "#openMessageMenu", () =>
    setIsOpen(false)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const handleSendMessage = () => {
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const userID = String(thread.userId);

  return (
    <DashBody
      bgColor="bg-white"
      hideOverflow
      padding="lg:py-4 lg:py-8 lg:px-7 p-0"
    >
      <div className="flex flex-col gap-5 w-full overflow-y-hidden h-full relative">
        {isLoading ? (
          <>
            <div className="p-4 border-b space-y-2 border-gray-200">
              <Skeleton width="200px" height="24px" />
              <Skeleton width="150px" height="16px" />
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="mb-4 space-y-2">
                  <Skeleton width="70%" height="20px" />
                  <Skeleton width="50%" height="16px" />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Skeleton width="100%" height="40px" />
            </div>
          </>
        ) : (
          <>
            <ChatHeader
              setTranslate={setTranslate}
              user={{
                avatarUrl: thread.avatarUrl,
                botActive: true,
                name: thread.username,
                status: "away",
                username: thread.username,
                lastSeen: formatDistanceToNow(new Date(thread.updatedAt), {
                  addSuffix: true,
                }),
              }}
            />
            <ChatMessage data={data} currentUserID={userID} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </DashBody>
  );
};

export default ViewMessage;
