export class DisplayName {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly errors: string[] = [];

	private static readonly MIN_LENGTH = 3;
	private static readonly MAX_LENGTH = 32;

	constructor(displayName: string) {
		this.value = displayName.trim();

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private validate(): void {
		if (this.value.length < DisplayName.MIN_LENGTH) {
			this.errors.push(
				`Display name must be at least ${DisplayName.MIN_LENGTH} characters.`,
			);
		}

		if (this.value.length > DisplayName.MAX_LENGTH) {
			this.errors.push(
				`Display name must not exceed ${DisplayName.MAX_LENGTH} characters.`,
			);
		}

		if (!/^[\p{L}\p{N}\p{M} _.\-!'"]+$/u.test(this.value)) {
			this.errors.push("Display name contains invalid characters.");
		}

		if (/^\s|\s$/.test(this.value)) {
			this.errors.push("Display name cannot start or end with spaces.");
		}

		if (/\s{2,}/.test(this.value)) {
			this.errors.push("Display name cannot contain consecutive spaces.");
		}
	}
}
