import React from "react";
import Card from "./card";
import { CreditCard, Loader2 } from "lucide-react";
import Button from "./button";
import Skeleton from "./skeleton";

interface ManageSubscriptionProps {
  onUpdateBillingInfo: () => void;
  isLoading: boolean;
  isDataLoading: boolean; // Renamed from 'loading' for clarity
}

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({
  onUpdateBillingInfo,
  isLoading,
  isDataLoading, // Updated prop name
}) => {
  if (isDataLoading) {
    return (
      <Card className="p-0 flex flex-col justify-between">
        <div className="p-6 space-y-2">
          <Skeleton height="28px" width="50%" />
          <Skeleton height="16px" width="70%" />
          <div className="flex items-center space-x-4 mt-4">
            <Skeleton height="32px" width="32px" borderRadius="16px" />
            <div>
              <Skeleton height="20px" width="120px" />
              <Skeleton height="16px" width="80px" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50">
          <Skeleton height="40px" />
        </div>
      </Card>
    );
  }
  return (
    <Card className="p-0 flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Billing Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Manage your payment details
        </p>
        <div className="flex items-center space-x-4 mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
          <div>
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-gray-500">Expires 12/2025</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 bg-gray-50">
        <Button
          variant="outline"
          onClick={onUpdateBillingInfo}
          disabled={isLoading || isDataLoading}
          className="flex items-center justify-center w-full"
        >
          {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
          {isLoading ? "Loading..." : "Update Billing"}
        </Button>
      </div>
    </Card>
  );
};

export default ManageSubscription;
