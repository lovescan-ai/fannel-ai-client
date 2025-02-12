import config from "@/config/global";

type PlanInterval = "monthly" | "annually";
type Plan = {
  id: string;
  price: { [key in PlanInterval]: string };
};

export const getSubscriptionPrice = (
  priceId: string,
  interval: PlanInterval
) => {
  const price = config.stripe.plans.find((plan) =>
    interval === "annually" ? plan.anualPriceId : plan.priceId
  );
  return price?.price[interval];
};

export const getSubscriptionExpiryDate = (
  subscribedAt: Date,
  interval: PlanInterval
) => {
  const subscribedAtDate = new Date(subscribedAt);
  const intervalInMonths = interval === "annually" ? 12 : 1;
  const expiryDate = new Date(
    subscribedAtDate.setMonth(subscribedAtDate.getMonth() + intervalInMonths)
  );
  return expiryDate.toISOString().split("T")[0];
};
