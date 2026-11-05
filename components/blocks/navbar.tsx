"use client";

import { Button } from "@/components/ui/button";
import { useAuthZStore } from "@/lib/zustand/auth";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	BookMarked,
	CircleFadingArrowUpIcon,
	LogOutIcon,
	MessagesSquare,
	Plus,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import { NotificationPopover } from "./notifications";

type NavComponent = {
	title: string;
	href: string;
	description: string;
};

const navigationComponents: Record<string, NavComponent[]> = {
	Discover: [
		{
			title: "Assets",
			href: "/discover/assets",
			description:
				"Builds that can be reused and repurposed as-is without any modifications.",
		},
		{
			title: "Assemblies",
			href: "/discover/assemblies",
			description:
				"Maps or builds made using one or more assets that cannot be repurposed.",
		},
		{
			title: "Collections",
			href: "/discover/collections",
			description: "Curated packs of builds with a specific theme or idea.",
		},
		{
			title: "Builders",
			href: "/discover/builders",
			description:
				"Experienced level designers and artists who dedicate their time to building.",
		},
		{
			title: "Teams",
			href: "/discover/teams",
			description:
				"Organised groups of builders working on large scale projects.",
		},
	],
	About: [
		{
			title: "Terms of Service",
			href: "",
			description: "Read and review our terms of service.",
		},
		{
			title: "Privacy Policy",
			href: "",
			description: "Read and review our privacy policy.",
		},
		{
			title: "FAQ and Guides",
			href: "",
			description:
				"Use the guides to assist you with using this site's tools and more.",
		},
		{
			title: "Help and Support",
			href: "",
			description: "Use our support platform or contact us via Discord.",
		},
	],
};
function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link href={href}>
					<div className="flex flex-col gap-1 text-sm">
						<div className="leading-none font-medium">{title}</div>
						<div className="line-clamp-2 text-muted-foreground">{children}</div>
					</div>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

export default function Navbar({
	navComponents,
	title,
	children,
}: {
	navComponents?: Record<string, NavComponent[]> | null;
	title?: string | boolean;
	children?: ReactNode;
}) {
	const authState = useAuthZStore();

	return (
		<nav className="shrink-0 max-h-14 bg-background bg-texture ring ring-secondary/20">
			<div className="h-14 flex items-center justify-between px-2 gap-4">
				<div className="flex gap-2">
					<Link href="/" className="shrink-0 flex items-center gap-3">
						<Image
							src="/mcbp-logo.webp"
							style={{
								imageRendering: "pixelated",
							}}
							alt="MCBlueprints Logo"
							width={36}
							height={36}
							loading="eager"
						/>
						{title && (
							<p className="text-2xl font-semibold">
								{typeof title === "boolean" ? "MCBlueprints" : title}
							</p>
						)}
					</Link>
					{navComponents !== null && (
						<NavigationMenu>
							<NavigationMenuList className="flex gap-2">
								{Object.entries(
									navComponents ? navComponents : navigationComponents,
								).map(([title, components]) => (
									<NavigationMenuItem className="hidden md:flex" key={title}>
										<NavigationMenuTrigger>{title}</NavigationMenuTrigger>
										<NavigationMenuContent>
											<ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
												{components.map((component) => (
													<ListItem
														key={component.title}
														title={component.title}
														href={component.href}
													>
														{component.description}
													</ListItem>
												))}
											</ul>
										</NavigationMenuContent>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					)}
				</div>
				{children}
				<div className="flex gap-2">
					{authState.isAuthenticated ? (
						<div className="flex gap-2">
							<NotificationPopover />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="lg">{authState.user?.displayName}</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-40" align="end">
									<DropdownMenuGroup>
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuItem asChild>
											<Link href={`/u/${authState.user?.username}`}>
												<UserIcon />
												Profile
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<SettingsIcon />
											Settings
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuLabel>Create</DropdownMenuLabel>
										{/*<DropdownMenuSub>
										<DropdownMenuSubTrigger>
											<Upload />
											<Link href={"/upload"}>Upload</Link>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuItem asChild>
													<Link href={"/upload/asset"}>
														<Blocks />
														Asset
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link href={"/upload/assembly"}>
														<Package />
														Assembly
													</Link>
												</DropdownMenuItem>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>*/}
										{!authState.user?.isCreator && [
											<DropdownMenuItem key="upload" asChild>
												<Link href={"/create-project"}>
													<Plus />
													New Project
												</Link>
											</DropdownMenuItem>,
											<DropdownMenuItem key="creator">
												<CircleFadingArrowUpIcon />
												Become a Creator
											</DropdownMenuItem>,
										]}
										{/*<DropdownMenuItem>
										<Users />
										Teams
									</DropdownMenuItem>*/}
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuLabel>Help</DropdownMenuLabel>
										<DropdownMenuItem>
											<BookMarked />
											Guide
										</DropdownMenuItem>
										<DropdownMenuItem>
											<MessagesSquare /> Support
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem variant="destructive">
											<LogOutIcon />
											Log out
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<>
							<Button size="lg" variant="ghost" asChild>
								<Link href="/signup">Sign Up</Link>
							</Button>
							<Button size="lg" asChild>
								<Link href="/login">Login</Link>
							</Button>
							<NotificationPopover />
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
