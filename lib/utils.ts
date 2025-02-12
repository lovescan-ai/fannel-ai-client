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

export function nFormatter(
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  }
) {
  if (!num) return "0";
  if (opts.full) {
    return Intl.NumberFormat("en-US").format(num);
  }
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, "$1") + item.symbol
    : "0";
}
