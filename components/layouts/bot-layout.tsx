"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewCreators } from "@/lib/hooks/use-creator";
import Skeleton from "@/components/ui/skeleton";
import { ChevronDownIcon } from "lucide-react";
import General from "@/app/dashboard/bot/General";
import Customization from "@/app/dashboard/bot/Customization";
import Schedule from "@/app/dashboard/bot/Schedule";
import DashBody from "@/app/dashboard/widgets/DashBody";

const BotLayout = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(
    null
  );
  const { creators, isLoading: creatorsLoading } = useViewCreators();

  const tabs = [
    { id: "general", name: "General", component: General },
    { id: "customization", name: "Customization", component: Customization },
    { id: "schedule", name: "Schedule", component: Schedule },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  useEffect(() => {
    if (creators && creators.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(creators[0].id);
    }
  }, [creators]);

  const renderSkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <Skeleton height="60px" width="200px" />
      <Skeleton height="60px" />
      <div className="flex space-x-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="60px" width="33%" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="40px" />
        ))}
      </div>
    </div>
  );

  if (creatorsLoading) {
    return (
      <DashBody bgColor="white" hideOverflow={false} padding="p-4">
        <div className="lg:py-10 py-3 max-w-xl w-full mx-auto flex flex-col gap-6 mulish--regular">
          {renderSkeletonLoader()}
        </div>
      </DashBody>
    );
  }

  return (
    <DashBody bgColor="white" hideOverflow={false} padding="p-4">
      <div className="lg:py-10 py-3 max-w-xl w-full mx-auto flex flex-col gap-6 mulish--regular">
        <h1 className="mulish--bold text-4xl text-left text-brandDarkPurple1x">
          AI Bot
        </h1>

        <div className="mb-6">
          <label
            htmlFor="creator-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Creator
          </label>
          <div className="relative">
            <select
              id="creator-select"
              value={selectedCreatorId || ""}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="appearance-none block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandBlue4x focus:border-brandBluering-brandBlue4x transition duration-150 ease-in-out"
            >
              {creators && creators.length > 0 ? (
                creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.name}
                  </option>
                ))
              ) : (
                <option>No creators available</option>
              )}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {creators && creators.length === 0 && (
            <p className="mt-2 text-sm text-red-600">
              No creators found. Please add a creator first.
            </p>
          )}
        </div>

        <div className="flex items-center pb-4">
          <div className="flex flex-row overflow-x-auto w-full mulish--semibold md:grid grid-cols-3 gap-2 mx-auto p-2 bg-brandLightBlue4x max-w-xl text-black rounded-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-brandBlue4x text-white"
                    : "bg-transparent"
                } hover:bg-brandBlue4x hover:text-white text-black active:translate-y-1 hover:drop-shadow-md transition-all ease-in-out duration-300 rounded-10 px-4 md:px-6 py-2`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCreatorId ? (
          <AnimatePresence mode="wait" key={selectedCreatorId}>
            <motion.div
              key={`${activeTab}-${selectedCreatorId}`}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {tabs.map(
                (tab) =>
                  activeTab === tab.id && (
                    <tab.component
                      key={`${tab.id}-${selectedCreatorId}`}
                      creatorId={selectedCreatorId}
                    />
                  )
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center text-gray-500">
            Please select a creator to manage the bot settings.
          </div>
        )}
      </div>
    </DashBody>
  );
};

export default BotLayout;
