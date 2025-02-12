import React from "react";
import Card from "./card";
import ProgressBar from "./progress";
import Button from "./button";
import Skeleton from "./skeleton";

interface UsageOverviewProps {
  usedMessages?: number;
  messageLimit?: number;
  isLoading?: boolean;
  loading: boolean;
}

const UsageOverview: React.FC<UsageOverviewProps> = ({
  usedMessages = 0,
  messageLimit = 1000,
  isLoading = false,
  loading,
}) => {
  const percentUsed =
    messageLimit > 0 ? (usedMessages / messageLimit) * 100 : 0;
  const percentRemaining = 100 - percentUsed;

  if (loading) {
    return (
      <Card className="p-0 flex flex-col justify-between">
        <div className="p-6 space-y-2">
          <Skeleton height="28px" width="50%" />
          <Skeleton height="16px" width="70%" />
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <Skeleton height="16px" width="30%" />
              <Skeleton height="16px" width="20%" />
            </div>
            <Skeleton height="8px" />
            <Skeleton height="16px" width="40%" />
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="p-0 flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Usage Overview</h2>
        <p className="text-sm text-gray-500 mb-4">
          Message count for current billing cycle
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Messages Used</span>
            <span className="text-sm font-bold">
              {usedMessages} / {messageLimit}
            </span>
          </div>
          <ProgressBar value={percentUsed} />
          <p className="text-sm text-gray-500">
            {percentRemaining.toFixed(1)}% remaining
          </p>
        </div>
      </div>
      {/* <div className="px-6 py-4 bg-gray-50">
        <Button variant="outline" className="w-full" onClick={onIncreaseLimit}>
          Increase Limit
        </Button>
      </div> */}
    </Card>
  );
};

export default UsageOverview;
