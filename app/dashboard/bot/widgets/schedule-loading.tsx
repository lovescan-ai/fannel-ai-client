import React from "react";

const ScheduleSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Schedule Items Skeleton */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <div key={item} className="border rounded-lg p-4 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}

      <div className="h-14 w-full bg-gray-200 rounded-lg"></div>
    </div>
  );
};

export default ScheduleSkeleton;
