import { Fragment } from "react";

import { Button } from "@/components/ui/button";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RawDirectoryRoute = string[];

interface DirectoryBreadcrumbProps {
	route: RawDirectoryRoute;
	onNavigate?: (route: string) => void;
	maxVisible?: number;
}

export function DirectoryBreadcrumb({
	route,
	onNavigate,
	maxVisible = 4,
}: DirectoryBreadcrumbProps) {
	if (route.length === 0) {
		return null;
	}

	const collapsed = route.length > maxVisible;

	type Item =
		{ type: "segment"; name: string; index: number } | { type: "ellipsis" };

	const items: Item[] = collapsed
		? [
				{ type: "segment", name: route[0], index: 0 },
				{ type: "ellipsis" },
				...route.slice(-2).map((name, i) => ({
					type: "segment" as const,
					name,
					index: route.length - 2 + i,
				})),
			]
		: route.map((name, index) => ({
				type: "segment" as const,
				name,
				index,
			}));

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, itemIndex) => (
					<Fragment key={item.type === "ellipsis" ? "ellipsis" : item.index}>
						{itemIndex > 0 && <BreadcrumbSeparator />}

						<BreadcrumbItem>
							{item.type === "ellipsis" ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button size="icon-sm" variant="ghost">
											<BreadcrumbEllipsis />
											<span className="sr-only">Show hidden folders</span>
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent align="start">
										<DropdownMenuGroup>
											{route.slice(1, -2).map((folder, i) => {
												const targetRoute = route.slice(0, i + 2).join("/");

												return (
													<DropdownMenuItem
														key={`${folder}-${i}`}
														onClick={() => onNavigate?.(targetRoute)}
													>
														{folder}
													</DropdownMenuItem>
												);
											})}
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							) : item.index === route.length - 1 ? (
								<BreadcrumbPage className="select-none text-2xl">
									{item.name}
								</BreadcrumbPage>
							) : (
								<button
									type="button"
									className="select-none hover:cursor-pointer hover:text-primary-foreground text-2xl"
									onClick={() => {
										const targetRoute = route
											.slice(0, item.index + 1)
											.join("/");

										onNavigate?.(targetRoute);
									}}
								>
									{item.name}
								</button>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
