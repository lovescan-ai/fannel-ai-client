This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

import React, { useEffect } from "react";
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import BotCardWrap from "./widgets/BotCardWrap";
import { PlusIcon } from "lucide-react";
import { useGetBot } from "@/lib/hooks/use-bot";
import CircularPreloader from "@/components/ui/preloader";
import ScheduleItem from "./widgets/schedule-card";
import { useGetCreatorSchedules } from "@/lib/hooks/use-schedule-item";
import useScheduleStore from "@/lib/hooks/useScheduleStore";
import { ScheduleItem as ScheduleItemType } from "@prisma/client";

const Schedule = ({ creatorId }: { creatorId: string }) => {
const { botSettingsLoading } = useGetBot(creatorId);
const { schedules: creatorSchedules, isGettingCreatorSchedules } =
useGetCreatorSchedules(creatorId);

const {
schedules,
settings,
isLoaded,
setSchedules,
addSchedule,
updateSettings,
setIsLoaded,
} = useScheduleStore();

useEffect(() => {
if (creatorSchedules && !isLoaded) {
setSchedules(creatorSchedules);
setIsLoaded(true);
}
}, [creatorSchedules, isLoaded, setSchedules, setIsLoaded]);

useEffect(() => {
if (schedules.length > 0) {
const lastSchedule = schedules[schedules.length - 1];
if (lastSchedule.timeZone !== settings.timeZone) {
updateSettings({
timeZone: lastSchedule.timeZone,
});
}
}
}, [schedules, settings.timeZone]);

const handleTimezoneChange = (selectedTimezone: ITimezone) => {
updateSettings({
timeZone:
typeof selectedTimezone === "string"
? selectedTimezone
: selectedTimezone.value,
});
};

return (
<div className="flex flex-col gap-5">
<CircularPreloader
isLoading={botSettingsLoading || isGettingCreatorSchedules}
/>

      <div>
        <p className="mulish--semibold text-lg">Time zone</p>
        <BotCardWrap>
          <TimezoneSelect
            styles={{ container: (base) => ({ ...base, width: "100%" }) }}
            className="w-full"
            value={{
              value: settings.timeZone ?? "UTC",
              label: settings.timeZone ?? "UTC",
            }}
            onChange={handleTimezoneChange}
          />
        </BotCardWrap>
      </div>

      {schedules.map((schedule) => {
        return (
          <ScheduleItem
            key={schedule.id}
            schedule={schedule as ScheduleItemType}
            botSettingsLoading={botSettingsLoading}
            creatorId={creatorId}
          />
        );
      })}

      <button
        type="button"
        onClick={addSchedule}
        className="bg-brandBlue4x hover:bg-brandBlue4x/90 duration-300 transition-all ease-in-out text-white px-4 py-2 rounded-lg h-14 flex items-center justify-center"
      >
        <PlusIcon size={25} />
      </button>
    </div>

);
};

export default Schedule;
