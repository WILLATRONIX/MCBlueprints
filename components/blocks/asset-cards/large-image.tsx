"use client";

import { Asset, SaleCategoryData } from "@/lib/types/asset";
import PriceIndicator from "../price-indicator";
import { cn } from "cn";
import Image from "next/image";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";

const saleCategoryMap: SaleCategoryData = {
	bundle: { className: "gradient-bg-1", title: "Bundle Deal" },
	creator: { className: "gradient-bg-2", title: "Creator Sale" },
	team: { className: "gradient-bg-3", title: "Team Sale" },
	winter: {
		className: "gradient-bg-5 text-shadow-sm text-shadow-mist-700",
		title: "Winter Sale",
	},
	summer: { className: "gradient-bg-3", title: "Summer Sale" },
	other: {
		className: "gradient-bg-4",
		title: "undefined",
	},
};

export default function LargeImageAssetCard({ asset }: { asset: Asset }) {
	const categoryData =
		asset.saleData?.category === "other"
			? {
					...saleCategoryMap.other,
					...asset.saleData.otherCategoryData,
				}
			: saleCategoryMap[asset.saleData?.category ?? "other"];

	const [autoplay, setAutoplay] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			<Tooltip>
				<TooltipTrigger>
					<div
						className="group relative h-54 w-96 cursor-pointer bg-card"
						onMouseEnter={() => setAutoplay(true)}
						onMouseLeave={() => setAutoplay(false)}
					>
						{asset.onSale && asset.saleData?.category && (
							<div className="absolute z-10 flex h-full w-full items-start opacity-100 transition-opacity duration-150 ease-in-out group-hover:pointer-events-none group-hover:opacity-0">
								<div
									className={cn("px-1 font-semibold", categoryData.className)}
								>
									{categoryData.title}
								</div>
							</div>
						)}
						<Carousel
							plugins={[
								Autoplay({
									delay: 2000,
									active: autoplay,
								}),
							]}
							opts={{ loop: true }}
							className="w-full h-full"
						>
							<CarouselContent className="h-full">
								{Array.from({ length: 5 }).map((_, index) => (
									<CarouselItem key={index} className="h-full">
										<div className="relative h-full w-full">
											<Image
												src={`https://picsum.photos/800/800?grayscale&random=${index + 25}`}
												alt={`Slide ${index + 1}`}
												fill
												sizes="384px"
												// width={384}
												// height={216}
												className="select-none object-cover"
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>
					</div>
				</TooltipTrigger>
				<TooltipContent
					side="right"
					align="start"
					className="w-fit max-w-64 flex-col items-start"
				>
					<p className="font-bold text-sm">{asset.title}</p>
					<p className="text-xxs">{asset.created_at.toDateString()}</p>
					<p className="py-2">{asset.description}</p>
					<p>Tags:</p>
					<div className="flex flex-wrap gap-2">
						{asset.tags.map((tag) => {
							return (
								<Badge variant="secondary" key={tag}>
									{tag}
								</Badge>
							);
						})}
					</div>
				</TooltipContent>
			</Tooltip>
			<div className="flex self-end">
				<PriceIndicator
					price={asset.price}
					discount={asset.saleData?.saleDiscount}
					discountedPrice={asset.saleData?.discountedPrice}
				/>
			</div>
		</div>
	);
}
