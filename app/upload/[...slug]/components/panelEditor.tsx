"use client";

import Image from "next/image";
import { FileUpload, FolderUpload } from "./assetUploadInput";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import TagInput from "@/components/blocks/tag-input";
import { Button } from "@/components/ui/button";
import { EditImageDialog } from "@/components/blocks/edit-image-dialog";
import { b64ImageToFile } from "@/lib/utils";
import { FolderClosed } from "lucide-react";

export default function PanelEditor({
	activeFile,
	saveChangesAction,
}: {
	activeFile: FileUpload | FolderUpload | null;
	saveChangesAction: (name: string, tags: string[]) => void;
}) {
	const [nameValue, setNameValue] = useState("");
	const [tags, setTags] = useState<string[]>([]);
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

	return (
		<div className="flex flex-col bg-cyan-950 ring-2 ring-ring/50 w-[20vw] shrink-0 max-w-96">
			{activeFile ? (
				<>
					{isFile ? (
						[
							<EditImageDialog
								key="edit"
								open={imageEditorOpen}
								onOpenChangeAction={setImageEditorOpen}
								// onImageChangeAction={}
								defaultImage={b64ImageToFile(
									activeFile.parsedData.thumbnail,
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

								<Image
									src={activeFile.parsedData.thumbnail}
									fill
									alt=""
									className="scale-y-[-1] object-contain"
								/>
							</div>,
						]
					) : (
						<div className="w-full aspect-square flex items-center justify-center">
							<FolderClosed className="size-full p-12 text-cyan-900" />
						</div>
					)}
					<Separator />
					<div className="p-2 flex gap-2 flex-col items-end">
						<Input
							className="h-9 text-sm"
							value={nameValue}
							onChange={(e) => {
								setNameValue(e.target.value);
							}}
						/>

						{isFile && (
							<TagInput
								defaultTags={tags.map((tag) => ({
									id: tag,
									label: tag,
								}))}
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
