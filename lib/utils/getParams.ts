export class GetParams {
	static string(value: string | string[] | undefined): string | undefined {
		return this.parse(value, (v) => v);
	}

	static boolean(value: string | string[] | undefined): boolean | undefined {
		return this.parse(value, (v) => v === "true");
	}

	static number(value: string | string[] | undefined): number | undefined {
		return this.parse(value, Number);
	}

	private static parse<T>(
		value: string | string[] | undefined,
		parser: (value: string) => T,
	): T | undefined {
		if (value === undefined) return undefined;

		const stringValue = Array.isArray(value) ? value[0] : value;

		return stringValue === undefined ? undefined : parser(stringValue);
	}
}
