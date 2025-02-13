import React from "react";
import {
  AnalyticsIcon,
  RobotIcon,
  UserCircleIcon,
  SettingsIcon,
} from "@/components/icons";
const DashNavData = [
  {
    id: "analytics",
    link: "/dashboard",
    name: "Dashboard",
    icon: (color: string) => <AnalyticsIcon color={color} />,
    activeIcon: (color: string) => <AnalyticsIcon color={color} />,
  },
  {
    id: "bot",
    link: "/dashboard/bot",
    name: "Bot",
    icon: (color: string) => <RobotIcon color={color} />,
    activeIcon: (color: string) => <RobotIcon color={color} />,
  },

  {
    id: "account",
    link: "/dashboard/account",
    name: "Account",
    icon: (color: string) => <UserCircleIcon color={color} />,
    activeIcon: (color: string) => <UserCircleIcon color={color} />,
  },
  {
    id: "settings",
    link: "/dashboard/settings",
    name: "Settings",
    icon: (color: string) => <SettingsIcon color={color} />,
    activeIcon: (color: string) => <SettingsIcon color={color} />,
  },
];

export default DashNavData;
