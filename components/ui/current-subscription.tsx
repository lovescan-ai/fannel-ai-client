import {
  getSubscriptionExpiryDate,
  getSubscriptionPrice,
} from "@/utils/subscription-helpers";
import { Check, Loader2, X } from "lucide-react";
import Card from "./card";
import Skeleton from "./skeleton";
import Button from "./button";
interface CurrentSubscriptionProps {
  isActive: boolean;
  onCancel: () => void;
  onUpgrade: () => void;
  pricingId: string;
  interval: "monthly" | "annually";
  subscribedAt: string;
  isLoading: string | null;
  loading: boolean;
}

const CurrentSubscription: React.FC<CurrentSubscriptionProps> = ({
  isActive,
  onCancel,
  onUpgrade,
  pricingId,
  interval,
  subscribedAt,
  isLoading,
  loading,
}) => {
  const price = getSubscriptionPrice(pricingId, interval);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const getExpiryDate = (
    startDateString: string,
    interval: "monthly" | "annually"
  ) => {
    if (!startDateString) return "N/A";
    const startDate = new Date(startDateString);
    if (isNaN(startDate.getTime())) return "Invalid Date";
    return formatDate(getSubscriptionExpiryDate(startDate, interval));
  };

  if (loading) {
    return (
      <Card className="p-0">
        <div className="p-6 space-y-2">
          <Skeleton height="28px" width="50%" />
          <Skeleton height="16px" width="70%" />
          <div className="mt-4">
            <Skeleton height="32px" width="80%" />
          </div>
          <div className="mt-4">
            <Skeleton height="40px" width="60%" />
          </div>
          <Skeleton height="40px" />
        </div>
        <div className="px-6 py-4 space-y-2 bg-gray-50 flex justify-between">
          <Skeleton height="40px" width="40%" />
          <Skeleton height="40px" width="40%" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
        <p className="text-sm text-gray-500 mb-4">Your active subscription</p>
        <div className="flex items-center mb-4">
          <h3 className="text-2xl font-bold mr-3">Basic Plan</h3>
          {isActive ? (
            <div className="bg-green-100 px-2 py-1 flex items-center rounded-full">
              <Check className="w-4 h-4 mr-2 text-green-800" />
              <span className="text-green-800 text-sm">Active</span>
            </div>
          ) : (
            <div className="bg-red-100 px-2 py-1 flex items-center rounded-full">
              <X className="w-4 h-4 mr-2 text-red-800" />
              <span className="text-red-800 text-sm">Inactive</span>
            </div>
          )}
        </div>
        <p className="text-3xl font-bold mb-2">
          {price}{" "}
          <span className="text-gray-500 text-base font-normal">
            per {interval === "annually" ? "year" : "month"}
          </span>
        </p>
        <div className="bg-blue-50 text-brandBlue4x p-2 rounded-md text-center text-sm font-semibold mb-4">
          {formatDate(subscribedAt)} → {getExpiryDate(subscribedAt, interval)}
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 flex justify-between">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={onUpgrade}
        >
          Change Plan
          {isLoading === "manage" && (
            <Loader2 className="animate-spin h-5 w-5 ml-2" />
          )}
        </Button>

        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
          onClick={onCancel}
          disabled={isLoading === "cancel"}
        >
          Cancel Plan
          {isLoading === "cancel" && (
            <Loader2 className="animate-spin h-5 w-5 ml-2" />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CurrentSubscription;
