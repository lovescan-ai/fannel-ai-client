import create from "zustand";
import apiClient from "@/utils/axios";

interface CreatorSession {
  id: string;
  name: string;
  totalSessions: number;
}

interface ConversionRate {
  creatorId: string;
  creatorName: string;
  totalLinksSent: number;
  totalClicks: number;
  conversionRate: number;
  timeFilter?: string;
}

interface CreatorLink {
  id: string;
  linkId: string;
  createdAt: string;
  clicks: number;
  shortLink: string;
}

type TimeFilter = "today" | "lastWeek" | "lastMonth" | "lastYear";

interface AnalyticsStore {
  totalSessions: number | null;
  allSessions: CreatorSession[];
  creatorLinks: CreatorLink[];
  totalClicks: number | null;
  allCreatorsCredits: { id: string; name: string; credits: number }[];
  allCreatorsTotalClicks: { id: string; name: string; totalClicks: number }[];
  conversionRate: ConversionRate | null;
  allConversionRates: ConversionRate[];
  allCreatorsDMCount: { id: string; name: string; dmCount: number }[];
  allCreatorsTotalDMs: { id: string; name: string; totalDMs: number }[];
  allCreatorsTotalGreetings: {
    id: string;
    name: string;
    totalGreetings: number;
  }[];
  allCreatorsTotalFollowUps: {
    id: string;
    name: string;
    totalFollowUps: number;
  }[];
  isLoading: boolean;
  error: string | null;

  startSession: (creatorId: string, userId: string) => Promise<void>;
  getTotalSessions: (creatorId: string, userId: string) => Promise<void>;
  getAllCreatorsCredits: (userId: string) => Promise<void>;
  getAllSessions: (userId: string) => Promise<void>;
  createTrackableLink: (
    creatorId: string,
    url: string,
    userId: string
  ) => Promise<string>;
  getTotalLinkClicks: (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getCreatorLinks: (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsTotalClicks: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getCreatorConversionRate: (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsConversionRates: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsDMCount: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsTotalDMs: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsTotalGreetings: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
  getAllCreatorsTotalFollowUps: (
    userId: string,
    timeFilter?: TimeFilter
  ) => Promise<void>;
}

const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  totalSessions: null,
  allSessions: [],
  creatorLinks: [],
  allCreatorsCredits: [],
  totalClicks: null,
  allCreatorsTotalClicks: [],
  conversionRate: null,
  allConversionRates: [],
  allCreatorsDMCount: [],
  allCreatorsTotalDMs: [],
  allCreatorsTotalGreetings: [],
  allCreatorsTotalFollowUps: [],
  isLoading: false,
  error: null,

  startSession: async (creatorId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post(`/analytics/${creatorId}/start-session`, null, {
        params: { userId },
      });
    } catch (error) {
      set({ error: "Failed to start session" });
    } finally {
      set({ isLoading: false });
    }
  },

  getTotalSessions: async (creatorId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        `/analytics/${creatorId}/total-sessions`,
        {
          params: { userId },
        }
      );
      set({ totalSessions: response.data.totalSessions });
    } catch (error) {
      set({ error: "Failed to get total sessions" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllSessions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/analytics/all-sessions", {
        params: { userId },
      });
      set({ allSessions: response.data.allSessions });
    } catch (error) {
      set({ error: "Failed to get all sessions" });
    } finally {
      set({ isLoading: false });
    }
  },

  createTrackableLink: async (
    creatorId: string,
    url: string,
    userId: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(
        `/analytics/${creatorId}/create-link`,
        { url },
        { params: { userId } }
      );
      return response.data.shortLink;
    } catch (error) {
      set({ error: "Failed to create trackable link" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getTotalLinkClicks: async (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        `/analytics/${creatorId}/total-clicks`,
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ totalClicks: response.data.totalClicks });
    } catch (error) {
      set({ error: "Failed to get total link clicks" });
    } finally {
      set({ isLoading: false });
    }
  },

  getCreatorLinks: async (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/analytics/${creatorId}/links`, {
        params: { userId, ...(timeFilter && { timeFilter }) },
      });
      set({ creatorLinks: response.data.links });
    } catch (error) {
      set({ error: "Failed to get creator links" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsTotalClicks: async (
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        "/analytics/all-creators-total-clicks",
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ allCreatorsTotalClicks: response.data.creatorsWithClicks });
    } catch (error) {
      set({ error: "Failed to get all creators total clicks" });
    } finally {
      set({ isLoading: false });
    }
  },

  getCreatorConversionRate: async (
    creatorId: string,
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        `/analytics/${creatorId}/conversion-rate`,
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ conversionRate: response.data });
    } catch (error) {
      set({ error: "Failed to get creator conversion rate" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsConversionRates: async (
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        "/analytics/all-creators-conversion-rates",
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ allConversionRates: response.data.conversionRates });
    } catch (error) {
      set({ error: "Failed to get all creators conversion rates" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsDMCount: async (userId: string, timeFilter?: TimeFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/analytics/all-creators-dm-count", {
        params: { userId, ...(timeFilter && { timeFilter }) },
      });
      set({ allCreatorsDMCount: response.data.dmCounts });
    } catch (error) {
      set({ error: "Failed to get all creators DM count" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsTotalDMs: async (userId: string, timeFilter?: TimeFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        "/analytics/all-creators-total-dms",
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      console.log("> All creators total DMs", response.data.dmCounts);
      set({ allCreatorsTotalDMs: response.data.dmCounts });
    } catch (error) {
      set({ error: "Failed to get all creators total DMs" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsTotalGreetings: async (
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        "/analytics/all-creators-total-greetings",
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ allCreatorsTotalGreetings: response.data.greetingCounts });
    } catch (error) {
      set({ error: "Failed to get all creators total greetings" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsTotalFollowUps: async (
    userId: string,
    timeFilter?: TimeFilter
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        "/analytics/all-creators-total-followups",
        {
          params: { userId, ...(timeFilter && { timeFilter }) },
        }
      );
      set({ allCreatorsTotalFollowUps: response.data.followUpCounts });
    } catch (error) {
      set({ error: "Failed to get all creators total follow-ups" });
    } finally {
      set({ isLoading: false });
    }
  },

  getAllCreatorsCredits: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/analytics/all-creators-credits", {
        params: { userId },
      });
      set({ allCreatorsCredits: response.data.creatorCredits });
    } catch (error) {
      set({ error: "Failed to get all creators credits" });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAnalyticsStore;
