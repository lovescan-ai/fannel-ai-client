import React, { useEffect, useState, useCallback } from "react";
import BotCardWrap from "./widgets/BotCardWrap";
import { Info, PlusIcon } from "lucide-react";
import { useGetBot } from "@/lib/hooks/use-bot";
import CircularPreloader from "@/components/ui/preloader";
import ScheduleItem from "./widgets/schedule-card";
import { useGetCreatorSchedules } from "@/lib/hooks/use-schedule-item";
import useScheduleStore from "@/lib/hooks/useScheduleStore";
import { ScheduleItem as ScheduleItemType } from "@prisma/client";
import BasicButton from "@/components/elements/buttons/BasicButton";
import MessageHeader from "./message-header";
import ScheduleSkeleton from "./widgets/schedule-loading";
import { toast } from "sonner";

const Schedule = ({ creatorId }: { creatorId: string }) => {
  const { botSettingsLoading } = useGetBot(creatorId);
  const { schedules: creatorSchedules, isGettingCreatorSchedules } =
    useGetCreatorSchedules(creatorId);
  const {
    schedules,
    isLoaded,
    setSchedules,
    addSchedule,
    setIsLoaded,
    newScheduleId,
    isCreatingNewSchedule,
    setCreatingNewSchedule,
  } = useScheduleStore();

  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (creatorSchedules && !isLoaded) {
      setSchedules(creatorSchedules);
      setIsLoaded(true);
    }
  }, [creatorSchedules, isLoaded, setSchedules, setIsLoaded]);

  const handleEditClick = (scheduleId: string) => {
    setEditingScheduleId(scheduleId);
  };

  const handleCancelEdit = useCallback(() => {
    setEditingScheduleId(null);
  }, []);

  const handleAddSchedule = () => {
    setCreatingNewSchedule(true);
    const isScheduleEmpty = schedules.filter(
      (schedule) =>
        !schedule.scheduleName &&
        !schedule.scheduleStart &&
        !schedule.scheduleEnd &&
        !schedule.scheduleDays
    );
    if (isScheduleEmpty) {
      toast.error("Please fill in all fields");
      return;
    }
    addSchedule();
  };

  const handleCancelCreate = useCallback(() => {
    setCreatingNewSchedule(false);
    //@ts-ignore
    setSchedules((prevSchedules: Partial<ScheduleItem>[]) =>
      prevSchedules.filter((s) => s.id !== newScheduleId)
    );
  }, [newScheduleId, setSchedules]);

  if (botSettingsLoading || isGettingCreatorSchedules) {
    return <ScheduleSkeleton />;
  }
  return (
    <div className="flex flex-col gap-5">
      {/* <CircularPreloader
        isLoading={botSettingsLoading || isGettingCreatorSchedules}
      /> */}
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex items-center space-x-2">
          <MessageHeader type="schedule" />
        </div>

        {schedules.map((schedule) =>
          editingScheduleId === schedule.id ||
          (isCreatingNewSchedule && newScheduleId === schedule.id) ? (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule as ScheduleItemType}
              botSettingsLoading={botSettingsLoading}
              creatorId={creatorId}
              onCancel={
                schedule.id === newScheduleId
                  ? handleCancelCreate
                  : handleCancelEdit
              }
            />
          ) : (
            <BotCardWrap key={schedule.id}>
              <div className="flex items-center justify-between w-full">
                <p className="mulish--semibold text-lg">
                  {schedule.scheduleName}
                </p>
                <div className="flex items-center space-x-2">
                  <BasicButton
                    width="w-fit hover:scale-90 duration-300 transition-all ease-in-out"
                    fontType="mulish--semibold"
                    textColor="text-brandBlue4x"
                    fontSize="text-md"
                    borderRadius="rounded-lg"
                    padding="py-2 px-7"
                    text="Edit"
                    bgColor="bg-brandBlue4x/10"
                    handleClick={() => handleEditClick(schedule.id ?? "")}
                  />
                </div>
              </div>
            </BotCardWrap>
          )
        )}
      </div>

      <button
        type="button"
        onClick={() => handleAddSchedule()}
        className="bg-brandBlue4x hover:bg-brandBlue4x/90 duration-300 transition-all ease-in-out text-white px-4 py-2 rounded-lg h-14 flex items-center justify-center"
      >
        <PlusIcon size={25} className="mr-2" />
        <p className="mulish--semibold text-lg">Add schedule</p>
      </button>
    </div>
  );
};

export default Schedule;
