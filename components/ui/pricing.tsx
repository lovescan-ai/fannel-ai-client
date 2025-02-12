"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckIcon,
  PlusIcon,
  Loader2,
  CheckCircleIcon,
  CheckCircle2,
} from "lucide-react";
import config from "@/config/global";
import useReadUser from "@/lib/hooks/use-read-user";
import { useRealtimeSubscription } from "@/lib/hooks/use-subscription";
import { usePathname, useRouter } from "next/navigation";
import CircularPreloader from "./preloader";
import CheckmarkIcon from "./icons/checkmark";
import Button from "./button";
import ToggleSwitch from "./switch2";
type FrequencyOption = "monthly" | "annually";

interface Frequency {
  value: FrequencyOption;
  label: string;
  discount?: string;
}

const frequencies: Frequency[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually", discount: "Save up to 30%" },
];

const PricingPlans: React.FC = () => {
  const [frequency, setFrequency] = useState<Frequency>(frequencies[1]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, loading } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id ?? "");
  const router = useRouter();
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const yearlyRef = useRef<HTMLButtonElement>(null);
  const [toggleWidth, setToggleWidth] = useState({ monthly: 0, yearly: 0 });
  const pathname = usePathname();
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    if (monthlyRef.current && yearlyRef.current) {
      setToggleWidth({
        monthly: monthlyRef.current.offsetWidth,
        yearly: yearlyRef.current.offsetWidth,
      });
    }
  }, []);

  const calculateDiscountedMonthlyPrice = (monthlyPrice: string): string => {
    const price = parseFloat(monthlyPrice.replace("$", ""));
    const discountedPrice = Math.round(price * 0.7);
    return `$${discountedPrice}`;
  };

  const handlePayment = async (tier: (typeof config.stripe.plans)[0]) => {
    setIsLoading(tier.id);
    const selectedFrequency = frequency.value;
    const priceId =
      selectedFrequency === "monthly" ? tier.priceId : tier.anualPriceId;
    const interval = selectedFrequency === "monthly" ? "month" : "year";

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        body: JSON.stringify({
          priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode: "subscription",
          interval,
        }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleBilling = async (action: "cancel" | "manage") => {
    setIsLoading(action);

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });
      const data = await response.json();
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(null);
    }
  };

  useEffect(() => {
    console.log("Current subscription:", subscription);
    setIsRedirecting(true);
    if (
      subscription &&
      subscription.status === "active" &&
      pathname === "/auth/pricing"
    ) {
      console.log("Attempting to redirect to how-it-works");
      router.push("/auth/how-it-works");
      setIsRedirecting(false);
    } else {
      console.log("Redirect conditions not met");
      setIsRedirecting(false);
    }
  }, [subscription, pathname, router]);

  return (
    <div className="w-full z-50 relative">
      <CircularPreloader isLoading={isRedirecting || !!isLoading} />
      <div className="w-full">
        <div className="text-center mb-2">
          <div className="inline-flex my-6 relative space-x-4">
            <p
              className={`text-brandBlue4x mulish--semibold tracking-tighter ${
                !isAnnual ? "font-bold" : ""
              }`}
            >
              Monthly
            </p>
            <ToggleSwitch
              className="!h-8"
              initialState={isAnnual}
              onToggle={(isOn) => {
                setIsAnnual(isOn);
                setFrequency(isOn ? frequencies[1] : frequencies[0]);
              }}
            />
            <p
              className={`text-brandBlue4x mulish--semibold tracking-tighter ${
                isAnnual ? "font-bold" : ""
              }`}
            >
              Annually
            </p>
          </div>
          {isAnnual && (
            <button className="bg-[#e5e9fd] text-brandBlue4x border border-brandBlue4x rounded-lg h-7 px-2 text-xs mulish--bold ml-3">
              Save 30%
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.id}
              className="w-full rounded-[22px] bg-white border-1 border-brandBlue4x lg:h-[52vh] h-[65vh] relative overflow-hidden"
            >
              <div className="rounded-b-[22px] border-b-1 border-brandBlue4x bg-[#496AEB] h-[140px] flex flex-col justify-center items-start p-8">
                <h3 className="text-white text-[19.5px] mulish--bold">
                  {plan.name}
                </h3>
                <div className="flex items-center">
                  <h4 className="text-white text-[42px] font-bold tracking-tighter">
                    {isAnnual
                      ? calculateDiscountedMonthlyPrice(plan.price.monthly)
                      : plan.price.monthly}
                  </h4>
                  {isAnnual && (
                    <p className="px-1.5 py-0.5 ml-3 rounded-lg border border-white bg-white/10 text-white text-[14.5px] font-[600] mulish--bold">
                      -30%
                    </p>
                  )}
                </div>
                <p className="text-white text-[14.5px] font-[600] mulish--bold">
                  Per month
                  {isAnnual && " (billed annually)"}
                </p>
              </div>
              <ul className="flex flex-col gap-2 p-8 space-y-2">
                {plan.features.map((feature) => (
                  <li className="flex items-center gap-2">
                    <CheckmarkIcon className="w-[20px] h-[20px] text-brandBlue4x" />
                    <span className="text-[#1F2937] text-base mulish--regular">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-8 left-8 right-8">
                <Button
                  onClick={() => handlePayment(plan)}
                  className="w-full bg-brandBlue4x text-white rounded-lg py-3 text-base mulish--bold"
                  disabled={isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2 inline" />
                      Loading...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
