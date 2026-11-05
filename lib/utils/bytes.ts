type Unit = "byte" | "kb" | "mb" | "gb" | "kib" | "mib" | "gib";

const units: Record<Unit, number> = {
	byte: 1,
	kb: 1_000,
	mb: 1_000_000,
	gb: 1_000_000_000,
	kib: 1_024,
	mib: 1_048_576,
	gib: 1_073_741_824,
};

export function convertBytes(
	value: number,
	from: Unit = "mb",
	to: Unit = "byte",
): number {
	return (value * units[from]) / units[to];
}
