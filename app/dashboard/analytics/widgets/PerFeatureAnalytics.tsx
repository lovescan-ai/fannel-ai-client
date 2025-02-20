import React from "react";
import AnalyticsCardWrap from "./AnalyticsCardWrap";
import Skeleton from "@/components/ui/skeleton";

interface PerFeatureAnalyticsProps {
  id: string;
  header?: string;
  data: Array<{
    id: string;
    name: string;
    totalDMs?: {
      totalDMs: number;
    };
    totalGreetings?: number;
    totalFollowUps?: number;
  }>;
  icon: React.ReactNode;
  value: "totalDMs" | "totalGreetings" | "totalFollowUps";
  isLoading?: boolean;
}

const PerFeatureAnalytics: React.FC<PerFeatureAnalyticsProps> = ({
  id,
  header,
  data,
  icon,
  value,
  isLoading = false,
}) => {
  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <AnalyticsCardWrap id={id} padding={" "}>
      <div className="bg-brandBlue4x py-5 px-6 rounded-t-20 w-full flex gap-2 items-center">
        <div className={`flex flex-row items-center p-1 rounded-5 bg-white/15`}>
          {icon}
        </div>
        <p className={`mulish--medium text-lg text-white text-left`}>
          {header || "DMs Received"}
        </p>
      </div>
      <div className="px-6">
        {isLoading ? (
          // Skeleton loading state
          <>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center">
                <Skeleton width="40%" height="20px" />
                <Skeleton width="20%" height="20px" />
              </div>
            ))}
          </>
        ) : isEmpty ? (
          // Empty state
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-2 space-y-2">
              <div className="w-11/12 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-2/4 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-2/12 h-10 bg-gray-200 rounded-full"></div>
            </div>
            <p className="mulish--medium text-base text-gray-500 text-center">
              No data available
            </p>
            <p className="mulish--regular text-sm text-gray-400 text-center mt-1">
              {value === "totalDMs"
                ? "There are no DM statistics yet"
                : value === "totalGreetings"
                ? "No greeting statistics available"
                : "No follow-up statistics available"}
            </p>
          </div>
        ) : (
          // Actual data
          data.map((stat, idx) => (
            <div
              key={idx}
              className={`py-4 last:border-b-0 border-b-1 border-b-black/15 flex flex-row justify-between items-center gap-6 w-full`}
            >
              <div className={`flex flex-row items-center gap-2`}>
                {stat.name}
              </div>
              <p className={`mulish--bold text-xl`}>
                {value === "totalDMs"
                  ? stat.totalDMs?.totalDMs
                  : value === "totalGreetings"
                  ? stat.totalGreetings
                  : stat.totalFollowUps}
              </p>
            </div>
          ))
        )}
      </div>
    </AnalyticsCardWrap>
  );
};

export default PerFeatureAnalytics;
