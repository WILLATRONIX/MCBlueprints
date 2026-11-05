import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en-us", "de", "fr", "es"],
	defaultLocale: "en-us",

	localePrefix: "as-needed",
	localeDetection: true,
});
