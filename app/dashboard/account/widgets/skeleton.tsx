import { getGradientColor } from "@/lib/utils";

const SkeletonLoader = () => {
  return (
    <>
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="rounded-lg shadow-md flex gap-4 sm:flex-row sm:gap-6 justify-between w-full p-4 sm:p-6 relative overflow-hidden bg-white animate-pulse"
        >
          <div
            className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${getGradientColor(
              idx
            )}`}
          ></div>
          <div className="flex flex-row gap-3 sm:gap-4 items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between sm:flex-row items-center gap-2 sm:gap-3">
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
