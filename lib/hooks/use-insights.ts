import create from "zustand";

interface InsightData {
  totalDMs: number;
  totalGreetings: number;
  totalFollowUps: number;
  totalSessions: number;
  usedCredits: number;
  totalCTAs: number;
  totalRepliedMessages: number;
  averageResponseTimeInSeconds: number;
  totalClicks: number;
  conversionRatePercentage: number;
}

interface InsightsState {
  insights: InsightData | null;
  isLoading: boolean;
  error: string | null;
  fetchInsights: (
    creatorId: string,
    period: "day" | "week" | "month" | "year"
  ) => Promise<void>;
}

const useInsights = create<InsightsState>((set) => ({
  insights: null,
  isLoading: false,
  error: null,
  fetchInsights: async (
    creatorId: string,
    period: "day" | "week" | "month" | "year" = "month"
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `/api/insights/${creatorId}?period=${period}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }
      const data: InsightData = await response.json();
      set({ insights: data, isLoading: false });
    } catch (error) {
      set({ error: error as string, isLoading: false });
    }
  },
}));

export default useInsights;
