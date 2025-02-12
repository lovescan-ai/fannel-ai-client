import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white border border-black/15 w-full flex flex-col gap-5 rounded-10 py-4 pr-7 pl-4">
      <div className="flex items-center space-x-2">
        <TextareaAutosize
          minRows={1}
          maxRows={2}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message..."
          className="mulish--semibold w-full resize-none bg-transparent px-4 py-1 focus:outline-none"
        />
        <div className="flex items-center space-x-4">
          <button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3278_4340)">
                <mask
                  id="mask0_3278_4340"
                  style={{ maskType: "luminance" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                >
                  <path d="M0 0H24V24H0V0Z" fill="white" />
                </mask>
                <g mask="url(#mask0_3278_4340)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 12C24 5.37259 18.6274 0 12 0C5.37259 0 0 5.37259 0 12C0 18.6274 5.37259 24 12 24C18.6274 24 24 18.6274 24 12ZM17.8973 8.4883C17.8973 9.45687 17.1133 10.2423 16.1452 10.2446L16.1411 10.2446C15.1711 10.2446 14.3848 9.45826 14.3848 8.4883C14.3848 7.51971 15.1689 6.73426 16.1369 6.73202L16.1411 6.732C17.111 6.732 17.8973 7.51833 17.8973 8.4883ZM9.61524 8.4883C9.61524 9.45689 8.83116 10.2423 7.86309 10.2446L7.85892 10.2446C6.88896 10.2446 6.10263 9.45826 6.10263 8.4883C6.10263 7.51971 6.88671 6.73425 7.85477 6.73202L7.85894 6.732C8.82891 6.732 9.61524 7.51833 9.61524 8.4883ZM7.18277 13.3036C7.02902 12.7322 6.44114 12.3937 5.86973 12.5475C5.29833 12.7012 4.95977 13.2891 5.11354 13.8605C5.93119 16.8989 8.70439 19.1367 12.003 19.1367C15.3016 19.1367 18.0747 16.8989 18.8925 13.8605C19.0462 13.2891 18.7077 12.7012 18.1363 12.5475C17.5649 12.3937 16.977 12.7322 16.8232 13.3036C16.251 15.4301 14.3082 16.9938 12.003 16.9938C9.69775 16.9938 7.75502 15.4301 7.18277 13.3036Z"
                    fill="#496AEB"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_3278_4340">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button
            onClick={handleSendMessage}
            className="flex items-center gap-2 mulish--regular"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.523371 3.13221C0.319205 2.31671 0.609705 1.45805 1.26537 0.93188C1.92104 0.405713 2.82287 0.310046 3.57421 0.685713L24.3525 11.0749C25.0817 11.4389 25.5425 12.1844 25.5425 12.9999C25.5425 13.8154 25.0817 14.5609 24.3525 14.9249L3.57421 25.314C2.82287 25.6897 1.92104 25.594 1.26537 25.0679C0.609705 24.5417 0.319205 23.683 0.523371 22.8675L2.69921 14.1665L15.3342 12.9999L2.69921 11.8332L0.523371 3.13221Z"
                fill="#496AEB"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
