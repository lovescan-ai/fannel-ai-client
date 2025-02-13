import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCreator,
  creatorList,
  deleteCreator,
  getAllCreators,
  getCreator,
  getOrCreateDubLink,
  updateCreator,
} from "../supabase/action";
import React, { useEffect } from "react";
import { Creator, Gender } from "@prisma/client";
import { toast } from "sonner";
import { InferSubscription, useRealtimeSubscription } from "./use-subscription";
import useReadUser from "./use-read-user";

export const useGetCreator = () => {
  const { user } = useReadUser();
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async () => {
      const creator = await getCreator(user?.id as string);
      return creator;
    },
  });

  useEffect(() => {
    if (user) {
      mutate();
    }
  }, []);
  return {
    getCreator: mutate,
    creator: data,
    getCreatorLoading: isPending,
    getCreatorError: error,
  };
};

async function checkCredits(
  subscription: InferSubscription,
  maxCredits: number
) {
  const creditRemaining =
    subscription?.credits - (subscription?.usedCredits || 0);
  if (maxCredits > creditRemaining) {
    toast.error("You don't have enough credits");
    return;
  }
}
export const useCreateCreator = () => {
  const { user } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id);
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async (creator: {
      creatorName: string;
      userId: string;
      gender?: Gender;
      onlyfansUrl?: string;
      instagramAccessToken?: string;
      profileImageUrl?: string;
      maxCredit?: number;
    }) => {
      const creators = await getAllCreators(user?.id as string);
      const hasFullyOnboardedCreator = creators.some(
        (creator) =>
          creator.connectedInstagram &&
          creator.name &&
          creator.gender &&
          creator.onlyFansUrl
      );

      const loadingToast = toast.loading("Adding a new creator");
      try {
        // ignore check if creator is not fully onboarded
        if (
          hasFullyOnboardedCreator &&
          subscription?.plan !== "tier-small-agencies" &&
          subscription?.plan !== "tier-agencies"
        ) {
          toast.warning("You can't add a creator, please subscribe");
          return;
        }
        await checkCredits(
          subscription as InferSubscription,
          creator.maxCredit || 0
        );
        const newCreator = await createCreator(creator);
        toast.dismiss(loadingToast);
        return newCreator;
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
      } finally {
        toast.dismiss();
      }
    },

    onSuccess() {
      toast.success("Creator added successfully");
    },
    onError() {
      toast.error("Failed to add creator");
    },
  });

  return {
    addCreator: mutate,
    data,
    isPending,
    error,
  };
};

export const useViewCreators = () => {
  const {
    data: creators,
    isPending: isLoading,
    error,
    refetch: refetchCreators,
  } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const creators = await creatorList();
      return creators;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  return {
    creators,
    isLoading,
    error,
    refetchCreators,
  };
};

export const useUpdateCreator = () => {
  const { user } = useReadUser();
  const { subscription } = useRealtimeSubscription(user?.id);

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async ({
      creatorId,
      data,
    }: {
      creatorId: string;
      data: Partial<Creator>;
    }) => {
      toast.loading("Updating creator");

      if (subscription) {
        await checkCredits(
          subscription as InferSubscription,
          data.maxCredit || 0
        );
      }
      const creator = await updateCreator(creatorId, data);

      toast.success("Creator updated successfully");
      return creator;
    },

    onError() {
      toast.error("Failed to update creator");
    },
    onSettled() {
      toast.dismiss();
    },
  });

  return {
    mutate,
    data,
    isPending,
    error,
  };
};

export const useDeleteCreator = () => {
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async (creatorId: string) => {
      const loadingToast = toast.loading("Deleting creator");
      const creator = await deleteCreator(creatorId);
      toast.dismiss(loadingToast);
      return creator;
    },
    onSuccess() {
      window.location.reload();
      toast.success("Creator deleted successfully");
    },
    onError() {
      toast.error("Failed to delete creator");
    },
    onSettled() {
      toast.dismiss();
    },
  });

  return {
    deleteCreator: mutate,
    data,
    isPending,
    error,
  };
};
