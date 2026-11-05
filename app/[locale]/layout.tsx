import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { rootParams } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { locale } = await rootParams();

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
