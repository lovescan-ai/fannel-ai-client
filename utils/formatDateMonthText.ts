import React from "react";

const formatDateMonthText = (
  timestamp: number | string,
  short: boolean = false,
  sansSuffix: boolean = false
): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateObj = new Date(timestamp);
  const month = short
    ? monthNames[dateObj.getMonth()].slice(0, 3)
    : monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  if (sansSuffix) {
    return `${month} ${day}, ${year}`;
  }

  const suffix = getOrdinalSuffix(day);
  return `${month} ${day}${suffix}, ${year}`;
};

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export default formatDateMonthText;
