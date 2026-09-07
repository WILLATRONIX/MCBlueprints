import { Fault } from "../fault/fault";

export type NetworkRequestOptions = {
	headers?: HeadersInit;
	body?: unknown;
	cache?: RequestCache;
	next?: NextFetchRequestConfig;
	credentials?: RequestCredentials;
	signal?: AbortSignal;
};

export class NetworkClient {
	constructor(
		private readonly baseUrl = "",
		private readonly defaultHeaders: HeadersInit = {},
	) {}

	public async get<T>(
		url: string,
		options: NetworkRequestOptions = {},
	): Promise<T> {
		return this.request<T>("GET", url, options);
	}

	public async post<T>(
		url: string,
		options: NetworkRequestOptions = {},
	): Promise<T> {
		return this.request<T>("POST", url, options);
	}

	public async put<T>(
		url: string,
		options: NetworkRequestOptions = {},
	): Promise<T> {
		return this.request<T>("PUT", url, options);
	}

	public async patch<T>(
		url: string,
		options: NetworkRequestOptions = {},
	): Promise<T> {
		return this.request<T>("PATCH", url, options);
	}

	public async delete<T>(
		url: string,
		options: NetworkRequestOptions = {},
	): Promise<T> {
		return this.request<T>("DELETE", url, options);
	}

	private async request<T>(
		method: string,
		url: string,
		options: NetworkRequestOptions,
	): Promise<T> {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...this.defaultHeaders,
			...options.headers,
		};

		const response = await fetch(this.baseUrl + url, {
			method,
			headers,
			cache: options.cache,
			next: options.next,
			credentials: options.credentials ? options.credentials : "include",
			signal: options.signal,

			body:
				options.body !== undefined ? JSON.stringify(options.body) : undefined,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Fault(
				data.message || `Request failed with status ${response.status}`,
				`network_client_${response.status}`,
				{ meta: data },
			);
		}

		return data as T;
	}
}

export const mcbpsApi = new NetworkClient(process.env.NEXT_PUBLIC_BACKEND_URL, {
	Authorization: "",
});
