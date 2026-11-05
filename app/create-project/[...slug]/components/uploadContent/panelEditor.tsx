"use client";

import Image from "next/image";
import { TagRepository } from "./uploadManager";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import TagInput from "@/components/blocks/tag-input";
import { Button } from "@/components/ui/button";
import { EditImageDialog } from "@/components/blocks/edit-image-dialog";
import { b64ImageToFile } from "@/lib/utils";
import { Box, FolderClosed } from "lucide-react";
import { FileUpload, FolderUpload } from "@/lib/types/upload";

export default function PanelEditor({
	activeFile,
	tagRepository,
	saveChangesAction,
}: {
	activeFile: FileUpload | FolderUpload | null;
	tagRepository: TagRepository;
	saveChangesAction: (name: string, tags: string[]) => void;
}) {
	const [nameValue, setNameValue] = useState("");
	const [tags, setTags] = useState<string[] | undefined>([]);
	const [imageEditorOpen, setImageEditorOpen] = useState(false);

	const isFile = activeFile?.type === "file";

	const hasChanges = isFile
		? nameValue !== activeFile.parsedData.name
		: nameValue !== activeFile?.folderName;

	useEffect(() => {
		const main = () => {
			if (activeFile?.type === "file") {
				setNameValue(activeFile.parsedData.name);
				setTags(activeFile.parsedData.tags);
			} else if (activeFile?.type === "folder") {
				setNameValue(activeFile.folderName);
				setTags([]);
			}
		};
		main();
	}, [activeFile]);

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
		<div className="flex flex-col bg-background ring ring-ring/20 w-[20vw] shrink-0 max-w-96 mb-px">
			{activeFile ? (
				<>
					{isFile ? (
						[
							<EditImageDialog
								key="edit"
								open={imageEditorOpen}
								onOpenChangeAction={setImageEditorOpen}
								// onImageChangeAction={}
								imageAspectRatioLocked={false}
								defaultImage={b64ImageToFile(
									getImageSrc(activeFile),
									"image.png",
								)}
							/>,
							<div className="relative w-full aspect-square h-min" key="img">
								<div
									className="absolute z-10 size-full flex items-center justify-center bg-black/40 hover:cursor-pointer opacity-0 hover:opacity-100"
									onClick={() => {
										setImageEditorOpen(true);
									}}
								>
									<p>click to edit</p>
								</div>

								{(() => {
									const src = getImageSrc(activeFile);

									if (src) {
										return (
											<Image
												src={src}
												fill
												alt=""
												className="scale-y-[-1] object-contain"
											/>
										);
									} else {
										return <Box className="size-12" />;
									}
								})()}
							</div>,
						]
					) : (
						<div className="w-full aspect-square flex items-center justify-center">
							<FolderClosed className="size-full p-12 text-cyan-900" />
						</div>
					)}
					<div className="p-2 flex gap-2 flex-col items-end">
						<Input
							className="text-sm"
							value={nameValue}
							onChange={(e) => {
								setNameValue(e.target.value);
							}}
						/>

						{isFile && (
							<TagInput
								defaultTags={
									tags
										? tags.map((tag) => ({
												id: tag,
												label: tag,
											}))
										: []
								}
								availableTags={tagRepository}
								// onTagsChange={(newTags) => {
								// 	setTags(newTags.map((tag) => tag.label));
								// }}
							/>
						)}

						<Button
							disabled={!hasChanges}
							onClick={() => {
								saveChangesAction(nameValue, tags);
							}}
						>
							Save Changes
						</Button>
					</div>
				</>
			) : (
				<div className="size-full flex items-center justify-center">
					<p>Click a file to edit.</p>
				</div>
			)}
		</div>
	);
}
