"use client";

import { useEffect, useRef } from "react";
import {
	CircleCheckIcon,
	InfoIcon,
	TriangleAlertIcon,
	OctagonXIcon,
	Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

const icons = {
	success: <CircleCheckIcon className="size-4" />,
	info: <InfoIcon className="size-4" />,
	warning: <TriangleAlertIcon className="size-4" />,
	error: <OctagonXIcon className="size-4" />,
	loading: <Loader2Icon className="size-4 animate-spin" />,
};

type IconKey = keyof typeof icons;

export type CustomToastProps = {
	message: string;
	description: string;
	error?: boolean;
	icon?: IconKey;
	duration?: number;
};

export function customToast(props: CustomToastProps) {
	return toast.custom(() => <CustomToast {...props} />);
}

export function CustomToast({
	message,
	description,
	error,
	icon = error === true ? "error" : undefined,
	duration = 5000,
}: CustomToastProps) {
	const progressRef = useRef<HTMLDivElement>(null);
	const rafRef = useRef<number | null>(null);
	const pausedRef = useRef(false);

	useEffect(() => {
		const safeDuration = Math.max(duration, 0);

		if (!progressRef.current || safeDuration === 0) {
			if (progressRef.current) {
				progressRef.current.style.width = "0%";
			}
			return;
		}

		const startTime = performance.now();

		let pausedDuration = 0;
		let pauseStartedAt = 0;

		const tick = (now: number) => {
			if (pausedRef.current) {
				if (pauseStartedAt === 0) {
					pauseStartedAt = now;
				}

				rafRef.current = requestAnimationFrame(tick);
				return;
			}

			if (pauseStartedAt !== 0) {
				pausedDuration += now - pauseStartedAt;
				pauseStartedAt = 0;
			}

			const elapsed = now - startTime - pausedDuration;
			const ratio = Math.max(0, 1 - elapsed / safeDuration);

			if (progressRef.current) {
				progressRef.current.style.width = `${ratio * 100}%`;
			}

			if (elapsed < safeDuration) {
				rafRef.current = requestAnimationFrame(tick);
			}
		};

		rafRef.current = requestAnimationFrame(tick);

		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, [duration]);

	return (
		<div
			onMouseEnter={() => {
				pausedRef.current = true;
			}}
			onMouseLeave={() => {
				pausedRef.current = false;
			}}
			className="w-80 bg-cyan-950 overflow-hidden p-2 pl-0 flex aria-invalid:bg-red-950"
			aria-invalid={error}
		>
			<div
				className="w-12 justify-center items-center flex aria-invalid:text-red-400"
				aria-invalid={error}
			>
				{icon && icons[icon]}
			</div>
			<div className="w-full">
				<p
					className="font-medium text-sm pb-0.5 aria-invalid:text-red-100"
					aria-invalid={error}
				>
					{message || "Message"}
				</p>
				<div className="h-0.5 w-full bg-white/10">
					<div
						ref={progressRef}
						className="h-full bg-cyan-700 will-change-[width] aria-invalid:bg-red-500"
						aria-invalid={error}
						style={{ width: "100%" }}
					/>
				</div>
				<div className="py-1.5">
					<p className="text-xs aria-invalid:text-red-100" aria-invalid={error}>
						{description || "Description"}
					</p>
				</div>
			</div>
		</div>
	);
}
