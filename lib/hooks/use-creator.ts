import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCreator,
  createDubLink,
  creatorList,
  getCreator,
  updateCreator,
} from "../supabase/action";
import React, { useEffect } from "react";
import { Creator, Gender } from "@prisma/client";
import { toast } from "sonner";
import { useRealtimeSubscription } from "./use-subscription";
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
      const loadingToast = toast.loading("Adding a new creator");
      try {
        // if (subscription?.plan !== "tier-small-agencies") {
        //   toast.dismiss(loadingToast);
        //   toast.error("You can't add a creator");
        //   throw new Error("You can't add a creator");
        // }
        const newCreator = await createCreator(creator);
        toast.dismiss(loadingToast);
        return newCreator;
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
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
  });

  return {
    creators,
    isLoading,
    error,
    refetchCreators,
  };
};

export const useUpdateCreator = () => {
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: async ({
      creatorId,
      data,
    }: {
      creatorId: string;
      data: Partial<Creator>;
    }) => {
      if (data.onlyFansUrl) {
        const link = await createDubLink(data.onlyFansUrl);
        data.onlyFansUrl = link.url;
      }
      const creator = await updateCreator(creatorId, data);
      return creator;
    },

    onSuccess() {
      toast.success("Creator updated successfully");
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
