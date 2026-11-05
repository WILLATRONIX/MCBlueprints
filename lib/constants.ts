export enum ProjectContentType {
	minecraft_asset,
	minecraft_world,
	axiom_theme,
	axiom_preset,
	other_heightmap,
	other_gradient,
	other_palette,
}

export const projectContentTypeFriendly: Record<ProjectContentType, string> = {
	[ProjectContentType.axiom_preset]: "Axiom Presets",
	[ProjectContentType.axiom_theme]: "Axiom Theme",
	[ProjectContentType.minecraft_asset]: "Assets",
	[ProjectContentType.minecraft_world]: "A World",
	[ProjectContentType.other_gradient]: "Block Gradient",
	[ProjectContentType.other_heightmap]: "Heightmaps",
	[ProjectContentType.other_palette]: "Block Palette",
};

export const projectContentFileFormat: Record<ProjectContentType, string[]> = {
	[ProjectContentType.axiom_preset]: [".nbt"],
	[ProjectContentType.axiom_theme]: [""],
	[ProjectContentType.minecraft_asset]: [
		".bp",
		".schem",
		".schematic",
		".zip",
		".litematic",
	],
	[ProjectContentType.minecraft_world]: [".zip"],
	[ProjectContentType.other_gradient]: [""],
	[ProjectContentType.other_heightmap]: [".png", ".jpg", ".webp"],
	[ProjectContentType.other_palette]: [""],
};

export const projectContentAllowMultiple: Record<ProjectContentType, boolean> =
	{
		[ProjectContentType.axiom_preset]: true,
		[ProjectContentType.axiom_theme]: false,
		[ProjectContentType.minecraft_asset]: true,
		[ProjectContentType.minecraft_world]: false,
		[ProjectContentType.other_gradient]: false,
		[ProjectContentType.other_heightmap]: true,
		[ProjectContentType.other_palette]: false,
	};

export enum ProjectMonetization {
	free,
	monetized,
	subscription,
}

export enum ProjectStatus {
	published,
	draft,
	deleted,
	restricted,
}
