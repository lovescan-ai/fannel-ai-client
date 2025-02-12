import { useCallback, useEffect } from "react";
import useAnalyticsStore from "./use-analytics-store";

type TimeFilter = "today" | "lastWeek" | "lastMonth" | "lastYear";

export const useAnalytics = (creatorId: string, timeFilter: TimeFilter) => {
  const store = useAnalyticsStore();

  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        store.getAllSessions(),
        store.getTotalLinkClicks(creatorId, timeFilter),
        store.getAllCreatorsTotalClicks(timeFilter),
        store.getCreatorConversionRate(creatorId, timeFilter),
        store.getAllCreatorsConversionRates(timeFilter),
        store.getAllCreatorsDMCount(timeFilter),
        store.getAllCreatorsTotalDMs(timeFilter),
        store.getAllCreatorsTotalGreetings(timeFilter),
        store.getAllCreatorsTotalFollowUps(timeFilter),
        store.getAllCreatorsCredits(),
      ]);
    } catch (error) {
    } finally {
    }
  }, [creatorId, timeFilter]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const startSession = useCallback(async () => {
    await store.startSession(creatorId);
  }, [creatorId]);

  const createTrackableLink = useCallback(
    async (url: string) => {
      return await store.createTrackableLink(creatorId, url);
    },
    [creatorId]
  );

  return {
    ...store,
    startSession,
    createTrackableLink,
    refetchData: fetchAllData,
  };
};
