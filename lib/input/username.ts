export class Password {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly descriptiveErrors: boolean;
	public readonly errors: string[] = [];

	private static readonly MIN_LENGTH = 8;
	private static readonly MAX_LENGTH = 128;

	constructor(password: string, descriptiveErrors: boolean = false) {
		this.value = password;
		this.descriptiveErrors = descriptiveErrors;

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private pushError(description: string): void {
		this.errors.push(this.descriptiveErrors ? description : "Invalid Password");
	}

	private validate(): void {
		if (this.value.length < Password.MIN_LENGTH) {
			this.pushError(
				`Password must be at least ${Password.MIN_LENGTH} characters.`,
			);
		}

		if (this.value.length > Password.MAX_LENGTH) {
			this.pushError(
				`Password must not exceed ${Password.MAX_LENGTH} characters.`,
			);
		}

		if (!/[A-Z]/.test(this.value)) {
			this.pushError("Password must contain at least one uppercase letter.");
		}

		if (!/[a-z]/.test(this.value)) {
			this.pushError("Password must contain at least one lowercase letter.");
		}

		if (!/[0-9]/.test(this.value)) {
			this.pushError("Password must contain at least one number.");
		}

		if (!/[!@#$%^&*()_\-+={[}\]|:;"'<,>.?/`~\\]/.test(this.value)) {
			this.pushError("Password must contain at least one special character.");
		}

		if (/\s/.test(this.value)) {
			this.pushError("Password cannot contain whitespace.");
		}
	}
}
