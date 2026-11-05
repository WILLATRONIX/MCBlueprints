"use client";

type Operation = "compress" | "decompress";

type PendingRequest = {
	resolve: (data: Uint8Array) => void;
	reject: (error: Error) => void;
};

class ZstdClient {
	private worker: Worker;
	private nextId = 0;
	private pending = new Map<number, PendingRequest>();

	constructor() {
		this.worker = new Worker(new URL("./worker.ts", import.meta.url));

		this.worker.onmessage = (event) => {
			const { id, result, error } = event.data as {
				id: number;
				result?: ArrayBuffer;
				error?: string;
			};

			const request = this.pending.get(id);
			if (!request) return;

			this.pending.delete(id);

			if (error) {
				request.reject(new Error(error));
			} else if (result) {
				request.resolve(new Uint8Array(result));
			}
		};

		this.worker.onerror = (event) => {
			for (const request of this.pending.values()) {
				request.reject(new Error(event.message));
			}
			this.pending.clear();
		};
	}

	private run(
		operation: Operation,
		data: Uint8Array,
		level?: number,
	): Promise<Uint8Array> {
		const id = this.nextId++;

		const input = data.slice();

		return new Promise((resolve, reject) => {
			this.pending.set(id, { resolve, reject });

			this.worker.postMessage({ id, operation, data: input.buffer, level }, [
				input.buffer,
			]);
		});
	}

	compress(data: Uint8Array, level = 3) {
		return this.run("compress", data, level);
	}

	decompress(data: Uint8Array) {
		return this.run("decompress", data);
	}

	terminate() {
		this.worker.terminate();

		for (const request of this.pending.values()) {
			request.reject(new Error("zstd worker terminated"));
		}

		this.pending.clear();
	}
}

export function createZstdClient() {
	return new ZstdClient();
}
