"use client";

import { customToast } from "@/components/blocks/custom-toast";
import { Dropzone, DropzoneEmptyState } from "@/components/kibo-ui/dropzone";
import { Button } from "@/components/ui/button";
import parseBlueprint from "@/lib/minecraft/parsers/axiomBlueprint";
import {
	Edit,
	EllipsisVertical,
	FileImage,
	FileStack,
	FolderOpen,
	PanelLeft,
	Plus,
	Upload,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FileRejection } from "react-dropzone";
import { DirectoryBreadcrumb } from "./directoryBreadcrumb";
import { EditStringDialog } from "@/components/blocks/edit-string-dialog";
import UploadTree from "./uploadTree";
import { Separator } from "@/components/ui/separator";
import { getBufferHash } from "@/lib/utils/hash";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	createFileUpload,
	FileFormat,
	FileUpload,
	FolderUpload,
	UploadItems,
} from "@/lib/types/upload";
import { useAuthZStore } from "@/lib/zustand/auth";
import {
	projectContentAllowMultiple,
	projectContentFileFormat,
	ProjectContentType,
	projectContentTypeFriendly,
} from "@/lib/constants";
import { convertBytes } from "@/lib/utils/bytes";
import parseWorld from "@/lib/minecraft/parsers/mojangWorld";
import { Blueprint } from "@/lib/minecraft/types/AxiomBlueprint";
import { World } from "@/lib/minecraft/types/MojangWorld";
import UploadItemGrid from "./uploadItemGrid";

export type TagRepository = Record<string, number> | undefined;

