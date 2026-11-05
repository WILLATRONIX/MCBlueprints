"use client";

import { TagRepository } from "@/app/create-project/[...slug]/components/uploadContent/uploadManager";
import {
	Tags,
	TagsContent,
	TagsEmpty,
	TagsGroup,
	TagsInput,
	TagsItem,
	TagsList,
	TagsTrigger,
	TagsValue,
} from "@/components/kibo-ui/tags";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Tag = { id: string; label: string };

export default function TagInput({
	defaultTags,
	availableTags,
}: {
	defaultTags: Tag[];
	availableTags: TagRepository;
	className?: string;
}) {
	const [selected, setSelected] = useState<string[]>(
		defaultTags?.map((tag) => {
			return tag.id;
		}),
	);
	const [newTag, setNewTag] = useState<string>("");
	const [tags, setTags] = useState<Tag[]>(defaultTags);

	const handleRemove = (value: string) => {
		if (!selected.includes(value)) {
			return;
		}

		setSelected((prev) => prev.filter((v) => v !== value));
	};

	const handleSelect = (value: string) => {
		if (selected.includes(value)) {
			handleRemove(value);
			return;
		}

		setSelected((prev) => [...prev, value]);
	};

	const handleCreateTag = (value: string) => {
		setTags((prev) => [
			...prev,
			{
				id: value,
				label: value,
			},
		]);

		setSelected((prev) => [...prev, value]);
		setNewTag("");
	};

	useEffect(() => {
		const main = () => {
			setTags(
				Object.keys(availableTags ?? {}).map((id) => ({
					id,
					label: id,
				})),
			);
			setSelected(
				defaultTags?.map((tag) => {
					return tag.id;
				}),
			);
		};

		main();
	}, [defaultTags, availableTags]);

	return (
		<Tags>
			<TagsTrigger
				className="min-h-8 text-sm"
				inputPlaceholder="Add or create a tag..."
			>
				{selected.map((tag) => (
					<TagsValue key={tag} onRemove={() => handleRemove(tag)}>
						{tags.find((t) => t.id === tag)?.label}
					</TagsValue>
				))}
			</TagsTrigger>
			<TagsContent>
				<TagsInput
					value={newTag}
					onValueChange={setNewTag}
					placeholder="Search tag..."
					onKeyDown={(e) => {
						if (e.key !== "Enter") return;

						e.preventDefault();

						const value = newTag.trim();
						if (!value) return;

						if (tags.some((tag) => tag.id === value)) {
							handleSelect(value);
							setNewTag("");
							return;
						}

						handleCreateTag(newTag);
					}}
				/>
				<TagsList>
					{newTag && (
						<TagsEmpty>
							<button
								className="mx-auto flex cursor-pointer items-center gap-2"
								onClick={() => {
									handleCreateTag(newTag);
								}}
								type="button"
							>
								<PlusIcon className="text-muted-foreground" size={14} />
								Create new tag: {newTag}
							</button>
						</TagsEmpty>
					)}
					<TagsGroup>
						{tags.map((tag) => (
							<TagsItem key={tag.id} onSelect={handleSelect} value={tag.id}>
								{tag.label}
								{selected.includes(tag.id) && (
									<CheckIcon className="text-muted-foreground" size={14} />
								)}
							</TagsItem>
						))}
					</TagsGroup>
				</TagsList>
			</TagsContent>
		</Tags>
	);
}
