import { useCallback, useEffect } from "react";
import useAnalyticsStore from "./use-analytics-store";
import { useUser } from "./use-user";
import { toast } from "sonner";
type TimeFilter = "today" | "lastWeek" | "lastMonth" | "lastYear";

export const useAnalytics = (creatorId: string, timeFilter: TimeFilter) => {
  const { data: user } = useUser();
  if (!user) {
    toast.error("User not found");
    return;
  }
  const store = useAnalyticsStore();

  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        store.getAllSessions(user?.id),
        store.getTotalLinkClicks(creatorId, timeFilter),
        store.getAllCreatorsTotalClicks(timeFilter),
        store.getCreatorConversionRate(creatorId, timeFilter),
        store.getAllCreatorsConversionRates(timeFilter),
        store.getAllCreatorsDMCount(user?.id, timeFilter),
        store.getAllCreatorsTotalDMs(user?.id, timeFilter),
        store.getAllCreatorsTotalGreetings(user?.id, timeFilter),
        store.getAllCreatorsTotalFollowUps(user?.id, timeFilter),
        store.getAllCreatorsCredits(user?.id),
      ]);
    } catch (error) {
    } finally {
    }
  }, [creatorId, timeFilter, user?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const startSession = useCallback(async () => {
    await store.startSession(creatorId, user?.id);
  }, [creatorId, user?.id]);

  const createTrackableLink = useCallback(
    async (url: string) => {
      return await store.createTrackableLink(creatorId, url, user?.id);
    },
    [creatorId, user?.id]
  );

  return {
    ...store,
    startSession,
    createTrackableLink,
    refetchData: fetchAllData,
  };
};
