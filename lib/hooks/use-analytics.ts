import { useCallback, useEffect } from "react";
import useAnalyticsStore from "./use-analytics-store";
import { useUser } from "./use-user";
import { toast } from "sonner";

type TimeFilter = "today" | "lastWeek" | "lastMonth" | "lastYear";

export const useAnalytics = (creatorId: string, timeFilter: TimeFilter) => {
  const { data: user } = useUser();
  const store = useAnalyticsStore();

  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      await Promise.all([
        store.getAllSessions(user.id),
        store.getTotalLinkClicks(creatorId, user.id, timeFilter),
        store.getAllCreatorsTotalClicks(user.id, timeFilter),
        store.getCreatorConversionRate(creatorId, user.id, timeFilter),
        store.getAllCreatorsConversionRates(user.id, timeFilter),
        store.getAllCreatorsDMCount(user.id, timeFilter),
        store.getAllCreatorsTotalDMs(user.id, timeFilter),
        store.getAllCreatorsTotalGreetings(user.id, timeFilter),
        store.getAllCreatorsTotalFollowUps(user.id, timeFilter),
        store.getAllCreatorsCredits(user.id),
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to fetch analytics data");
    }
  }, [creatorId, timeFilter, user?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const startSession = useCallback(async () => {
    if (!user?.id) return;
    await store.startSession(creatorId, user.id);
  }, [creatorId, user?.id]);

  const createTrackableLink = useCallback(
    async (url: string) => {
      if (!user?.id) throw new Error("User not found");
      return await store.createTrackableLink(creatorId, url, user.id);
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
