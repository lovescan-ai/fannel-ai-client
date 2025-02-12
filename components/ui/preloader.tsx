import React from "react";

interface PreloaderProps {
  isLoading: boolean;
}

const CircularPreloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    </div>
  );
};

export default CircularPreloader;
