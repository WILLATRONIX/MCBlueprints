"use client";

import DescriptiveSelect from "@/components/blocks/descriptive-select";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProjectContentType, ProjectMonetization } from "@/lib/constants";
import { mcbpsApi } from "@/lib/network/client";
import { MCBPS_ProjectCreateResponse } from "@/lib/types/apiResponses";
import { useAuthZStore } from "@/lib/zustand/auth";
import {
	Blocks,
	Box,
	LineStyle,
	Mountain,
	Palette,
	Toolbox,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PaidNotAllowedDialog from "./[...slug]/components/paidNotAllowed";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
	const [publicContent, setPublicContent] = useState<boolean | undefined>();
	const [monetized, setMonetized] = useState<boolean | undefined>();
	const [contentType, setContentType] = useState<
		ProjectContentType | undefined
	>();
	const [projectName, setProjectName] = useState<string>("");
	const [showPaidNotAllowed, setShowPaidNotAllowed] = useState<boolean>(false);
	const [awaitingResponse, setAwaitingResponse] = useState<boolean>(false);

	const authenticationState = useAuthZStore();

	const router = useRouter();

	const formPopulated =
		typeof publicContent !== "undefined" &&
		typeof monetized !== "undefined" &&
		typeof contentType !== "undefined" &&
		projectName.trim() !== "";

	async function onFormNext() {
		if (!authenticationState.user?.isCreator && monetized) {
			setShowPaidNotAllowed(true);
			return;
		}

		setAwaitingResponse(true);

		const response = await mcbpsApi.post<MCBPS_ProjectCreateResponse>(
			"/project/create",
			{
				body: {
					publicContent,
					monetized,
					contentType,
					projectName,
				},
			},
		);

		const params = new URLSearchParams({
			publicContent: String(response.project.isPublic),
			monetized: String(
				response.project.monetization !== ProjectMonetization.free,
			),
			contentType: String(response.project.contentType),
			projectName: response.project.projectName,
			projectId: response.project.id,
		});

		router.push(`/create-project/upload?${params.toString()}`);
	}

	return (
		<div className="flex flex-1 flex-col h-full w-full items-center justify-center">
			<div className="bg-muted border p-2 flex flex-col gap-4 max-w-lg w-full">
				<p className="text-lg text-center font-semibold">Create Project</p>
				<div className="flex flex-col gap-8 items-center">
					<Field className="px-4">
						<FieldLabel htmlFor="input-required">
							Project Name <span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="input-required"
							placeholder="My Project"
							required
							value={projectName}
							onChange={(event) => {
								setProjectName(
									event.target.value.replace(" ", "-").toLocaleLowerCase(),
								);
							}}
						/>
						<FieldDescription>
							Shown in My Repository. Only you will see this.
						</FieldDescription>
					</Field>
					<div className="border flex flex-col gap-4 px-2 py-4 w-full">
						<Item size="noPadding" className="px-2">
							<ItemContent>
								<ItemTitle>
									Content Visibility <span className="text-destructive">*</span>
								</ItemTitle>
								<ItemDescription>
									Choose who can see the contents of this project.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<DescriptiveSelect
									selectProps={{
										value:
											publicContent === undefined ? "" : String(publicContent),
										onValueChange: (newValue) => {
											setPublicContent(newValue === "true");
										},
									}}
									placeholder="select..."
									items={[
										{
											value: "true",
											description:
												"Anyone on the internet can see the contents of this project.",
											label: "Public",
										},
										{
											value: "false",
											description:
												"This project will not be listed. Only authorized users can contribute to this project.",
											label: "Private",
										},
									]}
								/>
							</ItemActions>
						</Item>
						<Separator />
						<Item size="noPadding" className="px-2">
							<ItemContent>
								<ItemTitle>
									Project Monetization
									<span className="text-destructive">*</span>
								</ItemTitle>
								<ItemDescription>
									Make money from selling this project.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<DescriptiveSelect
									selectProps={{
										value: monetized === undefined ? "" : String(monetized),
										onValueChange: (newValue) => {
											setMonetized(newValue === "true");
										},
									}}
									placeholder="select..."
									items={[
										{
											value: "false",
											description:
												"Anyone with access to this project can download it without charge.",
											label: "Free",
										},
										{
											value: "true",
											description:
												"This project will be sold for a profit. Only verified users can purchase this.",
											label: "Monetized",
										},
									]}
								/>
							</ItemActions>
						</Item>
						<Separator />
						<Item size="noPadding" className="px-2">
							<ItemContent>
								<ItemTitle>
									Content Type <span className="text-destructive">*</span>
								</ItemTitle>
								<ItemDescription>
									Select what type of content you&apos;ll be uploading.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Select
									value={contentType?.toString() || ""}
									onValueChange={(newValue) => setContentType(Number(newValue))}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="select..." />
									</SelectTrigger>
									<SelectContent position="popper" align="end" className="w-64">
										<SelectGroup>
											<SelectLabel>Minecraft Builds</SelectLabel>
											<SelectItem
												value={ProjectContentType.minecraft_asset.toString()}
											>
												<Blocks /> Asset
											</SelectItem>
											<SelectItem
												value={ProjectContentType.minecraft_world.toString()}
											>
												<Box />
												World
											</SelectItem>
										</SelectGroup>
										<SelectSeparator />
										<SelectGroup>
											<SelectLabel>Axiom</SelectLabel>
											<SelectItem
												value={ProjectContentType.axiom_theme.toString()}
											>
												<Palette /> Axiom Theme
											</SelectItem>
											<SelectItem
												value={ProjectContentType.axiom_preset.toString()}
											>
												<Toolbox /> Axiom Preset
											</SelectItem>
										</SelectGroup>
										<SelectSeparator />
										<SelectGroup>
											<SelectLabel>Building Utilities</SelectLabel>
											<SelectItem
												value={ProjectContentType.other_heightmap.toString()}
											>
												<Mountain />
												Heightmap
											</SelectItem>
											<SelectItem
												value={ProjectContentType.other_gradient.toString()}
											>
												<LineStyle />
												Block Gradient
											</SelectItem>
											<SelectItem
												value={ProjectContentType.other_palette.toString()}
											>
												<Palette />
												Block Palette
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</ItemActions>
						</Item>
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="secondary" asChild>
						<Link href={"/"}>Cancel</Link>
					</Button>
					<Button
						className="w-20"
						disabled={!formPopulated || awaitingResponse}
						onClick={onFormNext}
					>
						Next
					</Button>
				</div>
			</div>
			<PaidNotAllowedDialog
				open={showPaidNotAllowed}
				setOpen={setShowPaidNotAllowed}
			/>
		</div>
	);
}

