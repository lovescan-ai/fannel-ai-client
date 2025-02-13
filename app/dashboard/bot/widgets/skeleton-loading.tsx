"use client";

import React from "react";
import BotCardWrap from "./BotCardWrap";
const SkeletonGeneral = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Activate Bot Skeleton */}
      <BotCardWrap>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded-full w-12"></div>
      </BotCardWrap>

      {/* Auto Respond To Skeleton */}
      <BotCardWrap>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </BotCardWrap>

      {/* Settings Group Skeleton */}
      <BotCardWrap noFlex>
        {/* Message Delay */}
        <div className="flex justify-between items-center py-3 border-b border-black/15">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Greeting Message */}
        <div className="flex justify-between items-center py-3 border-b border-black/15">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Follow Up Message */}
        <div className="flex justify-between items-center py-3 border-b border-black/15">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Interaction Setting */}
        <div className="flex justify-between items-center py-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Save Button Skeleton */}
        <div className="flex justify-end pt-4">
          <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </BotCardWrap>
    </div>
  );
};

export default SkeletonGeneral;
