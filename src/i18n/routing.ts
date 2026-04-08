import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "zh", "pt"],
  defaultLocale: "es",
  localeDetection: true,
});