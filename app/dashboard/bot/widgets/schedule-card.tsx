import React, { useCallback, useMemo } from "react";
import BotCardWrap from "./BotCardWrap";
import FormSwitch2 from "@/components/elements/form/FormSwitch2";
import BasicButton from "@/components/elements/buttons/BasicButton";
import { Loader, Trash } from "lucide-react";
import { ScheduleItem as ScheduleItemType } from "@prisma/client";
import useScheduleStore from "@/lib/hooks/useScheduleStore";
import StylishTimeInput from "./stylelish-input";
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import moment from "moment-timezone";

const DAYS_OF_WEEK = [
  { id: "sunday", day: 0, longDay: "Sunday", shortDay: "Sun" },
  { id: "monday", day: 1, longDay: "Monday", shortDay: "Mon" },
  { id: "tuesday", day: 2, longDay: "Tuesday", shortDay: "Tue" },
  { id: "wednesday", day: 3, longDay: "Wednesday", shortDay: "Wed" },
  { id: "thursday", day: 4, longDay: "Thursday", shortDay: "Thur" },
  { id: "friday", day: 5, longDay: "Friday", shortDay: "Fri" },
  { id: "saturday", day: 6, longDay: "Saturday", shortDay: "Sat" },
];

interface ScheduleItemProps {
  schedule: ScheduleItemType;
  botSettingsLoading: boolean;
  creatorId: string;
  onCancel: () => void;
}

