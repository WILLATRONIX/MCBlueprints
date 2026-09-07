export class Password {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly errors: string[] = [];

	private static readonly MIN_LENGTH = 8;
	private static readonly MAX_LENGTH = 128;

	constructor(password: string) {
		this.value = password;

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private validate(): void {
		if (this.value.length < Password.MIN_LENGTH) {
			this.errors.push(
				`Password must be at least ${Password.MIN_LENGTH} characters.`,
			);
		}

		if (this.value.length > Password.MAX_LENGTH) {
			this.errors.push(
				`Password must not exceed ${Password.MAX_LENGTH} characters.`,
			);
		}

		if (!/[A-Z]/.test(this.value)) {
			this.errors.push("Password must contain at least one uppercase letter.");
		}

		if (!/[a-z]/.test(this.value)) {
			this.errors.push("Password must contain at least one lowercase letter.");
		}

		if (!/[0-9]/.test(this.value)) {
			this.errors.push("Password must contain at least one number.");
		}

		if (!/[!@#$%^&*()_\-+={[}\]|:;"'<,>.?/`~\\]/.test(this.value)) {
			this.errors.push("Password must contain at least one special character.");
		}

		if (/\s/.test(this.value)) {
			this.errors.push("Password cannot contain whitespace.");
		}
	}
}
