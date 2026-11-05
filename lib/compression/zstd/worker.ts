/// <reference lib="webworker" />

import { init, compress, decompress } from "@bokuweb/zstd-wasm";

type Request =
	| {
			id: number;
			operation: "compress";
			data: ArrayBuffer;
			level?: number;
	  }
	| {
			id: number;
			operation: "decompress";
			data: ArrayBuffer;
	  };

let initPromise: Promise<void> | undefined;

async function initialize() {
	initPromise ??= init();
	await initPromise;
}

self.onmessage = async (event: MessageEvent<Request>) => {
	const request = event.data;

	try {
		await initialize();

		const input = new Uint8Array(request.data);

		const result =
			request.operation === "compress"
				? compress(input, request.level ?? 3)
				: decompress(input);

		self.postMessage(
			{ id: request.id, result: result.buffer },
			{ transfer: [result.buffer] },
		);
	} catch (error) {
		self.postMessage({
			id: request.id,
			error: error instanceof Error ? error.message : String(error),
		});
	}
};