// <div className="flex flex-col h-full items-center gap-4 pt-48">
// 	<div className="flex flex-col items-center justify-center gap-4 bg-card p-4 max-w-2xl w-[50vw] min-w-min text-start md:text-center h-44 div-frame">
// 		<p className="text-2xl">Select project type</p>
// 		<div className="flex gap-4 flex-wrap justify-center">
// 			<Button size="lg" className="w-36" asChild>
// 				<Link href="/upload/asset">Asset</Link>
// 			</Button>
// 			<Button size="lg" className="w-36" asChild>
// 				<Link href="/upload/assembly">Assembly</Link>
// 			</Button>
// 		</div>
// 		<a href="#info" className="underline text-sm text-muted-foreground">
// 			Click for information
// 		</a>
// 	</div>
// 	<div
// 		id="info"
// 		className="hidden target:flex flex-col items-center justify-center gap-4 bg-card p-4 max-w-2xl w-[50vw] min-w-84 text-start md:text-center div-frame"
// 	>
// 		<p className="text-md text-muted-foreground">
// 			<b>Assets</b> are builds that can be used as a component to an
// 			existing build. Assets should be intended to be part of a build,
// 			rather than a completed build. <b>Trees</b> or <b>Houses</b> would be
// 			valid examples of assets.
// 		</p>
// 		<p className="text-md text-muted-foreground">
// 			<b>Assemblies</b> are builds that cannot be reasonably repurposed as a
// 			component of a different build. This includes <b>server spawns</b> or
// 			<b> adventure maps</b>.
// 		</p>
// 		<p className="text-md text-muted-foreground">
// 			<a href="#" className="underline">
// 				Click here
// 			</a>
// 			&nbsp;for a full guide.
// 		</p>
// 	</div>
// </div>
