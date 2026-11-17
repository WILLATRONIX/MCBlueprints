import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en-US", "en-GB", "de-DE", "fr-FR", "fr-CA", "en-CA", "es-ES"],
	defaultLocale: "en-US",

	domains: [
		{
			domain: "us.mcbps.com",
			defaultLocale: "en-US",
			locales: ["en-US"],
		},
		{
			domain: "gb.mcbps.com",
			defaultLocale: "en-GB",
			locales: ["en-GB"],
		},
		{
			domain: "ca.mcbps.com",
			defaultLocale: "en-CA",
			locales: ["en-CA", "fr-CA"],
		},
		{
			domain: "fr.mcbps.com",
			defaultLocale: "fr-FR",
			locales: ["fr-FR"],
		},
	],

	localePrefix: {
		mode: "as-needed",
		prefixes: {
			// Cleaner prefix for `ca.example.com/fr`
			"fr-CA": "/fr",
		},
	},
	localeDetection: false,
	localeCookie: false,
});