const ScheduleItem = React.memo(function ScheduleItem({
  schedule,
  botSettingsLoading,
  creatorId,
  onCancel,
}: ScheduleItemProps) {
  const {
    updateSchedule,
    saveUpdateSchedule,
    deleteScheduleItem,
    saveSchedule,
    isDeletingSchedule,
  } = useScheduleStore();

  const handleChange = useCallback(
    (name: string, value: any) => {
      updateSchedule(schedule.id, { [name]: value });
    },
    [schedule.id, updateSchedule]
  );

  const handleSaveUpdateSchedule = useCallback(() => {
    if (schedule.id.startsWith("cm")) {
      saveUpdateSchedule(schedule, creatorId);
    } else {
      saveSchedule(schedule, creatorId);
    }
  }, [schedule, creatorId, saveUpdateSchedule, saveSchedule]);

  const toggleDaySelection = useCallback(
    (day: number) => {
      updateSchedule(schedule.id, {
        scheduleDays: schedule.scheduleDays.includes(day)
          ? schedule.scheduleDays.filter((d) => d !== day)
          : [...schedule.scheduleDays, day],
      });
    },
    [schedule, updateSchedule]
  );

  const handleDelete = useCallback(async () => {
    deleteScheduleItem(schedule.id);
  }, [deleteScheduleItem, schedule.id]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const memoizedDaysOfWeek = useMemo(
    () =>
      DAYS_OF_WEEK.filter((day) => schedule.scheduleDays?.includes(day.day))
        .map((day) => day.shortDay)
        .join(", "),
    [schedule.scheduleDays]
  );

  const dayButtons = useMemo(
    () =>
      DAYS_OF_WEEK.map((sch) => (
        <button
          key={sch.day}
          type="button"
          onClick={() => toggleDaySelection(sch.day)}
          title={`${sch.longDay} : ${
            schedule.scheduleDays.includes(sch.day)
              ? "Selected"
              : "Not Selected"
          }`}
          className={`${
            schedule.scheduleDays.includes(sch.day)
              ? "bg-brandBlue4x text-white"
              : "bg-brandBlue4x/15 text-brandBlue4x"
          } mulish--regular text-2xl w-10 h-10 text-center rounded-full aspect-square flex flex-row items-center justify-center cursor-pointer transition-colors duration-300`}
        >
          {sch.longDay.charAt(0)}
        </button>
      )),
    [schedule.scheduleDays, toggleDaySelection]
  );

  return (
    <BotCardWrap padding="pb-0" noFlex>
      <div className="bg-white rounded-t-10">
        <div className="w-full p-2 bg-brandBlue4x/10 rounded-t-10 flex items-center justify-between space-x-4">
          <input
            type="text"
            name="scheduleName"
            id="scheduleName"
            value={schedule.scheduleName || ""}
            onChange={(e) => handleChange("scheduleName", e.target.value)}
            placeholder="Name"
            className="w-full bg-white p-3 rounded-lg border-none focus:outline-none focus:border-none focus:ring-0"
          />
          <div
            className="w-12 h-12 flex items-center justify-center bg-white rounded-md cursor-pointer"
            onClick={handleDelete}
          >
            {isDeletingSchedule ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Trash className={"text-red-500 w-6 h-6"} />
            )}
          </div>
        </div>
        <div className="px-4">
          <BotCardWrap
            bgColor="bg-transparent"
            shadow=" "
            padding="py-4"
            borderRadius="rounded-none"
            border="border-b-1 border-b-brandGray30x"
          >
            <div className="flex flex-row justify-between w-full gap-1.5 items-center">
              <p className="mulish--semibold text-lg">Schedule mode</p>
              <FormSwitch2
                fieldsetId={`scheduleSwitch-${schedule.id}`}
                selfEnd
                value={schedule.isScheduleEnabled.toString()}
                switchChecked={schedule.isScheduleEnabled}
                switchId={`makeSchedule-${schedule.id}`}
                switchName="isScheduleEnabled"
                handleChange={(name, value) => handleChange(name, value)}
              />
            </div>
          </BotCardWrap>

          {/* Added Per-Schedule Timezone Selection */}
          <BotCardWrap
            bgColor="bg-transparent"
            shadow=" "
            padding="py-4"
            borderRadius="rounded-none"
            border="border-b-1 border-b-brandGray30x"
          >
            <p className="mulish--semibold text-lg">Time Zone</p>
            <TimezoneSelect
              styles={{ container: (base) => ({ ...base, width: "50%" }) }}
              className="w-full"
              value={{
                value: schedule.timeZone || "UTC",
                label: schedule.timeZone || "UTC",
              }}
              onChange={(selectedTimezone) => {
                const timezone =
                  typeof selectedTimezone === "string"
                    ? selectedTimezone
                    : selectedTimezone.value;
                handleChange("timeZone", timezone);
              }}
            />
          </BotCardWrap>

          {/* From Time Input */}
          <BotCardWrap
            bgColor="bg-transparent"
            shadow=" "
            padding="py-4"
            borderRadius="rounded-none"
            border="border-b-1 border-b-brandGray30x"
          >
            <p>From</p>
            <StylishTimeInput
              value={
                schedule.scheduleStart
                  ? moment(schedule.scheduleStart)
                      .tz(schedule.timeZone || "UTC")
                      .format("HH:mm")
                  : ""
              }
              onChange={(name, value) => {
                if (value) {
                  // Parse the input time in the schedule's timezone and convert to UTC
                  const updatedTime = moment
                    .tz(value, "HH:mm", schedule.timeZone || "UTC")
                    .toDate();
                  handleChange(name, updatedTime);
                } else {
                  handleChange(name, null);
                }
              }}
              name="scheduleStart"
            />
          </BotCardWrap>

          {/* To Time Input */}
          <BotCardWrap
            bgColor="bg-transparent"
            shadow=" "
            padding="py-4"
            borderRadius="rounded-none"
            border="border-b-1 border-b-brandGray30x"
          >
            <p>To</p>
            <StylishTimeInput
              value={
                schedule.scheduleEnd
                  ? moment(schedule.scheduleEnd)
                      .tz(schedule.timeZone || "UTC")
                      .format("HH:mm")
                  : ""
              }
              onChange={(name, value) => {
                if (value) {
                  // Parse the input time in the schedule's timezone and convert to UTC
                  const updatedTime = moment
                    .tz(value, "HH:mm", schedule.timeZone || "UTC")
                    .toDate();
                  handleChange(name, updatedTime);
                } else {
                  handleChange(name, null);
                }
              }}
              name="scheduleEnd"
            />
          </BotCardWrap>

          <div className="overflow-x-auto w-full">
            <div className="py-4 flex flex-row items-center gap-4 mx-auto w-fit">
              {dayButtons}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-brandBlue4x/10 rounded-b-10 p-4 flex items-center justify-between">
        <p className="text-brandBlue4x mulish--semibold text-sm">
          Every, {memoizedDaysOfWeek}
        </p>
        <div className="flex items-center space-x-2">
          <BasicButton
            width="w-fit hover:scale-90 duration-300 transition-all ease-in-out"
            fontType="mulish--semibold"
            textColor="text-brandBlue4x"
            fontSize="text-sm"
            borderRadius="rounded-full border-1 border-brandBlue4x"
            padding="py-2.5 px-7"
            text="Cancel"
            bgColor="bg-white"
            handleClick={handleCancel}
          />
          <BasicButton
            width="w-fit hover:scale-90 duration-300 transition-all ease-in-out"
            fontType="mulish--semibold"
            textColor="text-white"
            fontSize="text-sm"
            borderRadius="rounded-full"
            padding="py-2.5 px-7"
            text="Save"
            bgColor="bg-brandBlue4x"
            handleClick={handleSaveUpdateSchedule}
            disabled={botSettingsLoading}
          />
        </div>
      </div>
    </BotCardWrap>
  );
});

export default ScheduleItem;
