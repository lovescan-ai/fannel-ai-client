import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Message {
  sender_id: string | number;
  text: string;
  botActive?: boolean;
  id: string | number;
  read?: boolean;
  avatar?: string;
}

interface ChatMessageProps {
  data: Message[];
  currentUserID: string;
}

const MessageBubble: React.FC<{ message: Message; isCurrentUser: boolean }> = ({
  message,
  isCurrentUser,
}) => {
  const bubbleVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex ${
        isCurrentUser ? "justify-end" : "justify-start"
      } items-end mb-4`}
    >
      {!isCurrentUser && (
        <Image
          src={message.avatar || "/avatars/avatar-4.png"}
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
      )}
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
          isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      {isCurrentUser && (
        <div className="ml-2 text-xs text-gray-500">
          {message.read ? "✓✓" : "✓"}
        </div>
      )}
    </motion.div>
  );
};

export default function ChatMessage({ data, currentUserID }: ChatMessageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const validMessages = data.filter(
    (message) => message.text && message.text.trim() !== ""
  );

  return (
    <div className="flex-grow overflow-y-auto px-4 py-5 bg-gray-50">
      <AnimatePresence>
        {validMessages.map((message) => {
          const isCurrentUser = String(message.sender_id) === currentUserID;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
