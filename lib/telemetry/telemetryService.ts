"use client";

import { FaultService } from "../fault/faultService";
import "@/lib/telemetry/console";
import { Fault } from "../fault/fault";
import { useNotificationZStore } from "../zustand/notification";

const telemetryBuffer: TelemetryEntry[] = [];
let publishCooldown = false;

const notificationState = useNotificationZStore.getState();
console.log(notificationState.entries);
type TelemetryDeps = {
	socket?: WebSocket;
	faultService?: FaultService;
};

/**
 * Telemetry service used to create and queue telemetry entries.
 *
 * @note Always use __filename as the initiator for consistiency.
 *
 * @example
 * const telemetry = new Telemetry(__filename);
 *
 * telemetry.emit(
 *   "download_fail",
 *   "Failed to download file. Please try again.",
 * );
 *
 */
export class Telemetry {
	constructor(
		private initiator: string,
		private deps: TelemetryDeps = {},
	) {}

	emit(
		event: string,
		message?: string,
		level: TelemetryLevel = "debug",
		meta?: TelemetryMeta,
	) {
		const entry = new TelemetryEntry({
			initiator: this.initiator,
			event,
			message,
			level,
			meta,
		});

		telemetryBuffer.push(entry);
		this.onEmit();
	}

	private onEmit() {
		if (publishCooldown) return;

		publishCooldown = true;

		setTimeout(() => {
			this.publishTelemetry();
			publishCooldown = false;
		}, Number(process.env.NEXT_PUBLIC_TELEMETRY_EMIT_BUFFER_TIMEOUT!));
	}

	private publishTelemetry(): void {
		try {
			const socket = this.deps.socket;

			if (!socket) {
				notificationState.pushClientNotification({
					title: "Fatal Error",
					description:
						"Telemetry Service encountered an error. Please check logs.",
					type: "warning",
					showToast: true,
				});
				throw new Fault(
					"WebSocket is not initialized.",
					"telemetry_websocket_undefined",
				);
			}

			if (socket.readyState !== WebSocket.OPEN) {
				notificationState.pushClientNotification({
					title: "Fatal Error",
					description:
						"Telemetry Service encountered an error. Please check logs.",
					type: "warning",
					showToast: true,
				});
				throw new Fault("WebSocket is not open.", "telemetry_websocket_closed");
			}

			socket.send(JSON.stringify(telemetryBuffer));
			telemetryBuffer.length = 0;
		} catch (error) {
			console.error(error);
		}
	}
}

type TelemetryLevel = "debug" | "info" | "warn" | "error";

type TelemetryMeta = Record<string, string>;

class TelemetryEntry {
	message?: string;

	level: TelemetryLevel;
	initiator: string;
	timestamp: number;
	event: string;

	meta: TelemetryMeta;

	constructor({
		initiator,
		event,
		message,
		level = "debug",
		timestamp = Date.now(),
		meta = {},
	}: {
		initiator: string;
		event: string;

		message?: string;
		level?: TelemetryLevel;
		timestamp?: number;

		meta?: TelemetryMeta;
	}) {
		this.initiator = initiator;
		this.event = event;

		this.message = message;
		this.level = level;
		this.timestamp = timestamp;

		this.meta = meta;
	}
}

const closeAndFlush = () => {
	if (telemetryBuffer.length === 0) return;

	navigator.sendBeacon(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/telemetry/close-session`,
		new Blob(
			[
				JSON.stringify({
					sessionId: "",
					telemetry: telemetryBuffer,
				}),
			],
			{
				type: "application/json",
			},
		),
	);
};

if (typeof document !== "undefined") {
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") {
			closeAndFlush();
		}
	});

	window.addEventListener("pagehide", closeAndFlush);
}
