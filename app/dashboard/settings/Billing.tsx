import React, { useState } from "react";
import IncreaseLimitsComponent from "./widgets/increase-limit";
import CurrentSubscription from "@/components/ui/current-subscription";
import UsageOverview from "@/components/ui/usage-overview";
import ManageSubscription from "@/components/ui/manage-subscription";
import ContactSupport from "@/components/ui/contact-support";
import { useRealtimeSubscription } from "@/lib/hooks/use-subscription";
import { useUser } from "@/lib/hooks/use-user";
import useManageSubscription from "@/lib/hooks/use-manage-subscription";

const Billing: React.FC = () => {
  const { data: user } = useUser();
  const { subscription, loading } = useRealtimeSubscription(user?.id);
  const { isLoading, handleBilling } = useManageSubscription();

  const formatSubscribedAt = (date: Date | string | undefined): string => {
    if (!date) return "";
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();
    }
    return date.toISOString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-12">
        <CurrentSubscription
          loading={loading}
          pricingId={subscription?.priceId ?? ""}
          isActive={subscription?.status === "active"}
          interval={
            subscription?.interval === "yearly" ? "annually" : "monthly"
          }
          subscribedAt={formatSubscribedAt(subscription?.createdAt)}
          onCancel={() => {
            handleBilling("cancel");
          }}
          onUpgrade={() => {
            handleBilling("manage");
          }}
          isLoading={isLoading}
        />
        <UsageOverview
          usedMessages={subscription?.usedCredits ?? 0}
          messageLimit={subscription?.credits ?? 0}
          loading={loading}
        />
        <ManageSubscription
          onUpdateBillingInfo={() => {
            handleBilling("manage");
          }}
          isLoading={!!isLoading}
          isDataLoading={!!loading}
        />
      </div>
      {subscription?.status !== "active" && <IncreaseLimitsComponent />}
      <div className="sm:px-0 px-2">
        <ContactSupport />
      </div>
    </div>
  );
};

export default Billing;
