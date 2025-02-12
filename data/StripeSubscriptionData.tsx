import React from "react";

const stripeSubscriptionData = [
  {
    id: "basic",
    name: "Basic Creator",
    price: 59,
    messages: 3000,
    benefits: [
      "24/7 automated response",
      "Greetings and follow-up",
      "Schedule bot ",
      "Track performance",
      "Link multiple social accounts",
    ],
    highlightColor: "",
    buttonColor: "",
    buttonText: "",
    paymentLink: "https://buy.stripe.com/test_bIY1484oBa0Y5mU6oo",
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID,
      annual: "",
    },
  },
  {
    id: "top",
    name: "Top Creator",
    price: 129,
    messages: 10000,
    benefits: [
      "24/7 automated response",
      "Greetings and follow-up",
      "Schedule bot ",
      "Track performance",
      "Link multiple social accounts",
    ],
    highlightColor: "",
    buttonColor: "",
    buttonText: "",
    paymentLink: "",
    stripePriceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_TOP_MONTHLY_PRICE_ID,
      annual: "",
    },
  },
  {
    id: "agency",
    name: "Small Agency",
    price: 319,
    messages: 50000,
    benefits: [
      "24/7 automated response",
      "Greetings and follow-up",
      "Schedule bot ",
      "Track performance",
      "Link multiple social accounts",
    ],
    extraBenefits: ["Connect up to 10 creators", "Manage multiple creators"],
    highlightColor: "border-t-brandPink1x",
    buttonColor: "bg-black",
    buttonText: "Talk to us",
    paymentLink: "",
    stripePriceId: {
      monthly: "",
      annual: "",
    },
  },
];

export default stripeSubscriptionData;
