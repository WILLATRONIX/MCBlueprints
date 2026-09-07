export class Fault extends Error {
	event: string;
	meta?: Record<string, unknown>;

	constructor(
		message: string,
		event: string,
		options?: ErrorOptions & {
			meta?: Record<string, unknown>;
		},
	) {
		super(message, options);

		this.name = "Fault";
		this.event = event;
		this.meta = options?.meta;
	}
}
