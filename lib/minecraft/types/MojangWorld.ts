import { FileFormat } from "@/lib/types/upload";

export class World {
	fileFormat: FileFormat;
	name: string;
	dataVersion: number;
	gameMode: number;
	icon: string | null;
	tags?: string[] | undefined;

	constructor(data: {
		fileFormat: FileFormat;
		name: string;
		dataVersion: number;
		gameMode: number;
		icon: string | null;
		tags?: string[] | undefined;
	}) {
		this.fileFormat = data.fileFormat;
		this.name = data.name;
		this.dataVersion = data.dataVersion;
		this.gameMode = data.gameMode;
		this.icon = data.icon;
		this.tags = data.tags;
	}
}
