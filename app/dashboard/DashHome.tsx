"use client";

import React, { useState, useMemo, useEffect } from "react";
import NoMessage from "./widgets/NoMessage";
import MessageList from "./widgets/MessageList";
import ViewMessage from "./widgets/ViewMessage";
import { useViewCreators } from "@/lib/hooks/use-creator";
import Skeleton from "@/components/ui/skeleton";
import useConversationThreads from "@/lib/hooks/use-conversation-threads";
import { MessageType } from "@prisma/client";

type Message = {
  id: string;
  text: string;
  created_at: string;
  senderName: string;
  receiverName: string;
  sender_id: string;
  receiver_id: string;
};

type ConversationMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderUsername: string;
  receiverUsername: string;
  timestamp: Date;
  isRead: boolean;
  buttonLink: string | null;
  buttonLabel: string | null;
  type: MessageType;
};

const DashHome = () => {
  const [currentId, setCurrentId] = useState("");
  const [showMessageView, setShowMessageView] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<
    string | undefined
  >(undefined);

  const {
    creators,
    isLoading: isCreatorsLoading,
    error: creatorsError,
  } = useViewCreators();

  const {
    conversations,
    isLoading: isConversationsLoading,
    error: conversationsError,
    refetchConversations,
  } = useConversationThreads(selectedCreatorId);

  useEffect(() => {
    if (creators && creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }
  }, [creators, selectedCreatorId]);

  useEffect(() => {
    if (selectedCreatorId) {
      refetchConversations();
    }
  }, [selectedCreatorId, refetchConversations]);

  const selectedCreator = useMemo(
    () => creators?.find((creator) => creator.id === selectedCreatorId),
    [creators, selectedCreatorId]
  );

  const transformMessages = (messages: ConversationMessage[]): Message[] => {
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.content,
      created_at: msg.timestamp.toISOString(),
      senderName: msg.senderUsername,
      receiverName: msg.receiverUsername,
      sender_id: msg.senderId,
      receiver_id: msg.receiverId,
    }));
  };

  const currentMessageThread: Message[] = useMemo(
    () =>
      currentId && conversations
        ? transformMessages(
            conversations.find((thread) => thread.id === currentId)?.messages ||
              []
          )
        : [],
    [currentId, conversations]
  );

  const sortedConversations = useMemo(
    () =>
      conversations?.map((thread) => {
        const latestMessage = thread.messages[0];
        return {
          conversationID: thread.id,
          senderID: thread.creatorId,
          receiverID: latestMessage?.receiverId || "",
          senderName: latestMessage?.senderUsername || "You",
          receiverName: latestMessage?.receiverUsername || "User",
          latestMessage: {
            text: latestMessage?.content || "",
            created_at: latestMessage?.timestamp.toISOString() || "",
          },
          otherPersonInfo: {
            name: latestMessage?.receiverUsername || "User",
            username: latestMessage?.receiverUsername || "User",
            avatar: thread.receiverProfileImageUrl,
          },
        };
      }) || [],
    [conversations]
  );

  if (isCreatorsLoading || isConversationsLoading)
    return (
      <div>
        <Skeleton width="448px" height="100vh" />
      </div>
    );

  if (creatorsError)
    return <div>Error loading creators: {creatorsError.toString()}</div>;

  if (conversationsError)
    return (
      <div>Error loading conversations: {conversationsError.toString()}</div>
    );

  if (!selectedCreatorId)
    return (
      <div>
        No creator selected. Please select a creator to view conversations.
      </div>
    );

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-hidden">
        {/* Desktop view */}
        <div className="hidden md:flex flex-row h-full overflow-hidden w-full">
          <MessageList
            data={sortedConversations}
            selectedMsgId={currentId}
            handleClick={(id: string) => {
              setCurrentId(id);
            }}
            creators={creators || []}
            selectedCreatorId={selectedCreatorId}
            setSelectedCreatorId={setSelectedCreatorId}
            selectedCreator={selectedCreator || null}
            isLoading={isConversationsLoading}
          />

          {currentMessageThread.length === 0 ? (
            <NoMessage />
          ) : (
            <ViewMessage
              data={currentMessageThread}
              thread={
                conversations?.find((thread) => thread.id === currentId) as any
              }
              currentUserID={selectedCreatorId}
              setTranslate={() => {}}
              isLoading={isConversationsLoading}
            />
          )}
        </div>

        {/* Mobile view */}
        <div className="flex md:hidden flex-col h-full overflow-hidden w-full">
          <div className={`h-full ${showMessageView ? "hidden" : "block"}`}>
            <MessageList
              data={sortedConversations}
              selectedMsgId={currentId}
              handleClick={(id: string) => {
                setCurrentId(id);
                setShowMessageView(true);
              }}
              creators={creators || []}
              selectedCreatorId={selectedCreatorId}
              setSelectedCreatorId={setSelectedCreatorId}
              selectedCreator={selectedCreator || null}
              isLoading={isConversationsLoading}
            />
          </div>
          <div className={`h-full ${showMessageView ? "block" : "hidden"}`}>
            {currentMessageThread.length === 0 ? (
              <NoMessage />
            ) : (
              <ViewMessage
                data={currentMessageThread}
                thread={
                  conversations?.find(
                    (thread) => thread.id === currentId
                  ) as any
                }
                currentUserID={selectedCreatorId}
                setTranslate={() => setShowMessageView(false)}
                isLoading={isConversationsLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
