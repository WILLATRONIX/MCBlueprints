import { Fault } from "../fault/fault";
import { useNotificationZStore } from "../zustand/notification";

let socket: WebSocket | null = null;
const notificationState = useNotificationZStore.getState();

if (typeof window !== "undefined") {
	try {
		if (!process.env.NEXT_PUBLIC_WEB_SOCKET_URL) {
			throw new Fault(
				"Web socket URL is undefined.",
				"next_public_web_socket_url_undefined",
			);
		}
		socket = new WebSocket(process.env.NEXT_PUBLIC_WEB_SOCKET_URL!);

		socket.onopen = () => {
			sendPacket({ type: "handshake" }, () => {
				console.log("WebSocket Connected.");
			});
		};

		socket.addEventListener("message", (event) => {
			console.log("Message from server ", event.data);
		});

		socket.addEventListener("error", (event) => {
			notificationState.pushClientNotification({
				title: "Fatal Error",
				description: "WebSocket encountered an error. Please check logs.",
				type: "warning",
				showToast: true,
			});
			throw new Fault("The WebSocket encountered an error", "websocket_error", {
				cause: event,
			});
		});

		socket.addEventListener("close", (event) => {
			notificationState.pushClientNotification({
				title: "Fatal Error",
				description: "WebSocket closed unexpectedly. Please check logs.",
				type: "error",
				showToast: true,
			});
			throw new Fault("The WebSocket closed unexpectedly", "websocket_closed", {
				cause: event,
			});
		});
	} catch (error) {
		console.log(
			new Fault("Failed to initialise WebSocket.", "websocket_fail", {
				cause: error,
			}),
		);
	}
}

type Packet = {
	type: "telemetry" | "handshake";
};

export function sendPacket(packet: Packet, onReply = (message: string) => {}) {}

export default socket;
