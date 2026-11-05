"use client";

import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/reui/stepper";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";

export type StepperStep = {
	title: string;
	href: string;
	icon?: LucideIcon;
};

export function CustomStepper({
	steps = [],
	currentStep = 1,
	completedSteps = 0,
	setCurrentStepAction,
}: {
	steps?: StepperStep[];
	currentStep?: number;
	completedSteps?: number;
	setCurrentStepAction: (newValue: number) => void;
}) {
	const prevRef = useRef<HTMLButtonElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const rowRef = useRef<HTMLDivElement>(null);

	const allDone = currentStep > steps.length;

	useEffect(() => {
		const row = rowRef.current;
		if (!row) return;
		const reveal = (tab: Element | null) => {
			if (!tab) return;
			const box = row.getBoundingClientRect();
			const { left, right } = tab.getBoundingClientRect();
			if (left < box.left || right > box.right) {
				row.scrollLeft += (left + right - box.left - box.right) / 2;
			}
		};

		const onFocus = (event: FocusEvent) =>
			reveal((event.target as Element).closest('[role="tab"]'));

		const observer = new ResizeObserver(() =>
			reveal(row.querySelector('[aria-selected="true"]')),
		);

		observer.observe(row);
		row.addEventListener("focusin", onFocus);

		return () => {
			observer.disconnect();
			row.removeEventListener("focusin", onFocus);
		};
	}, [currentStep]);

	function goTo(step: number) {
		setCurrentStepAction(step);
		if (step === 1) nextRef.current?.focus();
		if (step > steps.length) prevRef.current?.focus();
	}

	return (
		<Stepper
			value={currentStep}
			onValueChange={setCurrentStepAction}
			// indicators={indicators}
			className="flex flex-row gap-6 items-center px-4 py-2"
			aria-label="New hire onboarding"
		>
			<div
				ref={rowRef}
				className="@container relative -mx-1 -my-2 overflow-x-auto p-2 w-full"
			>
				<StepperNav className="min-w-max gap-1 pt-1.5">
					{steps.map((item, index) => {
						const step = index + 1;

						return (
							<StepperItem
								key={item.title}
								step={step}
								loading
								className="gap-1.5"
							>
								<StepperTrigger
									tabIndex={allDone && step === steps.length ? 0 : undefined}
									className="-m-1 gap-1.5 p-1"
								>
									<StepperIndicator className="bg-ring/20 ring-0 text-ring/50 size-8 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=completed]:bg-primary data-[state=completed]:text-white">
										{item.icon && <item.icon className="h-4 w-4" />}
									</StepperIndicator>
									<StepperTitle className="data-[state=inactive]:text-muted-foreground whitespace-nowrap @max-2xl:not-data-[state=active]:sr-only">
										{item.title}
									</StepperTitle>
									{step < currentStep && (
										<span className="sr-only">, completed</span>
									)}
								</StepperTrigger>
								{step < steps.length && (
									<StepperSeparator className="to-ring/20 data-[state=inactive]:from-ring/20 m-0 min-w-6 bg-transparent bg-linear-to-r from-cyan-700 data-[state=completed]:to-cyan-700 rtl:bg-linear-to-l p-px" />
								)}
							</StepperItem>
						);
					})}
				</StepperNav>
			</div>

			<StepperPanel className="text-center max-w-48">
				<div className="flex justify-center gap-2">
					<Button
						ref={prevRef}
						variant="outline"
						size="lg"
						disabled={currentStep === 1}
						onClick={() => goTo(currentStep - 1)}
					>
						Previous
					</Button>
					<Button
						ref={nextRef}
						size="lg"
						disabled={allDone || completedSteps !== currentStep}
						onClick={() => goTo(currentStep + 1)}
					>
						Next
					</Button>
				</div>
			</StepperPanel>
		</Stepper>
	);
}
