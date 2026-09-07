import { Fault } from "../fault/fault";

export class AspectRatio {
	public readonly str: string;
	public readonly num: number;

	constructor(ratio: string | number) {
		if (typeof ratio === "number") {
			if (!Number.isFinite(ratio) || ratio <= 0) {
				throw new Fault(
					"Aspect ratio must be a positive finite number.",
					"aspect_ratio_input_invalid_number_range",
				);
			}

			this.num = ratio;
			this.str = ratio.toString();
			return;
		}

		const value = ratio.trim();

		if (!value) {
			throw new Fault(
				"Aspect ratio cannot be empty.",
				"aspect_ratio_input_empty",
			);
		}

		if (value.includes(":")) {
			const parts = value.split(":");

			if (parts.length !== 2) {
				throw new Fault(
					"Aspect ratio must be in the format 'width:height'.",
					"aspect_ratio_input_invalid_string_format",
				);
			}

			const width = Number(parts[0]);
			const height = Number(parts[1]);

			if (
				!Number.isFinite(width) ||
				!Number.isFinite(height) ||
				width <= 0 ||
				height <= 0
			) {
				throw new Fault(
					"Aspect ratio values must be positive numbers.",
					"aspect_ratio_input_invalid_string_number",
				);
			}

			this.num = width / height;
			this.str = `${width}:${height}`;
			return;
		}

		const number = Number(value);

		if (!Number.isFinite(number) || number <= 0) {
			throw new Fault(
				"Invalid aspect ratio.",
				"aspect_ratio_invalid_number_range",
			);
		}

		this.num = number;
		this.str = value;
	}

	toString(): string {
		return this.str;
	}

	toNumber(): number {
		return this.num;
	}
}
