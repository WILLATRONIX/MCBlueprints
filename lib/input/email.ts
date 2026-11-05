export class Email {
	public readonly value: string;
	public readonly local: string;
	public readonly domain: string;
	public readonly tld: string;
	public readonly valid: boolean;
	public readonly descriptiveErrors: boolean;
	public readonly errors: string[] = [];

	private static readonly MAX_EMAIL_LENGTH = 254;
	private static readonly MAX_LOCAL_LENGTH = 64;
	private static readonly MAX_LABEL_LENGTH = 63;
	private static readonly MIN_TLD_LENGTH = 2;
	private static readonly MAX_TLD_LENGTH = 24;

	constructor(email: string, descriptiveErrors: boolean = false) {
		this.value = email.trim();
		this.descriptiveErrors = descriptiveErrors;

		const parts = this.value.split("@");

		if (parts.length !== 2) {
			this.local = "";
			this.domain = "";
			this.tld = "";
			this.valid = false;
			this.pushError('Email must contain one "@" symbol.');
			return;
		}

		this.local = parts[0];
		this.domain = parts[1];

		const domainParts = this.domain.split(".");
		this.tld = domainParts[domainParts.length - 1] || "";

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private pushError(description: string): void {
		this.errors.push(
			this.descriptiveErrors ? description : "Invalid Email Address",
		);
	}

	private validate(): void {
		if (this.value.length > Email.MAX_EMAIL_LENGTH) {
			this.pushError("Email is too long.");
		}

		if (this.local.length === 0) {
			this.pushError("Email name cannot be empty.");
		}

		if (this.local.length > Email.MAX_LOCAL_LENGTH) {
			this.pushError("Email name is too long.");
		}

		if (this.domain.length === 0) {
			this.pushError("Domain cannot be empty.");
		}

		if (!this.domain.includes(".")) {
			this.pushError("Domain must contain a TLD.");
		}

		if (
			this.tld.length < Email.MIN_TLD_LENGTH ||
			this.tld.length > Email.MAX_TLD_LENGTH
		) {
			this.pushError(
				`TLD must be between ${Email.MIN_TLD_LENGTH} and ${Email.MAX_TLD_LENGTH} characters.`,
			);
		}

		if (!/^[a-zA-Z]+$/.test(this.tld)) {
			this.pushError("TLD must contain only letters.");
		}

		if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(this.local)) {
			this.pushError("Local part contains invalid characters.");
		}

		if (this.local.startsWith(".") || this.local.endsWith(".")) {
			this.pushError("Local part cannot start or end with a dot.");
		}

		if (this.local.includes("..")) {
			this.pushError("Local part cannot contain consecutive dots.");
		}

		if (!/^[a-zA-Z0-9.-]+$/.test(this.domain)) {
			this.pushError("Domain contains invalid characters.");
		}

		if (this.domain.startsWith("-") || this.domain.endsWith("-")) {
			this.pushError("Domain cannot start or end with a hyphen.");
		}

		if (this.domain.includes("..")) {
			this.pushError("Domain cannot contain consecutive dots.");
		}

		for (const label of this.domain.split(".")) {
			if (label.length === 0) {
				this.pushError("Domain contains empty labels.");
				continue;
			}

			if (label.length > Email.MAX_LABEL_LENGTH) {
				this.pushError(
					`Domain label "${label}" exceeds ${Email.MAX_LABEL_LENGTH} characters.`,
				);
			}

			if (label.startsWith("-") || label.endsWith("-")) {
				this.pushError(
					`Domain label "${label}" cannot start or end with a hyphen.`,
				);
			}
		}
	}
}
