import nbt from "prismarine-nbt";
import { unzipSync } from "fflate";

import { World } from "../types/MojangWorld";

export default async function parseWorld(data: ArrayBuffer): Promise<World> {
	const files = unzipSync(new Uint8Array(data));

	const levelDatPath = Object.keys(files).find(
		(path) => path.endsWith("/level.dat") || path === "level.dat",
	);

	if (!levelDatPath) {
		throw new Error("Invalid world archive: level.dat not found.");
	}

	const iconPath = Object.keys(files).find(
		(path) => path === "icon.png" || path.endsWith("/icon.png"),
	);

	let icon = null;

	if (iconPath) {
		const resolvedIconPng = files[iconPath];

		const base64Icon = btoa(
			Array.from(resolvedIconPng, (byte) => String.fromCharCode(byte)).join(""),
		);

		icon = `data:image/png;base64,${base64Icon}`;
	}

	const levelDat = files[levelDatPath];

	const { parsed } = await nbt.parse(
		levelDat.buffer.slice(
			levelDat.byteOffset,
			levelDat.byteOffset + levelDat.byteLength,
		) as ArrayBuffer,
	);

	const root = nbt.simplify(parsed) as {
		Data?: Record<string, string | number | Record<string, string | number>>;
	};

	const level = root.Data;

	if (!level) {
		throw new Error("Invalid level.dat: Data compound not found.");
	}

	const dataVersion = (level.DataVersion ?? 0) as number;

	return new World({
		fileFormat: `MojangWorld`,
		name: level.LevelName as string,
		dataVersion: dataVersion,
		gameMode: (level.GameType ?? 0) as number,
		icon,
	});
}
