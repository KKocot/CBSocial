import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Unit } from "./type";
import { useTranslations } from "next-intl";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getNextDay(dayOfWeek: string) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const targetDay = days.indexOf(dayOfWeek);
  const today = new Date();
  const currentDay = today.getDay();

  let diff = targetDay - currentDay;

  if (diff < 0) {
    diff += 7;
  }

  today.setDate(today.getDate() + diff);

  // Format the date as a string in the format YYYY-MM-DD
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}
export function getCloserDay() {
  const nextTuesday = getNextDay("Tuesday");
  const nextSaturday = getNextDay("Saturday");

  return nextTuesday < nextSaturday ? nextTuesday : nextSaturday;
}

export function useArtyAmount(
  amount: "none" | "some" | "average" | "aLot" | undefined
) {
  const t = useTranslations("BuildTeam");

  switch (amount) {
    case "none":
      return { title: t("no_artillery"), label: t("not_at_all") };
    case "some":
      return { title: t("some_artillery"), label: t("some") };
    case "average":
      return { title: t("average_artillery"), label: t("average") };
    case "aLot":
      return { title: t("a_lot_artillery"), label: t("a_lot") };
    default:
      return { title: "", label: "" };
  }
}

export function ownedUnits(
  units: Unit[],
  profile_units: { id: number; value: string }[]
) {
  const mergedGoldenUnits = units.map((unit) => {
    const matchingGolden = profile_units.find((g) => g.id === unit.id);
    return { ...unit, matchingGolden };
  });
  return mergedGoldenUnits;
}
