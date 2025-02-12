import { useState } from "react";

const useManageSubscription = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

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

  return {
    isLoading,
    handleBilling,
  };
};

export default useManageSubscription;
