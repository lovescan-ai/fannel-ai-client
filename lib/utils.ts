import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addHourIfChanged = (
  newTime: Date | null,
  originalTime: Date | null
) => {
  if (
    newTime instanceof Date &&
    (!originalTime ||
      !(originalTime instanceof Date) ||
      newTime.getTime() !== originalTime.getTime())
  ) {
    return moment(newTime).add(1, "hour").toISOString();
  }
  return newTime instanceof Date ? newTime.toISOString() : newTime;
};

export const addOneHour = (date: Date) => {
  return moment(date).add(1, "hour").toISOString();
};

export const getGradientColor = (index: number) => {
  const gradients = [
    "from-blue-400 to-purple-500",
    "from-green-400 to-cyan-500",
    "from-pink-400 to-orange-500",
    "from-indigo-400 to-blue-500",
    "from-yellow-400 to-red-500",
    "from-blue-400 to-purple-500",
    "from-green-400 to-cyan-500",
    "from-pink-400 to-orange-500",
    "from-indigo-400 to-blue-500",
    "from-yellow-400 to-red-500",
  ];
  return gradients[index % gradients.length];
};
