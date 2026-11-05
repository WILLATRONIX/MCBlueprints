"use client";

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
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EditStringDialog({
	open,
	title,
	description,
	placeholder = "Enter new value here",
	confirmActionText = "Confirm",
	defaultStringValue,
	onConfirmAction,
	onOpenChangeAction,
}: {
	open?: boolean;
	title?: string;
	description?: string;
	placeholder?: string;
	confirmActionText?: string;
	defaultStringValue?: string;
	onOpenChangeAction?: (open: boolean) => void;
	onConfirmAction: (newValue: string) => void;
}) {
	const [inputString, setInputString] = useState<string>(
		defaultStringValue || "",
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChangeAction}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="flex items-center gap-2">
					<Input
						placeholder={placeholder}
						value={inputString}
						onChange={(event) => {
							setInputString(event.target.value);
						}}
					/>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="ghost">
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							type="button"
							onClick={() => {
								onConfirmAction(inputString);
							}}
						>
							{confirmActionText}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
