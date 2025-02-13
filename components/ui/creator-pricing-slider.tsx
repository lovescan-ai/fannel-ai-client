"use client";

import { Loader, MinusIcon, PlusIcon, Trophy } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatPrice, nFormatter } from "@/lib/utils";
import { toast } from "sonner";

const CREATOR_STEP = 5;
const MESSAGES_PER_CREATOR = 5000;
const MIN_CREATORS = 10;
const AMOUNT_PER_CREATOR = 20;
const MIN_PRICE = 40;

export default function CreatorPricingSlider() {
  const [price, setPrice] = useState(MIN_PRICE);
  const [creators, setCreators] = useState(MIN_CREATORS);
  const [messages, setMessages] = useState(MESSAGES_PER_CREATOR * 2);
  const [isLoading, setIsLoading] = useState(false);
  const [displayValues, setDisplayValues] = useState({
    price: MIN_PRICE,
    creators: MIN_CREATORS,
    messages: MESSAGES_PER_CREATOR * 2,
  });

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animateValues = (startValues: any, endValues: any) => {
    const duration = 300; // Animation duration in ms
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const animate = () => {
      currentStep++;
      const progress = currentStep / steps;

      setDisplayValues({
        price:
          startValues.price + (endValues.price - startValues.price) * progress,
        creators:
          startValues.creators +
          (endValues.creators - startValues.creators) * progress,
        messages:
          startValues.messages +
          (endValues.messages - startValues.messages) * progress,
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

  const handleIncrease = () => {
    const newCreators = creators + CREATOR_STEP;
    const newMessages = messages + MESSAGES_PER_CREATOR;
    const newPrice = price + AMOUNT_PER_CREATOR;

    setCreators(newCreators);
    setMessages(newMessages);
    setPrice(newPrice);

    animateValues(displayValues, {
      creators: newCreators,
      messages: newMessages,
      price: newPrice,
    });
  };

  const handleDecrease = () => {
    if (creators <= MIN_CREATORS) return;

    const newCreators = creators - CREATOR_STEP;
    const newMessages = messages - MESSAGES_PER_CREATOR;
    const newPrice = price - AMOUNT_PER_CREATOR;

    setCreators(newCreators);
    setMessages(newMessages);
    setPrice(newPrice);

    animateValues(displayValues, {
      creators: newCreators,
      messages: newMessages,
      price: newPrice,
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
          price,
          credits: messages,
          tierType: "tier-agencies",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
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
                  onClick={handleDecrease}
                />
                <span className="text-md text-black">
                  {Math.round(displayValues.creators)} creators
                </span>
                <PlusIcon
                  className="h-5 w-5 md:h-6 md:w-6 cursor-pointer text-black hover:opacity-70 transition-opacity"
                  onClick={handleIncrease}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-md text-black">
                How many messages do you need?
              </p>
              <div className="flex items-center justify-center rounded-xl bg-[#F2F2F2] text-black p-2.5 md:p-3 text-sm">
                {nFormatter(Math.round(displayValues.messages), { full: true })}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <p className="text-xl md:text-2xl font-bold text-black">
              {formatPrice(Math.round(displayValues.price))}
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
