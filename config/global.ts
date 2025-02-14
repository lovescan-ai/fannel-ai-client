const config = {
  appName: "Fannel AI",
  appDescription: ` Effortlessly grow your traffic. Let AI bot handle all your Instagram DMs 24/7.`,
  domainName: "https://fannel.ai",
  stripe: {
    plans: [
      {
        priceId: process.env.NEXT_PUBLIC_BASIC_PRICE_ID,
        anualPriceId: process.env.NEXT_PUBLIC_BASIC_ANNUAL_PRICE_ID,
        name: "Creator",
        id: "tier-creator",
        description: "Good to get started",
        price: { monthly: "$39", annually: "$327.60" },
        yearlyPrice: 328,
        features: [
          "5,000 AI messages",
          "24/7 automated response",
          "Greetings and follow-up",
          "Schedule bot",
          "Track performance",
          "Link multiple social accounts",
        ],
        mostPopular: false,
        credits: 5000,
      },
      {
        priceId: process.env.NEXT_PUBLIC_LEGEND_PRICE_ID,
        anualPriceId: process.env.NEXT_PUBLIC_LEGEND_ANNUAL_PRICE_ID,
        name: "Small Agencies",
        id: "tier-small-agencies",
        description: "Perfect for small teams",
        price: { monthly: "$159", annually: "$1,335.60" },
        yearlyPrice: 50,
        features: [
          "25,000 AI messages",
          "24/7 automated response",
          "Greetings and follow-up",
          "Schedule bot",
          "Track performance",
          "Link multiple social accounts",
          "Connect up to 10 creators",
          "Manage multiple creator",
        ],
        mostPopular: true,
        credits: 25000,
      },
    ],
  },

  auth: {
    callbackUrl: "/dashboard",
  },
};

export default config;
