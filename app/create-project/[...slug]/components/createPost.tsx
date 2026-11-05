import { Input } from "@/components/ui/input";
import CustomEditor from "@/components/blocks/custom-editor";
import TagInput from "@/components/blocks/tag-input";
import { AddMediaAttachment } from "@/components/blocks/add-media-attatchment";
import { AddContributors } from "@/components/blocks/add-contributors";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

export default function CreatePost({
	searchParams,
}: {
	searchParams?: Record<string, string | string[] | undefined>;
}) {
	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex flex-1 min-h-0 w-full items-center justify-center">
				<div className="flex h-auto w-280 flex-col gap-4 bg-muted p-4 items-center">
					<p className="text-lg text-center font-semibold">
						Create Project Post
					</p>
					<Separator />
					<FieldSet className="flex flex-row gap-8 w-full">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="title">Title</FieldLabel>
								<Input id="title" type="text" placeholder="My Post" />
							</Field>
							<Field>
								<FieldLabel>Description</FieldLabel>
								<CustomEditor />
								<FieldDescription>Supports Markdown</FieldDescription>
							</Field>
						</FieldGroup>
						<FieldGroup>
							<Field>
								<FieldLabel>Tags</FieldLabel>
								<TagInput availableTags={{ tag: 0 }} defaultTags={[]} />
							</Field>
							asset price
						</FieldGroup>
					</FieldSet>
					<Separator />
					<FieldGroup className="flex flex-row gap-8 w-full">
						<Field>
							<FieldLabel>Content Media</FieldLabel>
							<AddMediaAttachment />
						</Field>
						<Field>
							<FieldLabel>Contributors</FieldLabel>
							<AddContributors />
						</Field>
					</FieldGroup>
				</div>
			</div>
		</div>
	);
}
