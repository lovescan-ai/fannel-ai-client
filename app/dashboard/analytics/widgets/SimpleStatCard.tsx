import React from "react";
import AnalyticsCardWrap from "./AnalyticsCardWrap";
import { AreaChart } from "@mantine/charts";
import Skeleton from "@/components/ui/skeleton";

interface SimpleStatCardProps {
  id: string;
  header?: string;
  stat?: string | number;
  icon: React.ReactNode;
  duration?: string;
  data: Array<{ date: string; Value: number }>;
  isLoading?: boolean;
}

const SimpleStatCard: React.FC<SimpleStatCardProps> = ({
  id,
  header = "What stat?",
  stat = "0000",
  icon,
  duration = "Never",
  data,
  isLoading = false,
}) => (
  <AnalyticsCardWrap id={id} padding="pt-7 pb-14 pl-6">
    <div className="flex gap-2 items-center">
      <div className="flex items-center p-0.5 rounded-5 bg-brandBlue5x/15">
        {icon}
      </div>
      <p className="text-lg text-brandBlue4x font-semibold">{header}</p>
    </div>
    <div className="flex gap-4 mt-4">
      <div className="space-y-2">
        {isLoading ? (
          <Skeleton width="96px" height="36px" borderRadius="4px" />
        ) : (
          <p className="font-bold text-brandDarkPurple1x text-3xl">{stat}</p>
        )}
        {isLoading ? (
          <Skeleton width="80px" height="16px" borderRadius="4px" />
        ) : (
          <p className="text-sm whitespace-nowrap text-brandDarkPurple1x">
            {duration}
          </p>
        )}
      </div>
      {isLoading ? (
        <Skeleton width="90%" height="80px" borderRadius="4px" />
      ) : (
        <AreaChart
          h={80}
          data={data}
          dataKey="date"
          withGradient
          dotProps={{ r: 0, strokeWidth: 0, stroke: "#496AEB" }}
          activeDotProps={{ r: 4, strokeWidth: 1, fill: "#fff" }}
          withXAxis={false}
          withYAxis={false}
          withDots={false}
          tickLine="none"
          gridAxis="none"
          curveType="natural"
          series={[{ name: "Value", color: "#6F6AF8", label: header }]}
        />
      )}
    </div>
  </AnalyticsCardWrap>
);

export default SimpleStatCard;
