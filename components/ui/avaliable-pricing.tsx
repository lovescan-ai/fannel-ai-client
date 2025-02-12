import React from "react";
import Button from "./button";
import { Check } from "lucide-react";
import Card from "./card";
interface Plan {
  name: string;
  price: number | string;
  features: string[];
}
const plans: Plan[] = [
  {
    name: "Basic",
    price: 59,
    features: ["2,000 messages/month", "5 bots", "Basic analytics"],
  },
  {
    name: "Pro",
    price: 99,
    features: [
      "10,000 messages/month",
      "Unlimited bots",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom message limit",
      "Dedicated account manager",
      "SLA",
      "On-premise deployment",
    ],
  },
];
export default function AvailablePricing() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, index) => (
          <Card key={index}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-2xl font-bold mb-4">
                ${plan.price}
                {typeof plan.price === "number" && (
                  <span className="text-gray-500 text-base font-normal">
                    {" "}
                    /month
                  </span>
                )}
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <Button
                className="w-full"
                variant={index === 0 ? "default" : "outline"}
              >
                {index === 0 ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
