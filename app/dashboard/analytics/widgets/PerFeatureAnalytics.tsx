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
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8.00002C21 6.53002 20.82 5.76002 20.39 5.12002C19.9 4.37002 19.13 3.80002 18.25 3.54002C17.35 3.28002 16.25 3.42002 15.34 3.85002L9.95 6.65002C9.38 6.93002 8.88 7.26002 8.45 7.65002C8.14 7.93002 8 8.20002 8 8.50002C8 8.80002 8.14 9.07002 8.45 9.35002C8.88 9.74002 9.38 10.07 9.95 10.35L15.34 13.15C16.25 13.58 17.35 13.72 18.25 13.46C19.13 13.2 19.9 12.63 20.39 11.88C20.82 11.24 21 10.47 21 9.00002V16Z" />
                <path d="M13 2.05002C13 2.05002 2 6.00002 2 12C2 18 13 21.95 13 21.95" />
                <path d="M13 12C13 12 2 8.00002 2 12C2 16 13 12 13 12Z" />
              </svg>
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
