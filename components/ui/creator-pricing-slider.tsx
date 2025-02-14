"use client";

import { Loader, MinusIcon, PlusIcon, Trophy } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatPrice, nFormatter } from "@/lib/utils";
import { toast } from "sonner";

const CREATOR_STEP = 5;
const MESSAGES_PER_CREATOR = 5000;
const MIN_CREATORS = 10;
const AMOUNT_PER_CREATOR = 20;
const MESSAGES_PER_PACK = 2500;
const AMOUNT_PER_MESSAGE_PACK = 10;

export default function CreatorPricingSlider() {
  const [creators, setCreators] = useState(MIN_CREATORS);
  const [messagePacks, setMessagePacks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [displayValues, setDisplayValues] = useState({
    creators: MIN_CREATORS,
    messagePacks: 0,
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messages = Math.round(
    displayValues.creators * MESSAGES_PER_CREATOR +
      displayValues.messagePacks * MESSAGES_PER_PACK
  );
  const price = Math.round(
    displayValues.creators * AMOUNT_PER_CREATOR +
      displayValues.messagePacks * AMOUNT_PER_MESSAGE_PACK
  );

  const animateValues = (startValues: any, endValues: any) => {
    const duration = 300;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayValues({
        creators:
          startValues.creators +
          (endValues.creators - startValues.creators) * progress,
        messagePacks:
          startValues.messagePacks +
          (endValues.messagePacks - startValues.messagePacks) * progress,
      });

      if (currentStep < steps) {
        animationTimeoutRef.current = setTimeout(animate, stepDuration);
      } else {
        setDisplayValues(endValues);
      }
    };

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animate();
  };

  const handleCreatorsChange = (operation: "increase" | "decrease") => {
    const newCreators =
      operation === "increase"
        ? creators + CREATOR_STEP
        : creators - CREATOR_STEP;

    if (newCreators < MIN_CREATORS) return;

    setCreators(newCreators);
    animateValues(displayValues, {
      creators: newCreators,
      messagePacks: messagePacks,
    });
  };

  const handleMessagePacksChange = (operation: "increase" | "decrease") => {
    const newMessagePacks =
      operation === "increase" ? messagePacks + 1 : messagePacks - 1;

    if (newMessagePacks < 0) return;

    setMessagePacks(newMessagePacks);
    animateValues(displayValues, {
      creators: creators,
      messagePacks: newMessagePacks,
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/credit-checkout", {
        method: "POST",
        body: JSON.stringify({
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode: "payment",
          price: Math.round(
            creators * AMOUNT_PER_CREATOR +
              messagePacks * AMOUNT_PER_MESSAGE_PACK
          ),
          credits: Math.round(
            creators * MESSAGES_PER_CREATOR + messagePacks * MESSAGES_PER_PACK
          ),
          tierType: "tier-agencies",
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment process failed:", error);
      toast.error(
        "An error occurred while processing your payment. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      animationTimeoutRef.current && clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  return (
    <div className="mx-auto mt-10 w-full rounded-2xl bg-white p-4 md:p-8 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-4 sm:w-[85%] w-full flex flex-col">
          <div className="flex-grow space-y-4">
            <Trophy className="h-8 w-8 md:h-10 md:w-10 text-black" />
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                Big Agencies
              </h3>
              <p className="text-base md:text-lg font-semibold text-[#425067]">
                Custom pricing for agencies managing more than 5 creators.
              </p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full rounded-xl bg-[#F2F2F2] py-2.5 md:py-3 text-sm md:text-base font-semibold text-black transition-colors hover:bg-gray-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <div className="flex-grow space-y-4">
            <div className="space-y-2">
              <p className="text-md text-black">
                How many accounts do you need?
              </p>
              <div className="flex items-center justify-between rounded-xl bg-[#F2F2F2] p-2.5 md:p-3">
                <MinusIcon
                  className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-black hover:opacity-70 transition-opacity"
                  onClick={() => handleCreatorsChange("decrease")}
                />
                <span className="text-md text-black">
                  {Math.round(displayValues.creators)} creators
                </span>
                <PlusIcon
                  className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-black hover:opacity-70 transition-opacity"
                  onClick={() => handleCreatorsChange("increase")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-md text-black">
                How many messages do you need?
              </p>
              <div className="flex items-center justify-between rounded-xl bg-[#F2F2F2] p-2.5 md:p-3">
                <MinusIcon
                  className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-black hover:opacity-70 transition-opacity"
                  onClick={() => handleMessagePacksChange("decrease")}
                />
                <span className="text-md text-black">
                  {nFormatter(messages, { full: true })}
                </span>
                <PlusIcon
                  className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-black hover:opacity-70 transition-opacity"
                  onClick={() => handleMessagePacksChange("increase")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <p className="text-xl md:text-2xl font-bold text-black">
              {formatPrice(price)}
              <span className="text-xs md:text-sm font-normal text-black">
                /month
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
