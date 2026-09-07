"use client";

import {
	TreeExpander,
	TreeIcon,
	TreeLabel,
	TreeNode,
	TreeNodeContent,
	TreeNodeTrigger,
	TreeProvider,
	TreeView,
} from "@/components/kibo-ui/tree";

import { FileImage, FolderClosed } from "lucide-react";
import { FileUpload, FolderUpload } from "./assetUploadInput";

export type UploadItem = FileUpload | FolderUpload;

export type UploadItems = Record<string, UploadItem>;

interface UploadTreeProps {
	uploadContent: UploadItems;
	onUploadItemClickAction: (item: FileUpload | FolderUpload | null) => void;
	onDirectoryClick?: (directoryID: string) => void;
	selectedFileID?: string;
}

export default function UploadTree({
	uploadContent,
	onUploadItemClickAction,
	onDirectoryClick,
	selectedFileID,
}: UploadTreeProps) {
	const getChildren = (parentDirectoryPath: string) => {
		return Object.values(uploadContent)
			.filter((item) => item.parentDirectoryPath === parentDirectoryPath)
			.sort((a, b) => {
				if (a.type !== b.type) {
					return a.type === "folder" ? -1 : 1;
				}

				const nameA = a.type === "folder" ? a.folderName : a.parsedData.name;

				const nameB = b.type === "folder" ? b.folderName : b.parsedData.name;

				return nameA.localeCompare(nameB);
			});
	};

	const renderTreeNodes = (parentDirectoryID: string, level: number) => {
		const children = getChildren(parentDirectoryID);

		return children.map((item, index) => {
			const isLast = index === children.length - 1;

			if (item.type === "folder") {
				const folderChildren = getChildren(item.id);
				const hasChildren = folderChildren.length > 0;

				return (
					<TreeNode
						key={item.id}
						nodeId={item.id}
						level={level}
						isLast={isLast}
					>
						<TreeNodeTrigger
							onClick={() => {
								onDirectoryClick?.(item.id);
							}}
						>
							<TreeExpander hasChildren={hasChildren} />
							<TreeIcon hasChildren={hasChildren} />
							<TreeLabel>{item.folderName}</TreeLabel>
						</TreeNodeTrigger>

						{hasChildren && (
							<TreeNodeContent hasChildren>
								{renderTreeNodes(item.id, level + 1)}
							</TreeNodeContent>
						)}
					</TreeNode>
				);
			}

			return (
				<TreeNode key={item.id} nodeId={item.id} level={level} isLast={isLast}>
					<TreeNodeTrigger
						className={selectedFileID === item.id ? "bg-cyan-800" : undefined}
						onClick={() => {
							if (selectedFileID === item.id) {
								onUploadItemClickAction(null);
								return;
							}

							onUploadItemClickAction(item);
						}}
					>
						<TreeExpander />
						<TreeIcon icon={<FileImage className="h-4 w-4" />} />
						<TreeLabel>{item.parsedData.name}</TreeLabel>
					</TreeNodeTrigger>
				</TreeNode>
			);
		});
	};

	return (
		<TreeProvider
			onSelectionChange={(ids) => {
				console.log("Selected:", ids);
			}}
		>
			<TreeView>{renderTreeNodes("root", 0)}</TreeView>
		</TreeProvider>
	);
}
