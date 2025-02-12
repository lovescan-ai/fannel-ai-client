"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import MsgPreview from "../dashboard/widgets/MsgPreview";
import { useRouter, useSearchParams } from "next/navigation";

interface TwitterMessage {
  dm_conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

interface TwitterUser {
  id: string;
  name: string;
  profile_image_url: string;
}

interface ConversationInfo {
  conversationID: string;
  senderID: string;
  receiverID: string;
  senderName: string;
  receiverName: string;
  latestMessage: TwitterMessage;
  otherPersonInfo: TwitterUser;
}

interface MessageWithInfo extends TwitterMessage {
  senderName: string;
  receiverName: string;
  receiverID: string;
}

export default function Messages() {
  const [receivedMessages, setReceivedMessages] = useState<TwitterMessage[]>(
    []
  );
  const [users, setUsers] = useState<TwitterUser[]>([]);
  const [convo, setConvo] = useState<string>("");
  const [messageThread, setMessageThread] = useState<MessageWithInfo[]>([]);
  const [otherUser, setOtherUser] = useState<TwitterUser[]>([]);
  const [participantId, setParticipantId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [limitError, setLimitError] = useState<boolean>(false);
  const [messageResponse, setMessageResponse] = useState<Record<string, any>>(
    {}
  );
  const [dbMessageResponse, setDBMessageResponse] = useState<
    Record<string, any>
  >({});
  const searchParams = useSearchParams();
  const [currentCreator, setCurrentCreator] = useState<string>(() => {
    return searchParams.get("id") || "";
  });
  const router = useRouter();

  const openConversation = (convoId: string) => {
    setConvo(convoId);
    router.push(`/messages?id=${currentCreator}&convo=${convoId}`);
  };

  const handleSendMessage = async () => {
    try {
      const accessToken = localStorage.getItem("twitterAccessToken");
      if (accessToken) {
        const response = await axios.post("/sendMessage", {
          participant: participantId,
          text: message,
          token: accessToken,
        });
        setResponseMessage(response.data);
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const url = new URL(location.href);
    setCurrentCreator(url.searchParams.get("id") ?? "");
    async function fetchMessages() {
      try {
        const accessToken = localStorage.getItem("twitterAccessToken");
        if (accessToken) {
          console.log(accessToken + " here");
          const response = await axios.get(
            "/getTwitterMessages?oauth=" + accessToken
          );
          setMessageResponse(response?.data);
          console.log("response messages:", response?.data?.data);
          console.log(messageResponse);
        } else {
          console.log("No Code");
        }
      } catch (error) {
        setLimitError(true);
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, []);

  const messageFetcher = async (url: string): Promise<any> => {
    if (Object.keys(messageResponse).length !== 0 && limitError) {
      try {
        const response = await axios.post(
          url,
          {
            data: messageResponse,
            creatorId: currentCreator,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    } else {
      console.warn("No message response available.");
      try {
        const response = await axios.get(url + `/${currentCreator}`);
        setDBMessageResponse(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  };

  const messageDataFetched = useSWR(`/api/twitter/messages`, messageFetcher);
  const messageData = messageDataFetched.data?.directMessages?.data;
  const twitterUsers: TwitterUser[] = messageData?.includes?.users;
  const conversations: string[] = messageData?.data.map(
    (message: TwitterMessage) => message.dm_conversation_id
  );

  const findCurrentUser = (
    users: TwitterUser[],
    conversations: string[]
  ): TwitterUser | null => {
    if (users) {
      for (const user of users) {
        if (
          conversations.every((conversation) => conversation.includes(user.id))
        ) {
          return user;
        }
      }
    }
    return null;
  };

  const getUserName = (userID: string): string => {
    const user = messageData?.includes?.users?.find(
      (user: TwitterUser) => user.id === userID
    );
    return user ? user.name : "Unknown";
  };

  const getUserInfo = (userID: string): TwitterUser | null => {
    return (
      messageData?.includes?.users?.find(
        (user: TwitterUser) => user.id === userID
      ) || null
    );
  };

  const groupedMessages: Record<string, TwitterMessage[]> = {};
  messageData?.data.forEach((message: TwitterMessage) => {
    const conversationID = message.dm_conversation_id;
    if (!groupedMessages[conversationID]) {
      groupedMessages[conversationID] = [];
    }
    groupedMessages[conversationID].push(message);
  });

  const getReceiverID = (message: TwitterMessage): string => {
    const currentUserID =
      findCurrentUser(twitterUsers, conversations)?.id ?? "";
    return message.sender_id === currentUserID
      ? message.dm_conversation_id
          .split("-")
          .filter((id) => id !== currentUserID)[0] ?? ""
      : currentUserID;
  };

  useEffect(() => {
    if (convo) {
      const messagesInConversation = groupedMessages[convo];
      const messagesWithInfo: MessageWithInfo[] = messagesInConversation.map(
        (message) => {
          return {
            ...message,
            senderName:
              message.sender_id === currentUserID
                ? "You"
                : getUserName(message.sender_id),
            receiverName:
              message.sender_id !== currentUserID
                ? "You"
                : getUserName(getReceiverID(message)),
            receiverID: getReceiverID(message),
          };
        }
      );
      const sortedMessages = messagesWithInfo.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setMessageThread(sortedMessages);
    }
  }, [convo]);

  for (const conversationID in groupedMessages) {
    groupedMessages[conversationID].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const currentUserID = findCurrentUser(twitterUsers, conversations)?.id;
  const sortedConversations: ConversationInfo[] = [];
  for (const conversationID in groupedMessages) {
    const conversationMessages = groupedMessages[conversationID];
    const latestMessage = conversationMessages[0];
    const senderID = latestMessage.sender_id;
    const receiverID =
      senderID === currentUserID
        ? conversationID.split("-").filter((id) => id !== currentUserID)[0]
        : currentUserID ?? "";
    const senderName =
      senderID === currentUserID ? "You" : getUserName(senderID);
    const receiverName =
      receiverID === currentUserID ? "You" : getUserName(receiverID);
    const otherPerson = receiverID === currentUserID ? senderID : receiverID;
    const otherPersonInfo = getUserInfo(otherPerson) || {
      id: "",
      name: "Unknown",
      profile_image_url: "",
    };
    sortedConversations.push({
      conversationID,
      senderID,
      receiverID,
      senderName,
      receiverName,
      latestMessage,
      otherPersonInfo,
    });
  }

  return (
    <div>
      <h1>Twitter Messages</h1>
      <div>
        <label htmlFor="participantId">Participant ID:</label>
        <input
          type="text"
          id="participantId"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={handleSendMessage}>Send</button>
      {responseMessage && <p>Response: {responseMessage}</p>}
      <div>
        <h2>Received Twitter Messages:</h2>
        {receivedMessages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <div className={"bg-red-500 h-4 w-full"}></div>
      <div>Your id: {findCurrentUser(twitterUsers, conversations)?.id}</div>
      <div className={"flex flex-row w-full"}>
        <div
          className={`h-full md:h-screen w-full md:w-thirtyPercent md:border-r-1 md:border-r-black/15 md:max-w-md md:min-w-322 pb-14 overflow-auto`}
        >
          <button
            type="button"
            className={`sticky top-0 left-0 bg-white w-full pt-9 px-2 text-lg flex flex-row items-center gap-2 mulish--semibold whitespace-nowrap`}
          >
            All Messages
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995"
                stroke="black"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={`pt-6 pb-20 px-2`}>
            {sortedConversations.map((msg, index) => (
              <MsgPreview
                handleClick={() => openConversation(msg.conversationID)}
                key={index}
                id={msg.conversationID}
                isSelected={convo === msg.conversationID}
                dp={msg.otherPersonInfo.profile_image_url}
                name={msg.otherPersonInfo.name}
                message={msg.latestMessage.text}
                lastSeen={msg.latestMessage.created_at}
                isActive={false}
                isBotActive={false}
                platformName="Twitter"
                platformIcon="/path/to/twitter-icon.svg"
              />
            ))}
          </div>
        </div>

        {!messageThread ? (
          <div></div>
        ) : (
          <div className={`w-full`}>
            <div
              className={`h-full w-full md:static overflow-y-auto rounded-10 px-7 py-5 bg-brandLightBlue4x/80`}
            >
              <div className={`text-base h-full w-full`}>
                <div className={`w-full flex flex-col gap-4 pb-7`}>
                  {/* messages here here */}
                  {messageThread?.map((message, idx) => {
                    if (message.sender_id === currentUserID) {
                      return (
                        <div
                          key={idx}
                          className={`text-white bg-brandBlue4x rounded-50px max-w-sixtyPercent self-start py-3.5 px-6`}
                        >
                          {message.text}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={idx}
                          className={`text-black bg-brandTeal1x rounded-50px max-w-sixtyPercent self-end py-3.5 px-6`}
                        >
                          {message.text}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            {/* <h2>Message Thread:</h2>
            {messageThread.map((message, index) => (
              <div key={index}>
                <p>{message.text}</p>
                <p>Sender: {message.sender_id === currentUserID ? "You" : getUserName(message.sender_id)}</p>
                <p>Receiver: {message.sender_id !== currentUserID ? "You" : getUserName(message.receiver_id)}</p>
                <p>Created At: {message.created_at}</p>
              </div>
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
}
