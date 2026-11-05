"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import ImageEditor from "./image-editor";

export function EditImageDialog({
	open,
	onOpenChangeAction,
	defaultOpen,
	imageAspectRatioLocked,
	// onImageChangeAction,
	defaultImage,
}: {
	open?: boolean;
	defaultOpen?: boolean;
	imageAspectRatioLocked: boolean;
	onOpenChangeAction?: (open: boolean) => void;
	image?: File;
	// onImageChangeAction: () => void;
	defaultImage: File | null;
}) {
	return (
		<Dialog
			defaultOpen={defaultOpen}
			open={open}
			onOpenChange={onOpenChangeAction}
		>
			<form>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Edit Thumbnail</DialogTitle>
						<DialogDescription>
							{`Make changes to the images here. Click "Upload" to replace the image.`}
						</DialogDescription>
					</DialogHeader>
					<ImageEditor
						defaultFile={defaultImage}
						aspectRatioLocked
						defaultAspectRatio="1:1"
						// onChangeAction={onImageChangeAction}
					/>
					{/*<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Save changes</Button>
					</DialogFooter>*/}
				</DialogContent>
			</form>
		</Dialog>
	);
}
