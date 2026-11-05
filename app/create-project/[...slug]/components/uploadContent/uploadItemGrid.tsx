import { FileUpload, FolderUpload } from "@/lib/types/upload";
import { Box, Folder } from "lucide-react";
import { TagRepository } from "./uploadManager";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadItemGridProps {
	currentDirectoryItems: [string, FileUpload | FolderUpload][];
	selectedFileIDs: Set<string>;
	tagRepository: TagRepository;
	onUploadItemClickAction: (
		newValue: FileUpload | FolderUpload | null,
		tagRepository?: TagRepository,
	) => void;
	setSelectedFileIDs: Dispatch<SetStateAction<Set<string>>>;
	setCurrentDirectoryPath: Dispatch<SetStateAction<string>>;
}

export default function UploadItemGrid({
	currentDirectoryItems,
	selectedFileIDs,
	tagRepository,
	onUploadItemClickAction,
	setCurrentDirectoryPath,
	setSelectedFileIDs,
}: UploadItemGridProps) {
	const getImageSrc = (
		uploadItem: FileUpload | FolderUpload,
	): string | null => {
		if (uploadItem.type === "folder") return "";

		switch (uploadItem.fileFormat) {
			case "BlueprintV0":
				return uploadItem.parsedData.thumbnail;
			case "BlueprintV1":
				return uploadItem.parsedData.thumbnail;
			case "MojangWorld":
				return uploadItem.parsedData.icon;
			default:
				return "";
		}
	};

	return (
		<div className="flex flex-row flex-wrap gap-2 overflow-auto px-4 pt-4">
			{currentDirectoryItems.map(([id, uploadItem]) => {
				if (uploadItem.type === "folder") {
					return (
						<div key={id} className="flex flex-col pb-2">
							<div
								className={`flex size-24 items-center justify-center hover:cursor-pointer ${
									selectedFileIDs?.has(id)
										? "bg-muted ring-ring/60 ring-2"
										: "bg-card hover:bg-muted"
								}`}
								onClick={() => {
									if (selectedFileIDs?.has(id)) {
										onUploadItemClickAction(null);
										setSelectedFileIDs(new Set());
										setCurrentDirectoryPath(uploadItem.id);
										return;
									}

									onUploadItemClickAction(uploadItem, tagRepository);
									setSelectedFileIDs(new Set([id]));
								}}
							>
								<Folder className="size-12" />
							</div>

							<p className="mt-1 w-full truncate text-center text-sm select-none">
								{uploadItem.folderName}
							</p>
						</div>
					);
				}

				return (
					<div key={id} className="flex w-24 flex-col pb-2">
						<div
							className={`flex items-center justify-center hover:cursor-pointer ${
								selectedFileIDs.has(id)
									? "bg-muted ring-ring/60 ring-2"
									: "bg-card hover:bg-muted"
							}`}
							onClick={() => {
								if (selectedFileIDs.has(id) && selectedFileIDs.size > 1) {
									setSelectedFileIDs((prev) => {
										const next = new Set(prev);
										next.delete(id);
										return next;
									});
									return;
								}

								if (selectedFileIDs.has(id)) {
									onUploadItemClickAction(null);
									setSelectedFileIDs(new Set());
									return;
								}

								onUploadItemClickAction(uploadItem, tagRepository);
								setSelectedFileIDs(new Set([id]));
							}}
						>
							{(() => {
								const src = getImageSrc(uploadItem);

								if (src) {
									return (
										<Image
											src={src}
											alt={uploadItem.parsedData.name}
											width={96}
											height={96}
											unoptimized
											draggable={false}
											className={cn(
												"flex items-center justify-center object-cover select-none",
												uploadItem.fileFormat.startsWith("Blueprint") &&
													"scale-y-[-1]",
											)}
										/>
									);
								} else {
									return (
										<div className="flex items-center justify-center object-cover select-none w-24 h-24 text-muted-foreground">
											<Box className="size-12" />
										</div>
									);
								}
							})()}
						</div>

						<p className="mt-1 w-full truncate text-center text-sm select-none">
							{uploadItem.parsedData.name}
						</p>
					</div>
				);
			})}
		</div>
	);
}
