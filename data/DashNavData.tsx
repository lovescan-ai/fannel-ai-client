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
    icon: (color: string) => (
      <AnalyticsIcon color={color} className="w-6 h-6" />
    ),
    activeIcon: (color: string) => (
      <AnalyticsIcon color={color} className="w-6 h-6" />
    ),
  },
  {
    id: "bot",
    link: "/dashboard/bot",
    name: "Bot",
    icon: (color: string) => <RobotIcon color={color} className="w-6 h-6" />,
    activeIcon: (color: string) => (
      <RobotIcon color={color} className="w-6 h-6" />
    ),
  },

  {
    id: "account",
    link: "/dashboard/account",
    name: "Account",
    icon: (color: string) => (
      <UserCircleIcon color={color} className="w-6 h-6" />
    ),
    activeIcon: (color: string) => (
      <UserCircleIcon color={color} className="w-6 h-6" />
    ),
  },
  {
    id: "settings",
    link: "/dashboard/settings",
    name: "Settings",
    icon: (color: string) => <SettingsIcon color={color} className="w-6 h-6" />,
    activeIcon: (color: string) => (
      <SettingsIcon color={color} className="w-6 h-6" />
    ),
  },
];

export default DashNavData;
