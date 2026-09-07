"use client";

import {
	Stepper,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/reui/stepper";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export type StepperStep = {
	title: string;
	description: string;
	href: string;
};

export function CustomStepper({
	steps = [],
	currentStep = 1,
}: {
	steps?: StepperStep[];
	currentStep?: number;
}) {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center w-full">
			<Stepper
				className="flex flex-col items-center justify-center gap-10"
				value={currentStep}
				orientation="vertical"
				indicators={{
					completed: <CheckIcon className="size-3.5" />,
					loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
				}}
			>
				<StepperNav>
					{steps.map((step, index) => (
						<StepperItem
							key={index}
							step={index + 1}
							className="relative items-start not-last:flex-1 hover:bg-cyan-800/40 active:bg-cyan-800"
						>
							<StepperTrigger
								className="items-start gap-2.5 pb-12 last:pb-0"
								onClick={() => {
									router.push(step.href);
								}}
							>
								<StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
									{index + 1}
								</StepperIndicator>
								<div className="mt-0.5 text-left">
									<StepperTitle>{step.title}</StepperTitle>
									<StepperDescription>{step.description}</StepperDescription>
								</div>
							</StepperTrigger>
							{index < steps.length - 1 && (
								<StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-y-0 top-6 left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-1.5rem)]" />
							)}
						</StepperItem>
					))}
				</StepperNav>
			</Stepper>
		</div>
	);
}
