import { useMutation } from "@tanstack/react-query";
import { getCreatorSettings, updateCreatorSettings } from "../supabase/action";
import { toast } from "sonner";
import { CTASettings, FollowUpSettings } from "@prisma/client";

export const useCreatorSettings = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: async (creatorId: string) => {
      const settings = await getCreatorSettings(creatorId);
      return settings;
    },
    onError: (error) => {
      toast.error(`Unable to get creator settings.`);
    },
  });

  return {
    creatorSettings: data,
    isLoadingSettings: isPending,
    getCreatorSettings: mutate,
  };
};

export const useUpdateCreatorSettings = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: async ({
      creatorId,
      ctaData,
      followUpData,
    }: {
      creatorId: string;
      ctaData: Partial<CTASettings>;
      followUpData: Partial<FollowUpSettings>;
    }) => {
      toast.loading("Updating creator settings...");
      const settings = await updateCreatorSettings(
        creatorId,
        ctaData,
        followUpData
      );
      return settings;
    },
    onSuccess: () => {
      toast.success("Successfully updated creator!");
    },
    onError: (error) => {
      toast.error(`Unable to get creator settings.`);
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return {
    creatorSettings: data,
    isUpdatingSettings: isPending,
    updateCreatorSettings: mutate,
  };
};
