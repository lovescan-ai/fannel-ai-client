"use client";

import React, { useState, useEffect } from "react";
import DashBody from "../widgets/DashBody";
import DonutStat from "./widgets/DonutStat";
import PerFeatureAnalytics from "./widgets/PerFeatureAnalytics";
import SimpleStatCard from "./widgets/SimpleStatCard";
import { useAnalytics } from "@/lib/hooks/use-analytics";
import UserSubBarChart from "./widgets/UserSubBarChart";

type TimeFilter = "today" | "lastWeek" | "lastMonth" | "lastYear";

const AnalyticsPage: React.FC = () => {
  const [currentDuration, setCurrentDuration] = useState<TimeFilter>("today");
  const creatorId = "";

  const {
    allSessions,
    totalClicks,
    conversionRate,
    allCreatorsTotalClicks,
    allConversionRates,
    allCreatorsDMCount,
    allCreatorsTotalDMs,
    allCreatorsTotalGreetings,
    allCreatorsTotalFollowUps,
    allCreatorsCredits,
    isLoading,
    refetchData,
  } = useAnalytics(creatorId, currentDuration);

  useEffect(() => {
    refetchData();
  }, [currentDuration, refetchData]);

  const durations: { id: TimeFilter; name: string }[] = [
    {
      id: "today",
      name: "Today",
    },
    {
      id: "lastWeek",
      name: "Last week",
    },
    {
      id: "lastMonth",
      name: "Last month",
    },
    {
      id: "lastYear",
      name: "Last year",
    },
  ];
  console.log(
    "> All creators total clicks",
    allCreatorsTotalClicks,
    totalClicks,
    conversionRate
  );

  const simpleStats = [
    {
      id: "totalSessions",
      header: "Total Sessions",
      stat: allSessions
        ? allSessions.reduce((acc, curr) => acc + curr.totalSessions, 0)
        : 0,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.49935 18.3333H12.4993C16.666 18.3333 18.3327 16.6666 18.3327 12.5V7.49996C18.3327 3.33329 16.666 1.66663 12.4993 1.66663H7.49935C3.33268 1.66663 1.66602 3.33329 1.66602 7.49996V12.5C1.66602 16.6666 3.33268 18.3333 7.49935 18.3333Z"
            fill="#496AEB"
            stroke="#496AEB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.10742 12.075L8.09076 9.50005C8.37409 9.13338 8.89909 9.06672 9.26576 9.35005L10.7908 10.55C11.1574 10.8334 11.6824 10.7667 11.9658 10.4084L13.8908 7.92505"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      data: allSessions.map((creator) => ({
        date: creator.name,
        Value: creator.totalSessions,
      })),
    },
    {
      id: "linkClicked",
      header: "Link Clicked",
      stat: totalClicks || 0,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5137 19.8283L13.095 16.4102L11.4379 18.0673C11.2948 18.2104 11.0871 18.2693 10.8891 18.2235C10.6912 18.1766 10.5321 18.0313 10.468 17.8385L7.15324 7.89466C7.08285 7.68408 7.13777 7.45177 7.29457 7.29498C7.45078 7.13876 7.68367 7.08154 7.89426 7.15365L17.838 10.4684C18.0309 10.5325 18.1762 10.6916 18.2231 10.8895C18.2695 11.087 18.2105 11.2947 18.0669 11.4383L16.4098 13.0954L19.8279 16.514C20.0568 16.7429 20.0568 17.1137 19.8279 17.3426L17.3422 19.8283C17.1133 20.0572 16.7425 20.0572 16.5137 19.8283Z"
            fill="#496AEB"
          />
          <path
            d="M7.61719 4.6875C7.29332 4.6875 7.03125 4.42543 7.03125 4.10156V0.585938C7.03125 0.26207 7.29332 0 7.61719 0C7.94105 0 8.20312 0.26207 8.20312 0.585938V4.10156C8.20312 4.42543 7.94105 4.6875 7.61719 4.6875Z"
            fill="#496AEB"
          />
          <path
            d="M4.71649 5.54578L2.23024 3.05953C2.00138 2.83066 2.00138 2.45984 2.23024 2.23098C2.45911 2.00211 2.82993 2.00211 3.0588 2.23098L5.54501 4.71719C5.77388 4.94605 5.77388 5.31687 5.54501 5.54574C5.31614 5.77465 4.94536 5.77465 4.71649 5.54578Z"
            fill="#496AEB"
          />
          <path
            d="M2.23024 13.0034C2.00138 12.7745 2.00138 12.4037 2.23024 12.1748L4.71646 9.68862C4.94532 9.45975 5.31614 9.45975 5.54501 9.68862C5.77388 9.91749 5.77388 10.2883 5.54501 10.5172L3.0588 13.0034C2.82993 13.2323 2.45915 13.2323 2.23024 13.0034Z"
            fill="#496AEB"
          />
          <path
            d="M9.68923 5.54586C9.46036 5.317 9.46036 4.94618 9.68923 4.71731L12.1754 2.2311C12.4043 2.00223 12.7751 2.00223 13.004 2.2311C13.2329 2.45997 13.2329 2.83079 13.004 3.05965L10.5178 5.54586C10.2889 5.77473 9.91813 5.77473 9.68923 5.54586Z"
            fill="#496AEB"
          />
          <path
            d="M4.10156 8.20312H0.585938C0.26207 8.20312 0 7.94105 0 7.61719C0 7.29332 0.26207 7.03125 0.585938 7.03125H4.10156C4.42543 7.03125 4.6875 7.29332 4.6875 7.61719C4.6875 7.94105 4.42543 8.20312 4.10156 8.20312Z"
            fill="#496AEB"
          />
        </svg>
      ),
      data: allCreatorsTotalClicks.map((creator) => ({
        date: creator.name,
        Value: creator.totalClicks,
      })),
    },
    {
      id: "conversionRate",
      header: "Conversion Rate",
      stat: conversionRate
        ? `${conversionRate.conversionRate.toFixed(2)}%`
        : "0%",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3327 9.99996C18.3327 14.6 14.5993 18.3333 9.99935 18.3333C5.39935 18.3333 2.59102 13.7 2.59102 13.7M2.59102 13.7H6.35768M2.59102 13.7V17.8666M1.66602 9.99996C1.66602 5.39996 5.36602 1.66663 9.99935 1.66663C15.5577 1.66663 18.3327 6.29996 18.3327 6.29996M18.3327 6.29996V2.13329M18.3327 6.29996H14.6327"
            stroke="#496AEB"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      data: allConversionRates.map((rate) => ({
        date: rate.creatorName,
        Value: rate.conversionRate,
      })),
    },
  ];

  const dmIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.166 1.66663H5.83268C3.53268 1.66663 1.66602 3.52496 1.66602 5.81663V10.8V11.6333C1.66602 13.925 3.53268 15.7833 5.83268 15.7833H7.08268C7.30768 15.7833 7.60768 15.9333 7.74935 16.1166L8.99935 17.775C9.54935 18.5083 10.4493 18.5083 10.9993 17.775L12.2493 16.1166C12.4077 15.9083 12.6577 15.7833 12.916 15.7833H14.166C16.466 15.7833 18.3327 13.925 18.3327 11.6333V5.81663C18.3327 3.52496 16.466 1.66663 14.166 1.66663ZM6.66602 9.99996C6.19935 9.99996 5.83268 9.62496 5.83268 9.16663C5.83268 8.70829 6.20768 8.33329 6.66602 8.33329C7.12435 8.33329 7.49935 8.70829 7.49935 9.16663C7.49935 9.62496 7.13268 9.99996 6.66602 9.99996ZM9.99935 9.99996C9.53268 9.99996 9.16602 9.62496 9.16602 9.16663C9.16602 8.70829 9.54102 8.33329 9.99935 8.33329C10.4577 8.33329 10.8327 8.70829 10.8327 9.16663C10.8327 9.62496 10.466 9.99996 9.99935 9.99996ZM13.3327 9.99996C12.866 9.99996 12.4993 9.62496 12.4993 9.16663C12.4993 8.70829 12.8743 8.33329 13.3327 8.33329C13.791 8.33329 14.166 8.70829 14.166 9.16663C14.166 9.62496 13.7993 9.99996 13.3327 9.99996Z"
        fill="white"
      />
    </svg>
  );
  const greetingIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.4442 11.2676L19.4361 11.2216C19.4145 11.1103 19.3908 10.999 19.3636 10.8887L16.8886 1.64352C16.8448 1.51656 16.7542 1.374 16.6382 1.2578C16.4267 1.0464 16.1448 0.92968 15.8448 0.92968C15.5454 0.92968 15.2639 1.0464 15.0523 1.2578C14.8054 1.50436 14.6904 1.84372 14.7342 2.19036L15.5988 5.49952C15.6388 5.81592 15.4679 6.13232 15.1832 6.26804C15.0823 6.3178 14.967 6.34468 14.852 6.34468C14.6526 6.34468 14.4651 6.26704 14.3244 6.1264L8.52696 0.32908C8.3148 0.11672 8.03228 0 7.73072 0C7.43136 0 7.1504 0.11616 6.9398 0.32664C6.50292 0.76368 6.50292 1.47608 6.9398 1.9136L11.3589 6.33296C11.4998 6.47312 11.5774 6.6606 11.5774 6.86076C11.5774 7.06148 11.4992 7.24996 11.358 7.39156C11.2158 7.53368 11.0268 7.6118 10.8264 7.6118C10.6268 7.6118 10.4392 7.53468 10.298 7.39352L4.6076 1.70264C4.39572 1.49068 4.11352 1.37452 3.81352 1.37452C3.51384 1.37452 3.23228 1.49068 3.02072 1.70264C2.58292 2.14016 2.58292 2.852 3.02072 3.29L8.71104 8.98048C8.85228 9.12156 8.93012 9.31 8.9298 9.51024C8.92916 9.71048 8.85072 9.89844 8.70916 10.04C8.56792 10.1816 8.3798 10.2598 8.1798 10.2598C7.9798 10.2598 7.79228 10.1816 7.65136 10.041L2.74384 5.1328C2.53164 4.92084 2.24948 4.8042 1.94948 4.8042C1.64884 4.8042 1.36696 4.92036 1.15512 5.13232C0.943881 5.34324 0.827601 5.62496 0.827921 5.92528C0.828241 6.22504 0.945121 6.50732 1.15728 6.7192L6.06448 11.6269C6.35604 11.9189 6.35572 12.3945 6.06292 12.6864C5.92104 12.8281 5.73292 12.9062 5.53228 12.9062C5.33292 12.9062 5.14476 12.8281 5.00416 12.6874L2.34696 10.0312C2.13508 9.81924 1.8532 9.70204 1.55288 9.70204C1.25288 9.70204 0.971001 9.81828 0.759761 10.0302C0.548201 10.2411 0.431641 10.5234 0.431641 10.8242C0.431641 11.1239 0.548201 11.4062 0.759761 11.6171L6.98352 17.8417C7.0226 17.8808 7.06228 17.9188 7.10228 17.957C8.4798 19.2754 10.2895 20 12.1983 20C12.1983 20 12.1983 20 12.1986 20C14.1677 20 16.0189 19.2344 17.4108 17.8418C19.1317 16.1211 19.8917 13.663 19.4442 11.2676Z"
        fill="white"
      />
    </svg>
  );
  const followUpIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0870064 1.95167C-0.0588269 1.36917 0.148673 0.755835 0.617006 0.380001C1.08534 0.0041678 1.72951 -0.0641655 2.26617 0.204168L17.1078 7.625C17.6287 7.885 17.9578 8.4175 17.9578 9C17.9578 9.5825 17.6287 10.115 17.1078 10.375L2.26617 17.7958C1.72951 18.0642 1.08534 17.9958 0.617006 17.62C0.148673 17.2442 -0.0588269 16.6308 0.0870064 16.0483L1.64117 9.83333L10.6662 9L1.64117 8.16667L0.0870064 1.95167Z"
        fill="white"
      />
    </svg>
  );

  return (
    <DashBody>
      <div className={`pt-3 w-full mx-auto lg:max-w-5xl`}>
        <div
          className={`flex flex-col lg:flex-row lg:items-center gap-10 justify-between w-full`}
        >
          <div className={`flex flex-row items-center gap-4`}>
            <h1
              className={`mulish--bold text-4xl text-brandDarkPurple1x text-left`}
            >
              Dashboard
            </h1>
          </div>

          <div
            className={`flex flex-row gap-3 md:justify-end pt-5 overflow-x-auto w-full`}
          >
            <div
              className={`flex flex-row overflow-x-auto w-full font-semibold md:grid grid-cols-4 gap-2 p-2 bg-brandLightBlue4x max-w-xl text-black rounded-10`}
            >
              {durations.map((duration, idx) => {
                return (
                  <button
                    type="button"
                    id={duration.id}
                    key={idx}
                    onClick={() => setCurrentDuration(duration.id)}
                    className={`${
                      currentDuration === duration.id
                        ? "bg-brandBlue4x text-white"
                        : "bg-transparent hover:bg-white/70 text-black"
                    } whitespace-nowrap  active:translate-y-1 hover:drop-shadow-md transition-all ease-in-out duration-300 rounded-10 px-4 md:px-6 py-2`}
                  >
                    {duration.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`py-10`}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}
          >
            {simpleStats.map((stat, idx) => {
              return (
                <SimpleStatCard
                  key={idx}
                  id={stat.id}
                  header={stat.header}
                  stat={stat.stat}
                  icon={stat.icon}
                  data={stat.data}
                  duration={
                    durations.filter((d) => d.id == currentDuration)[0].name
                  }
                  isLoading={isLoading}
                />
              );
            })}
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5`}>
            <DonutStat
              id="donutStat"
              allCreatorsCredits={allCreatorsCredits}
              isLoading={isLoading}
            />
            <div className={`lg:col-span-2 auto-cols-fr auto-rows-fr`}>
              <UserSubBarChart
                id="userSubBarChart"
                allCreatorsTotalClicks={allCreatorsTotalClicks}
                allCreatorsTotalDMs={allCreatorsTotalDMs}
                allCreatorsTotalGreetings={allCreatorsTotalGreetings}
                allCreatorsTotalFollowUps={allCreatorsTotalFollowUps}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5`}
          >
            <PerFeatureAnalytics
              id={"dm"}
              icon={dmIcon}
              data={allCreatorsTotalDMs}
              value="totalDMs"
              isLoading={isLoading}
            />
            <PerFeatureAnalytics
              id={"greeting"}
              icon={greetingIcon}
              header={"Greetings Sent"}
              data={allCreatorsTotalGreetings}
              value="totalGreetings"
              isLoading={isLoading}
            />
            <PerFeatureAnalytics
              id={"followUp"}
              icon={followUpIcon}
              header={"Follow-up Sent"}
              data={allCreatorsTotalFollowUps}
              value="totalFollowUps"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </DashBody>
  );
};

export default AnalyticsPage;
