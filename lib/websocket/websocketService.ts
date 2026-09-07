import { Fault } from "../fault/fault";

let socket: WebSocket | null = null;

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
			throw new Fault(
				"The WebSocket encountered an error",
				"web_socket_error",
				{ cause: event },
			);
		});

		socket.addEventListener("close", (event) => {
			throw new Fault(
				"The WebSocket closed unexpectedly",
				"web_socket_closure",
				{ cause: event },
			);
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
