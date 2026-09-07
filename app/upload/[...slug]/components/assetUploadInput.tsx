"use client";

import { customToast } from "@/components/blocks/custom-toast";
import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import parseBlueprint from "@/lib/minecraft/parsers/axiomBlueprint";
import { Blueprint } from "@/lib/minecraft/types/AxiomBlueprint";
import { Folder, FolderClosed, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DirectoryBreadcrumb } from "./directoryBreadcrumb";
import { EditStringDialog } from "@/components/blocks/edit-string-dialog";
import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import UploadTree from "./uploadTree";
import { Separator } from "@/components/ui/separator";
import { getBufferHash } from "@/lib/utils/hash";

export type FileUpload = {
	type: "file";
	parsedData: Blueprint;
	fileData: File;
	parentDirectoryPath: string;
	id: string;
};

export type FolderUpload = {
	type: "folder";
	folderName: string;
	parentDirectoryPath: string;
	id: string;
};

type UploadItems = Record<string, FileUpload | FolderUpload>;

type RawDirectoryRoute = string[];

export default function UploadInput({
	onUploadItemClickAction,
	selectedFileState,
}: {
	onUploadItemClickAction: (newValue: FileUpload | FolderUpload | null) => void;
	selectedFileState: FileUpload | FolderUpload | null;
}) {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFileID, setSelectedFileID] = useState<string>();
	const [uploadContent, setUploadContent] = useState<UploadItems>({});
	const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
	const [isTreeView, setIsTreeView] = useState(false);
	const [currentDirectoryPath, setCurrentDirectoryPath] =
		useState<string>("root");

	const currentDirectoryRoute = currentDirectoryPath.split("/");

	const currentDirectoryItems = Object.entries(uploadContent)
		.filter(([, uploadItem]) => {
			return uploadItem.parentDirectoryPath === currentDirectoryPath;
		})
		.sort(([, a], [, b]) => {
			if (a.type !== b.type) {
				return a.type === "folder" ? -1 : 1;
			}

			const nameA = a.type === "folder" ? a.folderName : a.parsedData.name;

			const nameB = b.type === "folder" ? b.folderName : b.parsedData.name;

			return nameA.localeCompare(nameB);
		});

	const handleAddFiles = async (
		acceptedFiles: File[],
		fileRejections: FileRejection[],
	) => {
		// console.log(acceptedFiles);
		// console.log(fileRejections);

		let skippedFiles = 0;

		for (const file of acceptedFiles) {
			const arrayBuffer = await file.arrayBuffer();
			const fileID = await getBufferHash(arrayBuffer);

			if (uploadContent[fileID]) {
				skippedFiles++;
				continue;
			}

			const blueprint = await parseBlueprint(arrayBuffer);

			setUploadContent((prev) => ({
				...prev,
				[fileID]: {
					type: "file",
					parsedData: blueprint,
					fileData: file,
					id: fileID,
					parentDirectoryPath: currentDirectoryPath,
				},
			}));
		}

		console.log(skippedFiles);
		setFiles(acceptedFiles);
	};

	const handleCreateFolder = (folderName: string) => {
		const cd = currentDirectoryPath;
		const key = cd + "/" + folderName;

		setUploadContent((prev) => ({
			...prev,
			[key]: {
				type: "folder",
				folderName,
				parentDirectoryPath: currentDirectoryPath,
				id: key,
			},
		}));
	};

	useEffect(() => {
		const main = () => {
			if (selectedFileState) {
				setUploadContent((prev) => ({
					...prev,
					[selectedFileState.id]: selectedFileState,
				}));
			}
		};

		main();
	}, [selectedFileState]);

	return (
		<div className="flex flex-col items-center w-full justify-center pr-4">
			{Object.keys(uploadContent).length === 0 ? (
				<Dropzone
					accept={{
						"application/octet-stream": [
							".bp",
							".bpz",
							".schem",
							".schematic",
							".zip",
							".litematic",
						],
					}}
					maxFiles={-1}
					maxSize={1024 * 1024 * 10}
					minSize={1024}
					onDrop={handleAddFiles}
					onError={(error) => {
						customToast({
							message: "Failed to add files",
							description: error.message,
							error: true,
						});
					}}
					className="flex"
					src={files.length > 0 ? files : undefined}
				>
					<DropzoneEmptyState>
						<div className="flex items-center gap-4 p-4">
							<div className="flex size-18 items-center justify-center bg-cyan-900/80 text-cyan-100">
								<Upload className="size-6" />
							</div>
							<div className="text-left">
								<p className="font-medium text-lg">Upload a file</p>
								<p className="text-muted-foreground text-sm">
									Drag and drop or click to upload
								</p>
								<p className="text-muted-foreground text-sm">
									Accepts files up to 10MB.
								</p>
							</div>
						</div>
					</DropzoneEmptyState>
				</Dropzone>
			) : (
				<div className="flex bg-cyan-950 ring-2 ring-ring/50 size-full flex-col overflow-hidden">
					<div className="flex gap-2 p-4 items-center h-14 justify-between w-full">
						{uploadContent && (
							<DirectoryBreadcrumb
								route={currentDirectoryRoute}
								onNavigate={setCurrentDirectoryPath}
							/>
						)}
						<div className="flex gap-2 ml-auto">
							<Field orientation="horizontal">
								<Checkbox
									id="tree-checkbox"
									name="tree-checkbox"
									onCheckedChange={(checked) => {
										setIsTreeView((prev) => {
											if (prev === true && checked === false) {
												setCurrentDirectoryPath("root");
											}
											return checked === true;
										});
									}}
									checked={isTreeView}
								/>
								<Label htmlFor="tree-checkbox">Tree View</Label>
							</Field>
							<Button
								variant="outline"
								onClick={() => {
									setCreateFolderDialogOpen(true);
								}}
							>
								Create Folder
							</Button>
							<Button asChild>
								<label>
									Add Files
									<input
										type="file"
										hidden
										multiple
										accept=".bp,.bpz,.schem,.schematic,.zip,.litematic"
										onChange={(e) => {
											handleAddFiles(Array.from(e.target.files ?? []), []);
										}}
									/>
								</label>
							</Button>
						</div>
					</div>
					<Separator />
					<div
						className={`flex flex-row flex-wrap gap-2 overflow-auto ${!isTreeView && "px-4 pt-4"}`}
					>
						{isTreeView ? (
							<UploadTree
								uploadContent={uploadContent}
								selectedFileID={selectedFileID}
								onUploadItemClickAction={onUploadItemClickAction}
								onDirectoryClick={(directoryID) => {
									setCurrentDirectoryPath(directoryID);
									onUploadItemClickAction(uploadContent[directoryID]);
									setSelectedFileID(directoryID);
								}}
							/>
						) : (
							currentDirectoryItems.map(([id, uploadItem]) => {
								if (uploadItem.type === "folder") {
									return (
										<div key={id} className="flex flex-col pb-2">
											<div
												className={`flex size-24 items-center justify-center hover:cursor-pointer ${
													selectedFileID === id
														? "bg-cyan-800"
														: "bg-cyan-900/50 hover:bg-cyan-900"
												}`}
												onClick={() => {
													if (selectedFileID === id) {
														onUploadItemClickAction(null);
														setSelectedFileID("");
														setCurrentDirectoryPath(uploadItem.id);
														return;
													}

													onUploadItemClickAction(uploadItem);
													setSelectedFileID(id);
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
												selectedFileID === id
													? "bg-cyan-800"
													: "bg-cyan-900/50 hover:bg-cyan-900"
											}`}
											onClick={() => {
												if (selectedFileID === id) {
													onUploadItemClickAction(null);
													setSelectedFileID("");
													return;
												}

												onUploadItemClickAction(uploadItem);
												setSelectedFileID(id);
											}}
										>
											<Image
												src={uploadItem.parsedData.thumbnail}
												alt={uploadItem.parsedData.name}
												width={96}
												height={96}
												unoptimized
												draggable={false}
												className="flex items-center justify-center object-cover shadow-lg scale-y-[-1] select-none"
											/>
										</div>

										<p className="mt-1 w-full truncate text-center text-sm select-none">
											{uploadItem.parsedData.name}
										</p>
									</div>
								);
							})
						)}
					</div>
				</div>
			)}
			<EditStringDialog
				open={createFolderDialogOpen}
				onConfirmAction={handleCreateFolder}
				title="Create New Folder"
				description={`Create a new folder in ${currentDirectoryPath}`}
				onOpenChangeAction={setCreateFolderDialogOpen}
			/>
		</div>
	);
}
