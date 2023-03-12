// TODO: refactor file

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
