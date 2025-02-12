import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createScheduleItem,
  deleteScheduleItem,
  getCreatorScheduleItem,
  getScheduleItem,
  updateScheduleItem,
} from "../supabase/action";
import { ScheduleItem } from "@prisma/client";

export const useScheduleItem = () => {
  const { mutateAsync: createSchedule, isPending: isCreatingScheduleItem } =
    useMutation({
      mutationFn: async (data: {
        scheduleName: string;
        scheduleStart: string;
        scheduleEnd: string;
        scheduleDays: number[];
        botSettingsId: string;
        timeZone: string;
        creatorId: string;
      }) => {
        toast.loading("Creating schedule item...");
        const res = await createScheduleItem(data);
        return res;
      },
      onSuccess: () => {
        toast.success("Schedule item created successfully");
      },
      onError: (error) => {
        toast.error("Error creating schedule item");
      },
      onSettled: () => {
        toast.dismiss();
      },
    });

  return { createSchedule, isCreatingScheduleItem };
};

export const useGetScheduleItem = (botSettingsId: string) => {
  const query = useQuery({
    queryKey: ["botSettings", botSettingsId],
    queryFn: () => getScheduleItem(botSettingsId),
  });

  return {
    schedule: query.data,
    isGettingScheduleItem: query.isLoading,
    isGettingScheduleItemError: query.error,
    refetchScheduleItem: query.refetch,
  };
};

export const useUpdateScheduleItem = () => {
  const { mutateAsync: updateSchedule, isPending: isUpdatingScheduleItem } =
    useMutation({
      mutationFn: async ({
        data,
        creatorId,
      }: {
        data: Partial<ScheduleItem>;
        creatorId: string;
      }) => {
        toast.loading("Updating schedule item...");
        const res = await updateScheduleItem(data, creatorId);
        return res;
      },
      onSuccess: () => {
        toast.success("Schedule item updated successfully");
      },
      onError: (error) => {
        toast.error("Error updating schedule item");
      },
      onSettled: () => {
        toast.dismiss();
      },
    });

  return { updateSchedule, isUpdatingScheduleItem };
};

export const useGetCreatorSchedules = (creatorId: string) => {
  const query = useQuery({
    queryKey: ["creatorSchedules", creatorId],
    queryFn: () => getCreatorScheduleItem(creatorId),
  });

  return {
    schedules: query.data,
    isGettingCreatorSchedules: query.isLoading,
    isGettingCreatorSchedulesError: query.error,
    refetchCreatorSchedules: query.refetch,
  };
};
export const useDeleteSchedule = () => {
  const {
    isPending,
    data,
    mutate: deleteSchedule,
  } = useMutation({
    mutationFn: async (deleteId: string) => {
      toast.loading("Deleting schedule item...");
      const res = await deleteScheduleItem(deleteId);
      return res;
    },
    onSuccess: () => {
      toast.success("Schedule item deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting schedule item");
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return {
    isDeletingSchedule: isPending,
    deleteSchedule,
    deletedSchedule: data,
  };
};
