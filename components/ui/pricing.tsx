"use client";
import React, { useState, useRef, useEffect } from "react";
import config from "@/config/global";
import useReadUser from "@/lib/hooks/use-read-user";
import { useRealtimeSubscription } from "@/lib/hooks/use-subscription";
import { usePathname, useRouter } from "next/navigation";
import CircularPreloader from "./preloader";
import { PricingCard, PricingToggle } from "./pricing-card";
import { toast } from "sonner";
type FrequencyOption = "monthly" | "annually";

interface CreatorSettings {
  subscribed: boolean;
  credits: number;
  priceId: string;
  status: "success" | "failed";
}
interface Frequency {
  value: FrequencyOption;
  label: string;
  discount?: string;
}

const frequencies: Frequency[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually", discount: "Save up to 30%" },
];

const PricingPlans: React.FC<{ creatorSettings: CreatorSettings }> = ({
  creatorSettings,
}) => {
  const [frequency, setFrequency] = useState<Frequency>(frequencies[1]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id ?? "");
  const router = useRouter();
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const yearlyRef = useRef<HTMLButtonElement>(null);
  const [_, setToggleWidth] = useState({ monthly: 0, yearly: 0 });
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
          tierType: tier.id,
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

  useEffect(() => {
    if (creatorSettings.status === "failed") {
      toast.error("Unable to process payment");
    }
  }, [creatorSettings]);

  return (
    <div className="w-full z-50 relative">
      <CircularPreloader isLoading={isRedirecting || !!isLoading} />
      <div className="w-full">
        <div className="items-start">
          <h3 className="text-black text-[40px] mulish--bold tracking-normal">
            Choose your plan
          </h3>
          <p className="text-black mulish--regular text-lg tracking-tight py-2">
            Select a plan before moving forward
          </p>
        </div>

        <PricingToggle
          isAnnual={isAnnual}
          onToggle={(isOn: boolean) => {
            setIsAnnual(isOn);
            setFrequency(isOn ? frequencies[1] : frequencies[0]);
          }}
        />

        <div className="grid sm:grid-cols-2 gap-5">
          {config.stripe.plans.map((plan) => (
            <PricingCard
              key={plan.id}
              type={plan.id === "tier-creator" ? "creator" : "agency"}
              price={
                isAnnual
                  ? calculateDiscountedMonthlyPrice(plan.price.monthly)
                  : plan.price.monthly
              }
              onClick={() => handlePayment(plan)}
              disabled={isLoading === plan.id}
              loading={isLoading === plan.id}
              isAnnual={isAnnual}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
