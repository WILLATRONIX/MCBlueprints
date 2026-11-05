import { Telemetry } from "../telemetry/telemetryService";
import { getClientUtcOffset, isStringRecord } from "../utils";
import socket from "../websocket/websocketService";
import { Fault } from "./fault";
import { AppRoutes } from "@/.next/dev/types/routes";

type FaultLevel = "warn" | "error";

class FaultContainer {
	initiator: string;
	eventRoute: string;

	rootFault: Fault;

	timestamp: number;
	meta: Record<string, string>;
	level: FaultLevel;

	constructor({
		initiator,
		rootFault,
		meta = {},
		level = "error",
	}: {
		initiator: string;
		rootFault: Fault;

		meta?: Record<string, string>;
		level?: FaultLevel;
	}) {
		this.initiator = initiator;

		this.eventRoute =
			rootFault.event + ":" + (rootFault?.cause as Fault)?.event;

		this.rootFault = rootFault;

		this.timestamp = Date.now();
		this.meta = meta;
		this.level = level;
	}

	process() {
		if (this.rootFault.event !== "telemetry_fail") {
			if (!socket) {
				console.log("socket not connected");
				return;
			}
			const telemetry = new Telemetry(this.initiator, { socket });

			telemetry.emit(
				this.rootFault.event,
				this.rootFault.message,
				this.level,
				this.meta,
			);
		}
	}
}

/**
 * Displays applicable faults to the user and emits to the telemetry buffer.
 * @param fault The fault to process.
 */
export class FaultService {
	constructor(private initiator: AppRoutes) {}

	raise(fault: Fault) {
		let metadata = isStringRecord(fault.meta) ? fault.meta : undefined;

		metadata = {
			...metadata,
			browser: JSON.stringify({
				userAgent: navigator.userAgent,
				url: window.location.href,
				pathname: window.location.pathname,
				language: navigator.language,
				timezone: getClientUtcOffset(),
			}),
		};

		new FaultContainer({
			initiator: this.initiator,
			rootFault: fault,
			meta: metadata,
		}).process();
	}
}
