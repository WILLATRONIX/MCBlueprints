"use client";

import { useMemo, useState } from "react";
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	pointerWithin,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";

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

import { FileImage } from "lucide-react";
import { FileUpload, FolderUpload, UploadItems } from "@/lib/types/upload";

interface UploadTreeProps {
	uploadContent: UploadItems;
	onUploadItemClickAction: (item: FileUpload | FolderUpload | null) => void;
	onDirectoryClick?: (directoryID: string) => void;
	onMoveFileAction: (fileID: string, targetDirectoryID: string) => void;
	selectedFileIDs?: Set<string>;
}

interface UploadTreeTriggerProps {
	item: FileUpload | FolderUpload;
	selected?: boolean;
	dragging?: boolean;
	onClick?: () => void;
}

function UploadTreeTrigger({
	item,
	selected,
	dragging = false,
	onClick,
}: UploadTreeTriggerProps) {
	const isFolder = item.type === "folder";

	return (
		<TreeNodeTrigger
			selected={selected}
			onClick={onClick}
			className={[
				"w-full",
				dragging
					? "cursor-grabbing rounded-md border bg-background shadow-lg ring-2 ring-primary/40"
					: "",
			]
				.filter(Boolean)
				.join(" ")}
		>
			<TreeExpander hasChildren={isFolder} />

			{isFolder ? (
				<TreeIcon hasChildren />
			) : (
				<TreeIcon icon={<FileImage className="h-4 w-4" />} />
			)}

			<TreeLabel>{isFolder ? item.folderName : item.parsedData.name}</TreeLabel>
		</TreeNodeTrigger>
	);
}

interface UploadTreeNodeProps {
	item: FileUpload | FolderUpload;
	uploadContent: UploadItems;
	level: number;
	isLast: boolean;
	selectedFileIDs?: Set<string>;
	onUploadItemClickAction: (item: FileUpload | FolderUpload | null) => void;
	onDirectoryClick?: (directoryID: string) => void;
}

function UploadTreeNode({
	item,
	uploadContent,
	level,
	isLast,
	selectedFileIDs,
	onUploadItemClickAction,
	onDirectoryClick,
}: UploadTreeNodeProps) {
	const isFolder = item.type === "folder";

	const children = useMemo(
		() =>
			Object.values(uploadContent)
				.filter((child) => child.parentDirectoryPath === item.id)
				.sort((a, b) => {
					if (a.type !== b.type) {
						return a.type === "folder" ? -1 : 1;
					}

					const nameA = a.type === "folder" ? a.folderName : a.parsedData.name;
					const nameB = b.type === "folder" ? b.folderName : b.parsedData.name;

					return nameA.localeCompare(nameB);
				}),
		[uploadContent, item.id],
	);

	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: item.id,
		disabled: isFolder,
		data: { item },
	});

	const { setNodeRef: setDropRef, isOver } = useDroppable({
		id: `directory:${item.id}`,
		disabled: !isFolder,
		data: { directoryID: item.id },
	});

	const setRefs = (element: HTMLDivElement | null) => {
		setNodeRef(element);
		setDropRef(element);
	};

	return (
		<TreeNode nodeId={item.id} level={level} isLast={isLast}>
			<div
				ref={setRefs}
				className={[
					"rounded-md",
					isDragging ? "opacity-30" : "",
					isFolder && isOver ? "bg-primary/15 ring-2 ring-primary" : "",
				]
					.filter(Boolean)
					.join(" ")}
				{...(!isFolder ? attributes : {})}
				{...(!isFolder ? listeners : {})}
			>
				<UploadTreeTrigger
					item={item}
					selected={selectedFileIDs?.has(item.id)}
					onClick={() => {
						if (isFolder) {
							onDirectoryClick?.(item.id);
							return;
						}

						onUploadItemClickAction(
							selectedFileIDs?.has(item.id) ? null : item,
						);
					}}
				/>
			</div>

			{isFolder && children.length > 0 && (
				<TreeNodeContent hasChildren>
					{children.map((child, index) => (
						<UploadTreeNode
							key={child.id}
							item={child}
							uploadContent={uploadContent}
							level={level + 1}
							isLast={index === children.length - 1}
							selectedFileIDs={selectedFileIDs}
							onUploadItemClickAction={onUploadItemClickAction}
							onDirectoryClick={onDirectoryClick}
						/>
					))}
				</TreeNodeContent>
			)}
		</TreeNode>
	);
}

export default function UploadTree({
	uploadContent,
	onUploadItemClickAction,
	onDirectoryClick,
	onMoveFileAction,
	selectedFileIDs,
}: UploadTreeProps) {
	const [activeItem, setActiveItem] = useState<
		FileUpload | FolderUpload | null
	>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
	);

	const rootItems = useMemo(
		() =>
			Object.values(uploadContent)
				.filter((item) => item.parentDirectoryPath === "root")
				.sort((a, b) => {
					if (a.type !== b.type) {
						return a.type === "folder" ? -1 : 1;
					}

					const nameA = a.type === "folder" ? a.folderName : a.parsedData.name;
					const nameB = b.type === "folder" ? b.folderName : b.parsedData.name;

					return nameA.localeCompare(nameB);
				}),
		[uploadContent],
	);

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		setActiveItem(null);

		if (!over) return;

		const draggedItem = uploadContent[String(active.id)];
		const targetDirectoryID = over.data.current?.directoryID as
			string | undefined;

		if (!draggedItem || draggedItem.type === "folder") return;
		if (!targetDirectoryID) return;
		if (draggedItem.parentDirectoryPath === targetDirectoryID) return;

		const target = uploadContent[targetDirectoryID];

		if (!target || target.type !== "folder") return;

		onMoveFileAction(draggedItem.id, targetDirectoryID);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={({ active }) => {
				const item = uploadContent[String(active.id)];
				setActiveItem(item ?? null);
			}}
			onDragEnd={handleDragEnd}
			onDragCancel={() => setActiveItem(null)}
		>
			<TreeProvider>
				<TreeView>
					{rootItems.map((item, index) => (
						<UploadTreeNode
							key={item.id}
							item={item}
							uploadContent={uploadContent}
							level={0}
							isLast={index === rootItems.length - 1}
							selectedFileIDs={selectedFileIDs}
							onUploadItemClickAction={onUploadItemClickAction}
							onDirectoryClick={onDirectoryClick}
						/>
					))}
				</TreeView>

				<DragOverlay dropAnimation={null}>
					{activeItem && (
						<div className="pointer-events-none w-full rounded-md bg-background shadow-xl ring-2 ring-primary/50">
							<UploadTreeTrigger item={activeItem} selected={false} dragging />
						</div>
					)}
				</DragOverlay>
			</TreeProvider>
		</DndContext>
	);
}
