import { createStripePrice } from "@/lib/stripe";
import { MinusIcon, PlusIcon, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const IncreaseLimitsComponent = ({
  initialCredits = 500,
  creditIncrement = 500,
}) => {
  const [credits, setCredits] = useState(initialCredits);
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const additionalCredits = credits - initialCredits;
    const additionalPrice = Math.ceil(additionalCredits / creditIncrement) * 10;
    setPrice(10 + additionalPrice);
  }, [credits, initialCredits, creditIncrement]);

  const handleIncrement = () => {
    setCredits((prev) => prev + creditIncrement);
  };

  const handleDecrement = () => {
    setCredits((prev) => Math.max(initialCredits, prev - creditIncrement));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= initialCredits) {
      setCredits(value);
    }
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
          credits,
          tierType: "one-time",
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

  return (
    <div className="w-full my-10 p-2">
      <h2 className="text-xl sm:text-2xl font-bold text-navy-blue mb-4">
        Increase Your Limits
      </h2>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 sm:h-3 bg-gradient-to-r from-blue-400 to-brandBlue4x"></div>
        <div className="bg-light-blue flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="w-full sm:w-auto flex flex-col items-center mb-4 space-y-4">
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Total Per Month (USD) Before AI Cost
              </p>
              <p className="text-2xl sm:text-3xl font-bold">
                ${price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full px-6 bg-brandBlue4x text-white font-bold py-2 sm:py-3 rounded-full text-sm sm:text-base flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Processing..." : "Purchase"}
            </button>
          </div>

          <div className="w-full sm:w-auto flex flex-col items-center space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Number of AI Messages
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-brandBlue4x hover:bg-brandBlue4x/85 text-white rounded-full text-xl sm:text-2xl font-bold flex items-center justify-center"
              >
                <MinusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <input
                type="text"
                value={credits}
                onChange={handleInputChange}
                className="w-28 sm:w-44 h-10 sm:h-14 border rounded-lg text-center text-base sm:text-lg font-semibold"
              />
              <button
                onClick={handleIncrement}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-brandBlue4x hover:bg-brandBlue4x/85 text-white rounded-full text-xl sm:text-2xl font-bold flex items-center justify-center"
              >
                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncreaseLimitsComponent;
