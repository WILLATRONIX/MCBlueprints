import tar from "tar-stream";
import { unzipSync } from "fflate";
import type { FileUpload, UploadItems } from "../../types/upload";

interface ArchiveEntry {
	path: string;
	data: Uint8Array;
}

function normalizePath(path: string): string {
	const normalized = path.replace(/\\/g, "/");

	if (
		normalized.startsWith("/") ||
		/^[a-zA-Z]:/.test(normalized) ||
		normalized.split("/").some((part) => part === "..")
	) {
		throw new Error(`Invalid archive path: ${path}`);
	}

	return normalized.split("/").filter(Boolean).join("/");
}

function getParentPath(path: string): string {
	const directories = path.split("/").filter(Boolean);

	if (directories[0] !== "root") {
		throw new Error(`Invalid directory path: ${path}`);
	}

	return normalizePath(directories.slice(1).join("/"));
}

export async function createTar(
	uploads: UploadItems,
	onProgress?: (progress: number) => void,
): Promise<Uint8Array> {
	const archive = tar.pack();
	const entries: ArchiveEntry[] = [];

	try {
		for (const upload of Object.values(uploads)) {
			if (upload.type !== "file") continue;

			const file = upload as FileUpload;
			const parentPath = getParentPath(file.parentDirectoryPath);

			if (file.fileFormat === "MojangWorld") {
				const buffer = await file.fileData.arrayBuffer();
				const unzipped = unzipSync(new Uint8Array(buffer));

				const worldName = file.fileData.name.replace(/\.zip$/i, "");

				for (const [path, data] of Object.entries(unzipped)) {
					const normalizedPath = path.replace(/\\/g, "/");
					if (normalizedPath.endsWith("/")) continue;

					const relativePath = normalizedPath.includes("/")
						? normalizedPath.slice(normalizedPath.indexOf("/") + 1)
						: normalizedPath;

					const isRootFile = [
						"level.dat",
						"level.dat_old",
						"session.lock",
					].includes(relativePath);

					const isWorldDirectoryFile =
						relativePath.startsWith("entities/") ||
						relativePath.startsWith("region/");

					if (!isRootFile && !isWorldDirectoryFile) continue;

					const entryPath = normalizePath(
						[parentPath, worldName, relativePath].filter(Boolean).join("/"),
					);

					entries.push({ path: entryPath, data });
				}
			} else {
				const path = normalizePath(
					[parentPath, file.fileData.name].filter(Boolean).join("/"),
				);

				if (!path) {
					throw new Error(`Invalid filename: ${file.fileData.name}`);
				}

				entries.push({
					path,
					data: new Uint8Array(await file.fileData.arrayBuffer()),
				});
			}
		}

		const totalBytes = entries.reduce(
			(total, entry) => total + entry.data.byteLength,
			0,
		);
		let completedBytes = 0;

		const tarPromise = new Promise<Uint8Array>((resolve, reject) => {
			const chunks: Uint8Array[] = [];

			archive.on("data", (chunk: unknown) => {
				if (!(chunk instanceof Uint8Array)) {
					reject(new Error("Invalid TAR stream chunk"));
					archive.destroy();
					return;
				}

				chunks.push(chunk);
			});

			archive.on("end", () => {
				const result = new Uint8Array(
					chunks.reduce((total, chunk) => total + chunk.byteLength, 0),
				);

				let offset = 0;

				for (const chunk of chunks) {
					result.set(chunk, offset);
					offset += chunk.byteLength;
				}

				resolve(result);
			});

			archive.on("error", reject);
		});

		for (const entry of entries) {
			await new Promise<void>((resolve, reject) => {
				archive.entry(
					{
						name: entry.path,
						size: entry.data.byteLength,
						type: "file",
					},
					entry.data,
					(error) => {
						if (error) {
							reject(error);
							return;
						}

						completedBytes += entry.data.byteLength;

						onProgress?.(
							totalBytes === 0 ? 100 : (completedBytes / totalBytes) * 100,
						);

						resolve();
					},
				);
			});
		}

		archive.finalize();

		return await tarPromise;
	} catch (error) {
		archive.destroy(error instanceof Error ? error : new Error(String(error)));

		throw error;
	}
}
