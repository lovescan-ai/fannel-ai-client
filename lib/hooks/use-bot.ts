import { toast } from "sonner";
import { BotSettings, CTASettings, FollowUpSettings } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getBotSettings,
  updateBot,
  getCreatorSettings,
  updateCreatorSettings,
} from "../supabase/action";

export const useUpdateBot = () => {
  const mutation = useMutation({
    mutationFn: async ({
      creatorId,
      data,
    }: {
      creatorId: string;
      data: Partial<BotSettings>;
    }) => {
      toast.loading("Updating bot settings");
      return await updateBot(creatorId, data);
    },
    onSettled: () => {
      toast.dismiss();
    },
    onError: () => {
      toast.error("Unable to update bot settings");
    },
    onSuccess: () => {
      toast.success("Bot settings updated successfully");
    },
  });

  return {
    updateBot: mutation.mutate,
    updatingBot: mutation.isPending,
    botUpdateError: mutation.error,
  };
};

export const useGetBot = (creatorId: string) => {
  const query = useQuery({
    queryKey: ["botSettings", creatorId],
    queryFn: () => getBotSettings(creatorId),
  });

  return {
    botSettings: query.data,
    botSettingsLoading: query.isLoading,
    botSettingsError: query.error,
    refetchBotSettings: query.refetch,
  };
};

export const useCreatorSettings = (creatorId: string) => {
  const query = useQuery({
    queryKey: ["creatorSettings", creatorId],
    queryFn: () => getCreatorSettings(creatorId),
  });

  return {
    creatorSettings: query.data,
    isLoadingSettings: query.isLoading,
    refetchCreatorSettings: query.refetch,
  };
};

export const useUpdateCreatorSettings = () => {
  const mutation = useMutation({
    mutationFn: async ({
      creatorId,
      ctaData,
      followUpData,
    }: {
      creatorId: string;
      ctaData: Partial<CTASettings>;
      followUpData: Partial<FollowUpSettings>;
    }) => {
      return await updateCreatorSettings(creatorId, ctaData, followUpData);
    },
    onError: () => {
      toast.error("Unable to update creator settings");
    },
    onSuccess: () => {
      toast.success("Creator settings updated successfully");
    },
  });

  return {
    creatorSettings: mutation.data,
    isUpdatingSettings: mutation.isPending,
    updateCreatorSettings: mutation.mutate,
  };
};
