import type { Metadata } from "next";
import { Geist, Geist_Mono, Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Script from "next/script";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MCBlueprints",
	description: "Create, share and download Minecraft creations.",
	applicationName: "MCBlueprints",
	authors: [{ name: "WILLATRONIX", url: "https://willatronix.com" }],
	creator: "WILLATRONIX",
	openGraph: {
		type: "website",
		description: "Create, share and download Minecraft creations.",
		title: "MCBlueprints",
		siteName: "MCBlueprints",
		url: "https://mcbps.com",
		images: [
			{
				type: "image/webp",
				url: "https://static.mcbps.com/logo-15px.webp",
				width: 96,
				height: 96,
			},
		],
	},
	twitter: {
		card: "summary",
		title: "MCBlueprints",
		description: "Create, share and download Minecraft creations.",
		images: ["https://static.mcbps.com/logo-15px.webp"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				"h-screen",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				oxanium.variable,
			)}
		>
			<head>
				<meta property="og:type" content="website" />
				<meta name="darkreader-lock" />
				<meta property="og:locale" content="en_US" />
				<meta
					name="keywords"
					content="Axiom, Assets, Assemblies, Resources, Minecraft, Mod, Builds, Building, Builders, Download, Upload, Share, Edit, WILLATRONIX, Blueprint, Blueprints, Preset, Theme, Pack, Schematic, Free, Paid, Premium, Library, MC, Litematics, Schem, Teams"
				/>
				<meta name="robots" content="index, follow" />
				<meta charSet="UTF-8" />
				<meta httpEquiv="content-language" content="en" />
				<link
					rel="icon"
					type="image/webp"
					href="https://static.mcbps.com/logo-15px.webp"
				/>
			</head>
			<body className="min-h-screen flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<div className="bg-graph">
						<main className="relative flex flex-1 flex-col min-h-full overflow-x-hidden">
							<TooltipProvider>{children}</TooltipProvider>
						</main>

						<Toaster
							duration={5000}
							position="top-center"
							swipeDirections={["right"]}
						/>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
