import { Blueprint } from "../minecraft/types/AxiomBlueprint";
import { World } from "../minecraft/types/MojangWorld";

export type FileFormatData = {
	BlueprintV0: Blueprint;
	BlueprintV1: Blueprint;
	BlueprintV2: Blueprint;
	SpongeV1: Blueprint;
	SpongeV2: Blueprint;
	SpongeV3: Blueprint;
	Litematic: Blueprint;
	MojangWorld: World;
	Schematic: Blueprint;
};

export type FileFormat = keyof FileFormatData;

export type FileUpload = {
	[K in FileFormat]: {
		type: "file";
		parsedData: FileFormatData[K];
		fileData: File;
		fileFormat: K;
		parentDirectoryPath: string;
		id: string;
	};
}[FileFormat];

export type FolderUpload = {
	type: "folder";
	folderName: string;
	parentDirectoryPath: string;
	id: string;
};

export type UploadItems = Record<string, FileUpload | FolderUpload>;

export function createFileUpload<K extends FileFormat>(
	file: File,
	parsed: FileFormatData[K],
	fileFormat: K,
	fileID: string,
	parentDirectoryPath: string,
): Extract<FileUpload, { fileFormat: K }> {
	return {
		type: "file",
		parsedData: parsed,
		fileData: file,
		id: fileID,
		fileFormat,
		parentDirectoryPath,
	} as Extract<FileUpload, { fileFormat: K }>;
}
