"use client";

import { CustomStepper, StepperStep } from "@/components/blocks/custom-stepper";
import { useEffect, useState } from "react";

const steps: Record<string, StepperStep[]> = {
	asset: [
		{ title: "Setup", description: "Select an upload type", href: "/upload" },
		{
			title: "Add Files",
			description: "Add files for upload",
			href: "/upload/asset",
		},
		{
			title: "Edit",
			description: "Add details to the upload",
			href: "/upload/edit",
		},
		{
			title: "Settings",
			description: "Configure the upload",
			href: "/upload/settings",
		},
		{
			title: "Publish",
			description: "Complete upload and share",
			href: "/upload/publish",
		},
	],
	assembly: [
		{ title: "Setup", description: "Select an upload type", href: "/upload" },
		{
			title: "Add Files",
			description: "Add files for upload",
			href: "/upload/assembly",
		},
		{
			title: "Edit",
			description: "Add details to the upload",
			href: "/upload/edit",
		},
		{
			title: "Settings",
			description: "Configure the upload",
			href: "/upload/settings",
		},
		{
			title: "Publish",
			description: "Complete upload and share",
			href: "/upload/publish",
		},
	],
};

export default function StepList({ uploadType }: { uploadType: string }) {
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		const main = () => {
			setCurrentStep(
				steps[uploadType].findIndex(
					(step) => step.href === window.location.pathname,
				) + 1,
			);
		};

		main();
	}, [uploadType]);

	return (
		<div className="bg-cyan-950 ring-2 ring-ring/50 h-full flex pt-6 items-start w-[20vw] max-w-96 shrink-0">
			<CustomStepper
				steps={steps[uploadType]}
				currentStep={currentStep}
			></CustomStepper>
		</div>
	);
}
