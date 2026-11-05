"use client";

import { useState } from "react";
import {
	Sortable,
	SortableItem,
	SortableItemHandle,
} from "@/components/reui/sortable";
import {
	CheckIcon,
	Edit2,
	Plus,
	RefreshCwIcon,
	XIcon,
	GripVerticalIcon,
	FileWarning,
} from "lucide-react";
import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "@/components/ui/attachment";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "../ui/button";

type SortableItem = {
	id: string;
	title: string;
	description: string;
	type: "idle" | "uploading" | "processing" | "error" | "done";
	size: string;
};

const defaultItems: SortableItem[] = [
	{
		id: "1",
		title: "image-1.png",
		description: "Uploading · 64%",
		type: "uploading",
		size: "2.4 MB",
	},
	{
		id: "2",
		title: "image-2.png",
		description: "Uploaded · 1.8 MB",
		type: "done",
		size: "15.7 MB",
	},
	{
		id: "3",
		title: "image-3.png",
		description: "Upload failed.",
		type: "error",
		size: "8.3 MB",
	},
];

const getIcon = (type: SortableItem["type"]) => {
	switch (type) {
		case "uploading":
			return <Spinner className="size-5" />;
		case "error":
			return <FileWarning className="size-5" />;
		case "done":
			return <CheckIcon className="size-5" />;
	}
};

export function AddMediaAttachment() {
	const [items, setItems] = useState<SortableItem[]>(defaultItems);

	const handleValueChange = (newItems: SortableItem[]) => {
		setItems(newItems);

		console.log(newItems);
	};

	const getItemValue = (item: SortableItem) => item.id;

	return (
		<div className="mx-auto flex w-full flex-col gap-2 bg-background/50 p-2">
			<Sortable
				value={items}
				onValueChange={handleValueChange}
				getItemValue={getItemValue}
				strategy="vertical"
				className="space-y-2"
			>
				{items.map((item) => (
					<SortableItem key={item.id} value={item.id}>
						<Attachment
							className="bg-muted border-border flex w-full items-center gap-2 border p-2 transition-colors"
							state={item.type}
						>
							<SortableItemHandle className="text-muted-foreground hover:text-foreground">
								<GripVerticalIcon className="h-4 w-4" />
							</SortableItemHandle>
							<AttachmentMedia className="bg-background">
								{getIcon(item.type)}
							</AttachmentMedia>
							<AttachmentContent>
								<AttachmentTitle>{item.title}</AttachmentTitle>
								<AttachmentDescription>
									{item.description}
								</AttachmentDescription>
							</AttachmentContent>
							<AttachmentActions className="gap-1">
								<AttachmentAction variant="secondary">
									{item.type === "error" ? <RefreshCwIcon /> : <Edit2 />}
								</AttachmentAction>
								<AttachmentAction variant="secondary">
									<XIcon />
								</AttachmentAction>
							</AttachmentActions>
						</Attachment>
					</SortableItem>
				))}
			</Sortable>
			<Button className="h-13.5 border-dashed text-sm" variant="outline">
				<Plus />
				Add Media
			</Button>
		</div>
	);
}
