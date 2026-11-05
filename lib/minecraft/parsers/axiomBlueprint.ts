import nbt from "prismarine-nbt";
import zlib from "zlib";

import { Blueprint } from "../types/AxiomBlueprint";
import { Region } from "../types/Region";
import { FileFormat } from "@/lib/types/upload";

type NBTValue =
	string | number | boolean | NBTValue[] | { [key: string]: NBTValue };

function unwrap(obj: unknown): NBTValue {
	if (Array.isArray(obj)) return obj.map(unwrap);

	if (obj && typeof obj === "object") {
		if ("type" in obj && "value" in obj) {
			return unwrap((obj as { value: unknown }).value);
		}

		const result: Record<string, NBTValue> = {};
		for (const [key, val] of Object.entries(obj)) {
			result[key] = unwrap(val);
		}
		return result;
	}

	return obj as string | number | boolean;
}

function isBlockData(obj: unknown): obj is { BlockRegion: Region[] } {
	if (typeof obj !== "object" || obj === null) return false;
	const blockRegion = (obj as Record<string, unknown>)["BlockRegion"];

	return Array.isArray(blockRegion);
}

async function processThumbnail(bytes: Uint8Array): Promise<string> {
	let binary = "";

	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return `data:image/png;base64,${btoa(binary)}`;
}

export default async function parseBlueprint(
	data: ArrayBuffer,
): Promise<Blueprint> {
	const view = new DataView(data);

	const magic = view.getInt32(0, false);
	if (magic !== 0xae5bb36) throw new Error("Invalid blueprint magic");

	let offset = 4; // skip magic

	const headerLength = view.getInt32(offset, false);
	offset += 4;

	const { parsed: headerNBT } = await nbt.parse(
		data.slice(offset, offset + headerLength),
	);
	offset += headerLength;

	const thumbnailLength = view.getInt32(offset, false);
	offset += 4;

	const thumbnailBytes = new Uint8Array(data, offset, thumbnailLength);
	offset += thumbnailLength;

	const b64Thumbnail = await processThumbnail(thumbnailBytes);

	const blockDataLength = view.getInt32(offset, false);
	offset += 4;

	const compressedBlockData = Buffer.from(data, offset, blockDataLength);
	const decompressed = zlib.gunzipSync(compressedBlockData);
	const { parsed: blockData } = await nbt.parse(Buffer.from(decompressed));

	const headerUnwrapped = unwrap(headerNBT.value) as Record<string, unknown>;
	const unwrappedBlockData = unwrap(blockData);

	if (!isBlockData(unwrappedBlockData)) {
		throw new Error("Invalid block data: missing BlockRegion");
	}

	const blockDataUnwrapped = unwrappedBlockData;

	const versionRaw = headerUnwrapped.Version;
	const blueprintVersion = Array.isArray(versionRaw)
		? Number(versionRaw[0])
		: Number(versionRaw);

	const name = (headerUnwrapped.Name as string) || "";
	const blockCount = Number(headerUnwrapped.BlockCount || 0);
	const thumbnailYaw = Number(headerUnwrapped.ThumbnailYaw ?? 135.0);
	const thumbnailPitch = Number(headerUnwrapped.ThumbnailPitch ?? 30.0);
	const lockedThumbnail = Boolean(headerUnwrapped.LockedThumbnail ?? false);
	const author = (headerUnwrapped.Author as string) || "";
	const tags = (headerUnwrapped.Tags as string[]) || [];

	const formats = {
		0: "BlueprintV0",
		1: "BlueprintV1",
		2: "BlueprintV2",
	} as Record<number, FileFormat>;

	const blueprint = new Blueprint({
		fileFormat: formats[blueprintVersion],
		magic,
		name,
		blockCount,
		version: blueprintVersion,
		thumbnail: b64Thumbnail,
		thumbnailYaw,
		thumbnailPitch,
		lockedThumbnail,
		author,
		tags,
		regions: blockDataUnwrapped.BlockRegion,
	});

	return blueprint;
}
