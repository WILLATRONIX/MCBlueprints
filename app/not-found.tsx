"use client";

import Navbar from "@/components/blocks/navbar";
import { Button } from "@/components/ui/button";
import { Telemetry } from "@/lib/telemetry/telemetryService";
import Link from "next/link";
import { useEffect } from "react";

const telemetry = new Telemetry(__filename);

export default function NotFoundPage() {
	useEffect(() => {
		telemetry.emit("page_not_found", "Page not found.", "warn", {
			href: window.location.href,
		});
	}, []);

	return (
		<>
			<Navbar />
			<div className="flex w-full items-center justify-center h-42 flex-col">
				<p className="text-4xl pb-2">404 Page not found.</p>
				<Button asChild>
					<Link href={"/"}>Home</Link>
				</Button>
			</div>
		</>
	);
}
