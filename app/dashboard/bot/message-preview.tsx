import Button from "@/components/ui/button";
import DotPattern from "@/components/ui/magicdesign/dot-pattern";
import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

interface InstagramPreviewProps {
  greetingMessage?: string;
  followUpMessage?: string;
  ctaMessage?: string;
  ctaButtonLabel?: string;
  followupButtonLabel?: string;
  previewImg?: string;
}

const InstagramPreview: React.FC<InstagramPreviewProps> = ({
  greetingMessage,
  followUpMessage,
  ctaMessage,
  ctaButtonLabel,
  followupButtonLabel,
  previewImg,
}) => {
  const content = (
    <div className="bg-white relative py-4 px-2 rounded-[40px] w-full h-full overflow-y-auto">
      <div className="bg-white rounded-lg p-4 mb-1 flex justify-start items-end relative max-w-[85%] z-10 w-full">
        <div className="w-8 h-8 rounded-full bg-[#eeeeee80] flex-shrink-0 mr-3"></div>
        <div
          className={cn(
            "bg-[#F1F1F1] text-sm max-w-[70%] px-4 py-2 ",
            greetingMessage?.length && greetingMessage?.length > 50
              ? "max-w-full rounded-2xl"
              : "max-w-[70%] rounded-full"
          )}
        >
          {greetingMessage || "Sample Greeting Message"}
        </div>
      </div>
      {ctaMessage && (
        <div className="bg-white rounded-lg p-4 mb-1 flex items-end justify-start max-w-[85%] relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#eeeeee80] flex-shrink-0 mr-3"></div>
          <div className="bg-[#eeeeee80] rounded-lg p-4 flex-grow">
            <p className="text-sm mb-4">{ctaMessage}</p>
            <div className="flex flex-col space-y-2">
              {ctaButtonLabel && (
                <Button
                  variant="default"
                  className="w-full bg-white !text-black !font-bold hover:bg-white"
                >
                  {ctaButtonLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {followUpMessage && (
        <div className="bg-white rounded-lg p-4 mb-1 flex justify-start items-end max-w-[85%] relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#eeeeee80] flex-shrink-0 mr-3"></div>
          <div>
            {previewImg && (
              <div className="w-full h-full">
                <Image
                  src={previewImg}
                  alt="Preview Image"
                  width={250}
                  height={280}
                  className="rounded-lg mb-4"
                />
              </div>
            )}
            <div className="bg-[#eeeeee80] rounded-lg p-4">
              <p
                className={cn(
                  "text-sm mb-4",
                  followUpMessage?.length && followUpMessage?.length > 50
                    ? "max-w-full rounded-2xl"
                    : "max-w-[70%] rounded-full"
                )}
              >
                {followUpMessage}
              </p>

              {followupButtonLabel && (
                <Button
                  variant="default"
                  className="w-full bg-white !text-black !font-bold hover:bg-white"
                >
                  {followupButtonLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="iphone-13-pro-max">
      <div className="iphone-inner">
        <div className="iphone-notch">
          <div className="flex items-center space-x-1">
            <ChevronLeft size={24} className="text-[#C5C5C5]" />
            <div className="w-12 h-12 bg-[#C5C5C5] rounded-full"></div>
            <h4 className="text-lg font-bold pl-3">Fannel AI Bot</h4>
          </div>
        </div>
        <div className="iphone-screen">{content}</div>
      </div>
    </div>
  );
};

export default InstagramPreview;
