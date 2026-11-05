import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/blocks/navbar";

export const metadata: Metadata = {
	title: "Upload - MCBlueprints",
	description: "Create, share and download Minecraft creations.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<Navbar navComponents={null} title />
			{children}
		</div>
	);
}
