import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./lib/locale";
import { assign } from "radash";

export const locales = ["gb", "pl", "fr", "de", "tr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "gb";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  const [messages, defaultMessages] = await Promise.all([
    import(`../messages/${locale}.json`),
    import(`../messages/${defaultLocale}.json`),
  ]);
  return {
    locale,
    messages: assign(defaultMessages.default, messages.default),
    timeZone: "Europe/Warsaw",
  };
});
