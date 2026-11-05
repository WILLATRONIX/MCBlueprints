import { FileFormat } from "@/lib/types/upload";
import type { Region } from "./Region";

export class Blueprint {
	readonly magic = 0xae5bb36;
	fileFormat: FileFormat;
	name: string;
	blockCount: number;
	version: number;
	thumbnail: string;
	thumbnailYaw: number;
	thumbnailPitch: number;
	lockedThumbnail: boolean;
	author: string;
	tags: string[];
	regions: Region[];

	constructor(data: {
		fileFormat: FileFormat;
		magic: number;
		name: string;
		blockCount: number;
		version: number;
		thumbnail: string;
		thumbnailYaw?: number;
		thumbnailPitch?: number;
		lockedThumbnail?: boolean;
		author: string;
		tags: string[];
		regions: Region[];
	}) {
		if (data.magic !== 0xae5bb36) {
			throw new Error("Invalid blueprint data.");
		}
		this.fileFormat = data.fileFormat;
		this.name = data.name;
		this.thumbnail = data.thumbnail;
		this.blockCount = data.blockCount;
		this.version = data.version;
		this.thumbnailYaw = data.thumbnailYaw || 135.0;
		this.thumbnailPitch = data.thumbnailPitch || 30.0;
		this.lockedThumbnail = data.lockedThumbnail || false;
		this.author = data.author;
		this.tags = data.tags || [];
		this.regions = data.regions;
	}
}
