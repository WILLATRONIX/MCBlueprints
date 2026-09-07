export class Username {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly errors: string[] = [];

	private static readonly MIN_LENGTH = 3;
	private static readonly MAX_LENGTH = 32;

	constructor(username: string) {
		this.value = username.trim();

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private validate(): void {
		if (this.value.length < Username.MIN_LENGTH) {
			this.errors.push(
				`Username must be at least ${Username.MIN_LENGTH} characters.`,
			);
		}

		if (this.value.length > Username.MAX_LENGTH) {
			this.errors.push(
				`Username must not exceed ${Username.MAX_LENGTH} characters.`,
			);
		}

		if (/[A-Z]/.test(this.value)) {
			this.errors.push("Username cannot contain uppercase letters.");
		}

		if (!/^[a-z0-9_.-]+$/.test(this.value)) {
			this.errors.push("Username contains invalid characters.");
		}

		if (/^[_.-]/.test(this.value)) {
			this.errors.push("Username cannot start with special characters.");
		}

		if (/[_.-]$/.test(this.value)) {
			this.errors.push("Username cannot end with special characters.");
		}

		if (/([_.-])\1/.test(this.value)) {
			this.errors.push("Username cannot contain repeated separators.");
		}
	}
}
