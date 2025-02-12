import { useState, useEffect, useCallback } from "react";

interface BroadcastChannelHook {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  receivedMessages: string[];
  sendMessage: (message: string) => void;
  clearMessages: () => void;
}

const useBroadcastChannel = (channelName: string): BroadcastChannelHook => {
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    const channel = new BroadcastChannel(channelName);

    const handleMessage = (event: MessageEvent) => {
      setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [channelName]);

  const sendMessage = useCallback(
    (message: string) => {
      const channel = new BroadcastChannel(channelName);
      channel.postMessage(message);
    },
    [channelName]
  );

  const clearMessages = useCallback(() => {
    setReceivedMessages([]);
  }, []);

  return {
    message,
    setMessage,
    receivedMessages,
    sendMessage,
    clearMessages,
  };
};

export default useBroadcastChannel;
