import { create } from "zustand";
import { ScheduleItem } from "@prisma/client";
import {
  createScheduleItem,
  deleteScheduleItem,
  updateScheduleItem,
} from "../supabase/action";
import { toast } from "sonner";
import moment from "moment-timezone";

interface ScheduleStore {
  schedules: Partial<ScheduleItem>[];
  creatorId: string;
  isLoaded: boolean;
  setSchedules: (schedules: Partial<ScheduleItem>[]) => void;
  addSchedule: () => void;
  updateSchedule: (id: string, updates: Partial<ScheduleItem>) => void;
  cancelSchedule: (id: string) => void;
  deleteScheduleItem: (id: string) => void;
  saveSchedule: (schedule: Partial<ScheduleItem>, creatorId: string) => void;
  setCreatingNewSchedule: (isCreatingNewSchedule: boolean) => void;
  isCreatingNewSchedule: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  newScheduleId: string;
  setNewScheduleId: (id: string) => void;
  saveUpdateSchedule: (
    schedule: Partial<ScheduleItem>,
    creatorId: string
  ) => void;
  isDeletingSchedule: boolean;
  setIsDeletingSchedule: (isDeletingSchedule: boolean) => void;
  resetSettings: () => void;
}

const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  newScheduleId: "",
  isDeletingSchedule: false,
  setIsDeletingSchedule: (isDeletingSchedule) => set({ isDeletingSchedule }),
  creatorId: "",
  isLoaded: false,
  isCreatingNewSchedule: false,

  setSchedules: (schedules) => set({ schedules, isLoaded: true }),

  addSchedule: () => {
    const newId = `temp-${Date.now()}`;
    set((state) => ({
      schedules: [
        ...state.schedules,
        {
          id: newId,
          scheduleName: "",
          scheduleDays: [],
          scheduleStart: null,
          scheduleEnd: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          timeZone: "UTC", // Initialize with default timezone
          botSettingsId: "",
          isScheduleEnabled: true,
        },
      ],
      newScheduleId: newId,
    }));
    set({ isCreatingNewSchedule: true });
  },

  updateSchedule: (id, updates) => {
    console.log("Updating schedule:", id, updates);
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              ...updates,
              // Directly assign Date or null without parsing strings
              scheduleStart:
                updates.scheduleStart !== undefined
                  ? updates.scheduleStart
                  : schedule.scheduleStart,
              scheduleEnd:
                updates.scheduleEnd !== undefined
                  ? updates.scheduleEnd
                  : schedule.scheduleEnd,
            }
          : schedule
      ),
    }));
  },

  saveUpdateSchedule: async (
    schedule: Partial<ScheduleItem>,
    creatorId: string
  ) => {
    try {
      toast.loading("Updating schedule...");
      if (schedule.id) {
        const updatedSchedule: Partial<ScheduleItem> = {
          id: schedule.id,
          scheduleName: schedule.scheduleName || "",
          scheduleStart:
            schedule.scheduleStart instanceof Date
              ? moment(schedule.scheduleStart)
                  .tz(schedule.timeZone || "UTC")
                  .toDate()
              : null,
          scheduleEnd:
            schedule.scheduleEnd instanceof Date
              ? moment(schedule.scheduleEnd)
                  .tz(schedule.timeZone || "UTC")
                  .toDate()
              : null,
          scheduleDays: schedule.scheduleDays || [],
          updatedAt: new Date(),
          timeZone: schedule.timeZone || "UTC",
          botSettingsId: schedule.botSettingsId || "",
          isScheduleEnabled: schedule.isScheduleEnabled || false,
        };
        await updateScheduleItem(updatedSchedule, creatorId);
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === schedule.id ? { ...s, ...updatedSchedule } : s
          ),
        }));
        toast.success("Schedule updated successfully");
      } else {
        toast.error("Cannot update schedule: Missing ID");
      }
    } catch (error) {
      toast.error(`Error updating schedule: ${error}`);
    } finally {
      toast.dismiss();
    }
  },

  saveSchedule: async (schedule: Partial<ScheduleItem>, creatorId: string) => {
    try {
      toast.loading("Saving schedule...");
      const newSchedule = {
        scheduleName: schedule.scheduleName || "",
        scheduleStart:
          schedule.scheduleStart instanceof Date
            ? moment(schedule.scheduleStart)
                .tz(schedule.timeZone || "UTC")
                .toISOString()
            : moment()
                .tz(schedule.timeZone || "UTC")
                .startOf("day")
                .toISOString(),
        scheduleEnd:
          schedule.scheduleEnd instanceof Date
            ? moment(schedule.scheduleEnd)
                .tz(schedule.timeZone || "UTC")
                .toISOString()
            : moment()
                .tz(schedule.timeZone || "UTC")
                .endOf("day")
                .toISOString(),
        scheduleDays: schedule.scheduleDays || [],
        isScheduleEnabled: schedule.isScheduleEnabled || false,
        botSettingsId: schedule.botSettingsId || "",
        timeZone: schedule.timeZone || "UTC",
        creatorId: creatorId,
      };
      const savedSchedule = await createScheduleItem(newSchedule);
      set((state) => ({
        schedules: [
          ...state.schedules.filter((s) => s.id !== schedule.id),
          savedSchedule,
        ],
        newScheduleId: savedSchedule.id,
      }));
      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error(`Error saving schedule: ${error}`);
    } finally {
      toast.dismiss();
      set({ newScheduleId: "" });
      set({ isCreatingNewSchedule: false });
    }
  },

  cancelSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    }));
  },

  deleteScheduleItem: async (id) => {
    set({ isDeletingSchedule: true });
    await deleteScheduleItem(id);
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    }));
    toast.success("Schedule deleted successfully");
    set({ isDeletingSchedule: false });
  },

  resetSettings: () => {
    set({
      schedules: [],
      newScheduleId: "",
      isCreatingNewSchedule: false,
    });
  },
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setNewScheduleId: (id) => set({ newScheduleId: id }),
  setCreatingNewSchedule: (isCreatingNewSchedule) =>
    set({ isCreatingNewSchedule }),
}));

export default useScheduleStore;
