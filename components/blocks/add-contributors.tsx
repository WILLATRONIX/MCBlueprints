import { Edit2, Plus, User, XIcon } from "lucide-react";

import {
	Attachment,
	AttachmentAction,
	AttachmentActions,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "../ui/button";

export function AddContributors() {
	return (
		<div className="mx-auto flex w-full flex-col gap-2 bg-background/50 p-2">
			<Attachment state="done" className="w-full bg-muted">
				<AttachmentMedia className="bg-background">
					<User />
				</AttachmentMedia>
				<AttachmentContent>
					<AttachmentTitle>username</AttachmentTitle>
					<AttachmentDescription>contribution details</AttachmentDescription>
				</AttachmentContent>
				<AttachmentActions className="gap-1">
					<AttachmentAction aria-label="Edit contributor" variant="secondary">
						<Edit2 />
					</AttachmentAction>
					<AttachmentAction
						aria-label="Remove uploaded-report.pdf"
						variant="secondary"
					>
						<XIcon />
					</AttachmentAction>
				</AttachmentActions>
			</Attachment>
			<Button className="h-13.5 border-dashed text-sm" variant="outline">
				<Plus />
				Add Contributor
			</Button>
		</div>
	);
}
