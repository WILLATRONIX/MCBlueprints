import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function PaidNotAllowedDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>
							You must be a creator to monetize projects
						</DialogTitle>
						<DialogDescription>
							To sell monetized projects, you&apos;ll need to be a verified
							creator on this platform
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button asChild>
							<Link href="/creator/register" target="_blank">
								<ExternalLink />
								Register for Creator
							</Link>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
