import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isStringRecord(
	value: unknown,
): value is Record<string, string> {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return Object.values(value).every((v) => typeof v === "string");
}

export function getClientUtcOffset(date = new Date()) {
	const offset = date.getTimezoneOffset();

	const sign = offset <= 0 ? "+" : "-";
	const abs = Math.abs(offset);

	const hours = String(Math.floor(abs / 60)).padStart(2, "0");
	const minutes = String(abs % 60).padStart(2, "0");

	return `UTC${sign}${hours}:${minutes}`;
}

export function b64ImageToFile(dataUrl: string, filename: string): File {
	const [header, base64] = dataUrl.split(",");

	const mime = header.match(/data:(.*?);base64/)?.[1];
	if (!mime) {
		throw new Error("Invalid base64 data URL");
	}

	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return new File([bytes], filename, {
		type: mime,
	});
}
