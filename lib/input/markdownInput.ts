export class MarkdownInput {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly errors: string[] = [];

	private static readonly MIN_LENGTH = 0;
	private static readonly MAX_LENGTH = 4096;

	constructor(content: string) {
		this.value = content.trim();

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private validate(): void {
		if (this.value.length < MarkdownInput.MIN_LENGTH) {
			this.errors.push(
				`Field must be at least ${MarkdownInput.MIN_LENGTH} characters.`,
			);
		}

		if (this.value.length > MarkdownInput.MAX_LENGTH) {
			this.errors.push(
				`Field must not exceed ${MarkdownInput.MAX_LENGTH} characters.`,
			);
		}

		if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(this.value)) {
			this.errors.push("Field contains invalid characters.");
		}
	}
}
