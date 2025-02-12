import React from "react";
import { DonutChart } from "@mantine/charts";
import Skeleton from "@/components/ui/skeleton";

interface DonutStatProps {
  id: string;
  allCreatorsCredits: { id: string; name: string; credits: number }[];
  isLoading: boolean;
}

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#FFD700",
  "#FF69B4",
  "#20B2AA",
  "#DDA0DD",
  "#00CED1",
];

const DonutStat: React.FC<DonutStatProps> = ({
  id,
  allCreatorsCredits,
  isLoading,
}) => {
  const totalCredits = allCreatorsCredits.reduce(
    (acc, cur) => acc + cur.credits,
    0
  );

  const chartData = allCreatorsCredits.map((creator, index) => ({
    name: creator.name,
    value: creator.credits,
    color: colors[index % colors.length],
  }));

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Skeleton width="200px" height="24px" />
        <div className="relative w-full" style={{ height: "250px" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton width="200px" height="200px" borderRadius="50%" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <Skeleton width="100px" height="16px" />
            <Skeleton width="80px" height="24px" />
          </div>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <Skeleton width="16px" height="16px" borderRadius="50%" />
              <Skeleton width="100px" height="16px" />
              <Skeleton width="60px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Creators' Credit Usage
      </h2>
      <div className="relative w-full" style={{ height: "250px" }}>
        <DonutChart
          data={chartData}
          withTooltip
          tooltipDataSource="segment"
          mx="auto"
          thickness={30}
          paddingAngle={2}
          size={250}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm font-medium text-gray-600">Total Credits</p>
          <p className="text-2xl font-bold text-gray-800">
            {totalCredits.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col space-y-2 text-sm">
        {chartData.map((creator, idx) => (
          <div key={idx} className="flex items-center">
            <div
              style={{ backgroundColor: creator.color }}
              className="h-3 w-3 rounded-full mr-2"
            ></div>
            <span className="font-medium text-gray-700">{creator.name}</span>
            <span className="ml-auto text-gray-600">
              {creator.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutStat;
