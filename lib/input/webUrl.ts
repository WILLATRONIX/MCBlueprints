type UrlRule = {
	altDomains: RegExp[];
	paths: RegExp[];
};

export class WebUrl {
	public readonly value: string;
	public readonly valid: boolean;
	public readonly errors: string[] = [];

	public readonly protocol: string;
	public readonly hostname: string;
	public readonly pathname: string;
	public readonly search: string;

	private static readonly RULES: Record<string, UrlRule> = {
		youtube: {
			altDomains: [/^youtube\.com$/i, /^www\.youtube\.com$/i, /^youtu\.be$/i],

			paths: [
				/^\/watch$/i,
				/^\/@[\w.-]+$/i,
				/^\/channel\/[\w-]+$/i,
				/^\/shorts\/[\w-]+$/i,
				/^\/playlist$/i,
			],
		},

		github: {
			altDomains: [/^github\.com$/i, /^www\.github\.com$/i],

			paths: [
				/^\/[\w.-]+$/i,
				/^\/[\w.-]+\/[\w.-]+$/i,
				/^\/[\w.-]+\/[\w.-]+\/issues$/i,
				/^\/[\w.-]+\/[\w.-]+\/pulls$/i,
			],
		},

		google: {
			altDomains: [/^google\.com$/i, /^www\.google\.com$/i],

			paths: [/^\/$/, /^\/search$/i, /^\/maps$/i],
		},
	};

	constructor(url: string) {
		this.value = url.trim();

		let parsed: URL;

		try {
			parsed = new URL(this.value);
		} catch {
			this.protocol = "";
			this.hostname = "";
			this.pathname = "";
			this.search = "";
			this.valid = false;

			this.errors.push("Invalid URL format.");
			return;
		}

		this.protocol = parsed.protocol;
		this.hostname = parsed.hostname;
		this.pathname = parsed.pathname;
		this.search = parsed.search;

		this.validate();

		this.valid = this.errors.length === 0;
	}

	private validate(): void {
		if (this.protocol !== "https:" && this.protocol !== "http:") {
			this.errors.push("Only HTTP and HTTPS protocols are allowed.");
		}

		let matchedRule = false;

		for (const [service, rule] of Object.entries(WebUrl.RULES)) {
			const domainMatch = rule.altDomains.some((regex) =>
				regex.test(this.hostname),
			);

			if (!domainMatch) {
				continue;
			}

			matchedRule = true;

			const fullPath = this.pathname + this.search;

			const pathMatch = rule.paths.some((regex) => regex.test(fullPath));

			if (!pathMatch) {
				this.errors.push(`Invalid path for ${service}.`);
			}

			break;
		}

		if (!matchedRule) {
			this.errors.push(`Domain "${this.hostname}" is not allowed.`);
		}
	}
}