export default function UploadManager({
	publicContent,
	monetized,
	contentType,
	projectName,
	projectId,
	onUploadItemClickAction,
	selectedFileState,
	uploadContent,
	setUploadContentAction,
}: {
	publicContent: boolean;
	monetized: boolean;
	contentType: ProjectContentType;
	projectName: string;
	projectId: string;
	onUploadItemClickAction: (
		newValue: FileUpload | FolderUpload | null,
		tagRepository?: TagRepository,
	) => void;
	selectedFileState: FileUpload | FolderUpload | null;
	uploadContent: UploadItems;
	setUploadContentAction: Dispatch<SetStateAction<UploadItems>>;
}) {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFileIDs, setSelectedFileIDs] = useState<Set<string>>(
		new Set(),
	);
	const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
	const [treeViewVisible, setTreeViewVisible] = useState(false);
	const [tagRepository, setTagRepository] = useState<TagRepository>();
	const [currentDirectoryPath, setCurrentDirectoryPath] =
		useState<string>("root");

	const authenticationState = useAuthZStore();

	const currentDirectoryRoute = currentDirectoryPath.split("/");
	const secondaryFileInputRef = useRef<HTMLInputElement>(null);
	const isCreator = authenticationState.user?.isCreator;

	type Parser = (data: ArrayBuffer) => Promise<Blueprint | World>;
	type Processor = (data: Blueprint | World) => void;

	const parsers: Record<string, Parser> = {
		".bp": parseBlueprint,
		".zip": parseWorld,
	} as const;

	const processors: Record<FileFormat, Processor> = {
		BlueprintV0: (data) => {
			if (!(data instanceof Blueprint)) return;

			setTagRepository((prev) => {
				const next = { ...prev };

				for (const tag of data.tags) {
					next[tag] = (next[tag] ?? 0) + 1;
				}

				return next;
			});
		},
		BlueprintV1: (data) => {
			if (!(data instanceof Blueprint)) return;

			setTagRepository((prev) => {
				const next = { ...prev };

				for (const tag of data.tags) {
					next[tag] = (next[tag] ?? 0) + 1;
				}

				return next;
			});
		},
		BlueprintV2: (data) => {
			if (!(data instanceof Blueprint)) return;

			setTagRepository((prev) => {
				const next = { ...prev };

				for (const tag of data.tags) {
					next[tag] = (next[tag] ?? 0) + 1;
				}

				return next;
			});
		},
		MojangWorld: (data) => {},
		Litematic: (data) => {},
		Schematic: (data) => {},
		SpongeV1: (data) => {},
		SpongeV2: (data) => {},
		SpongeV3: (data) => {},
	} as const;

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
		console.log(fileRejections);

		let skippedFiles = 0;

		for (const file of acceptedFiles) {
			const arrayBuffer = await file.arrayBuffer();
			const fileID = await getBufferHash(arrayBuffer);
			const extension = file.name
				.slice(file.name.lastIndexOf("."))
				.toLowerCase();

			if (uploadContent[fileID]) {
				skippedFiles++;
				continue;
			}

			const parseFile: Parser = parsers[extension];
			const parsed = await parseFile(arrayBuffer);

			const processFile: Processor = processors[parsed.fileFormat];
			processFile(parsed);

			const upload = createFileUpload(
				file,
				parsed,
				parsed.fileFormat,
				fileID,
				currentDirectoryPath,
			);

			setUploadContentAction((prev) => ({
				...prev,
				[fileID]: upload,
			}));
		}

		console.log(skippedFiles);
		setFiles(acceptedFiles);
	};

	const handleCreateFolder = (folderName: string) => {
		const cd = currentDirectoryPath;
		const key = cd + "/" + folderName;

		setUploadContentAction((prev) => ({
			...prev,
			[key]: {
				type: "folder",
				folderName,
				parentDirectoryPath: currentDirectoryPath,
				id: key,
			},
		}));
	};

	const handleMoveFile = (fileID: string, targetDirectoryID: string) => {
		setUploadContentAction((previous) => {
			const file = previous[fileID];

			if (!file || file.type === "folder") {
				return previous;
			}

			return {
				...previous,
				[fileID]: {
					...file,
					parentDirectoryPath: targetDirectoryID,
				},
			};
		});
	};

	useEffect(() => {
		const main = () => {
			if (selectedFileState) {
				setUploadContentAction((prev) => ({
					...prev,
					[selectedFileState.id]: selectedFileState,
				}));
			}
		};

		main();
	}, [selectedFileState, setUploadContentAction]);

	return (
		<div className="flex flex-col items-center w-full justify-center">
			{Object.keys(uploadContent).length === 0 ? (
				<Dropzone
					accept={{
						"application/octet-stream": [
							...projectContentFileFormat[contentType],
						],
					}}
					maxFiles={-1}
					multiple={projectContentAllowMultiple[contentType]}
					maxSize={convertBytes(
						isCreator && monetized
							? convertBytes(100, "mb")
							: convertBytes(1, "gb"),
					)}
					minSize={1024}
					onDrop={handleAddFiles}
					onError={(error) => {
						customToast({
							message: "Failed to add files",
							description: error.message,
							error: true,
						});
					}}
					className="flex bg-background w-[40vw] h-[40vh] not-last-of-type:min-w-xl min-h-64"
					src={files.length > 0 ? files : undefined}
				>
					<DropzoneEmptyState>
						<div className="flex items-center gap-4 p-10">
							<div className="flex size-18 items-center justify-center bg-card text-accent-foreground">
								<Upload className="size-6" />
							</div>
							<div className="text-left">
								<p className="font-medium text-lg">{`Upload ${projectContentTypeFriendly[contentType]}`}</p>
								<p className="text-muted-foreground text-sm">
									Drag and drop or click to upload
								</p>
								<p className="text-wrap text-muted-foreground text-xs">
									{`Accepts: ${projectContentFileFormat[contentType].join(", ")} up to ${isCreator && monetized ? "2GB" : "100MB"}`}
								</p>
							</div>
						</div>
					</DropzoneEmptyState>
				</Dropzone>
			) : (
				<div className="flex bg-transparent size-full flex-col overflow-hidden">
					<div className="flex h-full">
						{treeViewVisible && (
							<>
								<div className="max-w-96">
									<UploadTree
										uploadContent={uploadContent}
										selectedFileIDs={selectedFileIDs}
										onMoveFileAction={handleMoveFile}
										onUploadItemClickAction={(item) => {
											if (!item) return;

											onUploadItemClickAction(item, tagRepository);
											setSelectedFileIDs(new Set([item?.id]));
											setCurrentDirectoryPath(item?.parentDirectoryPath);
										}}
										onDirectoryClick={(directoryID) => {
											setCurrentDirectoryPath(directoryID);
											setSelectedFileIDs(new Set([directoryID]));
										}}
									/>
								</div>
								<Separator orientation="vertical" />
							</>
						)}
						<div className="flex flex-col w-full">
							<div className="flex p-2 px-4 gap-2 items-center">
								{uploadContent && (
									<DirectoryBreadcrumb
										route={currentDirectoryRoute}
										onNavigate={setCurrentDirectoryPath}
									/>
								)}
								<div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="icon-lg" variant="ghost">
												<Plus className="size-5" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent>
											<DropdownMenuItem
												onSelect={(e) => {
													e.preventDefault();
													secondaryFileInputRef.current?.click();
												}}
											>
												<FileImage />
												Add File
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => {
													setCreateFolderDialogOpen(true);
												}}
											>
												<FolderOpen />
												Create Folder
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="icon-lg" variant="ghost">
												<EllipsisVertical className="size-5" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent>
											<DropdownMenuItem
												onSelect={() => {
													const filesInCD = Object.entries(uploadContent)
														.filter(
															([, file]) =>
																file.parentDirectoryPath ===
																currentDirectoryPath,
														)
														.map(([id]) => id);
													setSelectedFileIDs(new Set(filesInCD));
												}}
											>
												<FileStack />
												Select All
											</DropdownMenuItem>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger
													disabled={selectedFileIDs.size <= 1}
												>
													<Edit />
													Selected
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem>Rename</DropdownMenuItem>
														<DropdownMenuItem>Add Tags</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem variant="destructive">
															Delete
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>

											<DropdownMenuCheckboxItem
												checked={treeViewVisible}
												onCheckedChange={setTreeViewVisible}
											>
												<PanelLeft />
												Sidebar
											</DropdownMenuCheckboxItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<Separator orientation="horizontal" />
							<UploadItemGrid
								currentDirectoryItems={currentDirectoryItems}
								selectedFileIDs={selectedFileIDs}
								tagRepository={tagRepository}
								onUploadItemClickAction={onUploadItemClickAction}
								setSelectedFileIDs={setSelectedFileIDs}
								setCurrentDirectoryPath={setCurrentDirectoryPath}
							/>
						</div>
					</div>
				</div>
			)}
			<EditStringDialog
				open={createFolderDialogOpen}
				onConfirmAction={handleCreateFolder}
				title="Create New Folder"
				placeholder="Folder name"
				description={`Create a new folder in "${currentDirectoryPath}"`}
				onOpenChangeAction={setCreateFolderDialogOpen}
			/>
			<input
				ref={secondaryFileInputRef}
				type="file"
				hidden
				multiple
				accept={projectContentFileFormat[contentType].join(", ")} //".bp,.schem,.schematic,.zip,.litematic"
				onChange={(e) => {
					handleAddFiles(Array.from(e.target.files ?? []), []);
					e.target.value = "";
				}}
			/>
		</div>
	);
}
