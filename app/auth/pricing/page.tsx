import React, { Suspense } from "react";
import PricingPlans from "@/components/ui/pricing";
import { Metadata } from "next";
import AuthWrap from "../widgets/AuthWrap";
import { Loader } from "lucide-react";
import previewImg from "../../../public/creator-details-preview.png";
import CreatorPricingSlider from "@/components/ui/creator-pricing-slider";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.",
};

export default async function Page() {
  return (
    <AuthWrap
      previewImg={previewImg as any}
      previewAlt={"Pricing - Flannel review"}
      isPricing={true}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin text-brandBlue2x w-10 h-10" />
          </div>
        }
      >
        <PricingPlans />
        <CreatorPricingSlider />
      </Suspense>
    </AuthWrap>
  );
}
