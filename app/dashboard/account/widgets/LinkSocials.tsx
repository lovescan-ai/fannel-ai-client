import React from "react";
import { Loader2 } from "lucide-react";

type AccountType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
};

type LinkSocialsProps = {
  accounts: AccountType[];
  type: "add" | "edit";
  handleConnectInstagram: (e: React.FormEvent) => void;
  disconnectSocial: (params: { creatorId: string }) => void;
  isDisconnecting: boolean;
  isConnecting?: boolean;
};

export type Account = {
  icon: React.ReactNode;
  id: string;
  name: string;
  connected: boolean;
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin text-current" />
    <span className="text-xs sm:text-sm">Loading...</span>
  </div>
);

const LinkSocials: React.FC<LinkSocialsProps> = ({
  accounts,
  type,
  handleConnectInstagram,
  disconnectSocial,
  isDisconnecting,
  isConnecting = false,
}) => {
  return (
    <>
      {accounts.map((account, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-4 py-2.5 px-3.5 bg-white border border-black/15 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-4 text-black mulish--medium">
              {account.icon}
              <p className="text-sm sm:text-base">{account.name}</p>
            </div>
            {type === "add" && (
              <button
                onClick={handleConnectInstagram}
                disabled={isConnecting}
                className="hover:scale-95 disabled:hover:scale-100 disabled:opacity-70 duration-300 h-9 sm:h-11 transition-all ease-in-out bg-brandBlue4x text-white mulish--medium text-xs sm:text-sm py-1 sm:py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center min-w-[100px]"
              >
                {isConnecting ? <LoadingSpinner /> : "Connect"}
              </button>
            )}
          </div>

          {type === "edit" && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full">
              <button
                onClick={handleConnectInstagram}
                disabled={isConnecting}
                className="text-xs sm:text-sm w-full sm:w-1/2 h-9 sm:h-10 hover:scale-95 disabled:hover:scale-100 disabled:opacity-70 duration-300 transition-all ease-in-out bg-brandBlue4x text-white mulish--medium py-1 sm:py-2 px-2 sm:px-3.5 rounded-lg flex items-center justify-center"
              >
                {isConnecting ? <LoadingSpinner /> : "Switch account"}
              </button>
              <button
                onClick={() => disconnectSocial({ creatorId: account.id })}
                disabled={isDisconnecting}
                className="text-xs sm:text-sm w-full sm:w-1/2 h-9 sm:h-10 hover:scale-95 disabled:hover:scale-100 disabled:opacity-70 duration-300 transition-all ease-in-out text-brandBlue4x bg-brandBlue4x/15 mulish--medium py-1 sm:py-2 px-2 sm:px-3.5 rounded-lg flex items-center justify-center"
              >
                {isDisconnecting ? <LoadingSpinner /> : "Disconnect"}
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default LinkSocials;
