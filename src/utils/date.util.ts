// TODO: refactor file

import { isUndefined } from "./type.util";

export const months = [
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

export const formatDay = (day: number) => {
  const j = day % 10;
  const k = day % 100;
  if (j == 1 && k != 11) return day + "st";
  if (j == 2 && k != 12) return day + "nd";
  if (j == 3 && k != 13) return day + "rd";
  return day + "th";
};

export const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const monthInfo = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  return {
    numDays: daysInMonth(year, month),
    weekday: [6, 0, 1, 2, 3, 4, 5][date.getDay()],
  };
};

export const previusMonth = (year: number, month: number) => {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
};

type Day = {
  day: number;
  month?: number;
  year?: number;
  active: boolean;
};

export const generateDays = (year: number, month: number) => {
  const days: Day[] = [];

  const { numDays, weekday } = monthInfo(Number(year), Number(month));

  const prevMonth = previusMonth(Number(year), Number(month));
  const prevDays = daysInMonth(prevMonth.year, prevMonth.month);

  for (let i = 0; i < weekday; i++) {
    days.push({
      day: prevDays - weekday + i,
      month: prevMonth.month,
      year: prevMonth.year,
      active: false,
    });
  }

  for (let i = 0; i < numDays; i++) {
    days.push({ day: i, month, year, active: true });
  }

  const remaining = 42 - days.length;
  for (let i = 0; i < remaining; i++) {
    days.push({ day: i, active: false });
  }

  return days;
};

export const parseTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return {
    hours,
    minutes: minutes % 60,
    seconds: seconds % 60,
    milliseconds: Math.floor((milliseconds % 1000) / 10),
  };
};

export const padTime = (time: number) => String(time).padStart(2, "0");

export const formatTime = (time: ReturnType<typeof parseTime>) => {
  return `${padTime(time.hours)}:${padTime(time.minutes)}:${padTime(time.seconds)}`;
};

export type TimeValue = `${number}:${number}`;

export const dateToTimeValue = (date: Date): TimeValue => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` as TimeValue;
};

export const timeValueToDate = (timeValue: TimeValue): Date => {
  const [hours, minutes] = timeValue.split(":");
  const date = new Date();
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
  return date;
};

export const timeValueToHours = (timeValue: TimeValue): number => {
  const [hours, minutes] = timeValue.split(":");
  return Number.parseInt(hours) + Number.parseInt(minutes) / 60;
};

export const hoursToTimeValue = (_hours: number): TimeValue => {
  const hours = Math.floor(_hours);
  const minutes = Math.round((_hours - hours) * 60);
  return `${padTime(hours)}:${padTime(minutes)}` as TimeValue;
};

export const dateToHours = (date: Date): number => {
  return date.getHours() + date.getMinutes() / 60;
};

export const formatDate = (date?: Date): string => {
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const formatHours = (hours?: number): string => {
  if (isUndefined(hours)) return "";

  return `${hours.toFixed(2)} h`;
};

export const formatTimeShort = (timeValue?: string): string => {
  if (!timeValue) return "";
  const [hours, minutes] = timeValue.split(":");
  return `${hours}:${minutes}`;
};

export const isCurrentYear = () => {
  const currentYear = new Date().getFullYear();

  return (year: number) => currentYear === year;
};

export const isCurrentMonth = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  return (year: number, month: number) => {
    return year === currentYear && month === currentMonth;
  };
};

export const isCurrentDay = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const currentDay = date.getDate() - 1;

  return (year: number, month: number, day: number) => {
    return year === currentYear && month === currentMonth && day === currentDay;
  };
};
