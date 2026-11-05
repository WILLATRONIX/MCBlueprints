type TimeUnit =
	"ms" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

const timeUnits: Record<TimeUnit, number> = {
	ms: 1,
	second: 1_000,
	minute: 60_000,
	hour: 3_600_000,
	day: 86_400_000,
	week: 604_800_000,
	month: 2_629_746_000,
	year: 31_556_952_000,
};

export function convertTime(
	value: number,
	from: TimeUnit = "second",
	to: TimeUnit = "ms",
): number {
	return (value * timeUnits[from]) / timeUnits[to];
}
