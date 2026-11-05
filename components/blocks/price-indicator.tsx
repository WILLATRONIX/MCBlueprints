import { cn } from "@/lib/utils";

export default function PriceIndicator({
	price,
	currencySymbol = "$",
	discount,
	discountedPrice = 0,
	block = false,
	className,
}: {
	price: number;
	currencySymbol?: string;
	discount?: string;
	discountedPrice?: number;
	block?: boolean;
	className?: string;
}) {
	const renderPrice = (p: number) => {
		return p === 0 ? "Free" : currencySymbol + p.toFixed(2);
	};

	return (
		<div className={cn("w-auto bg-muted flex", className)}>
			<p
				className={cn(
					"bg-primary items-center px-1 hidden",
					discount && "flex",
				)}
			>
				{"-" + discount}
			</p>
			<div
				className={cn(
					"py-0.5 flex gap-2 items-center px-2",
					block && "flex-col gap-0",
				)}
			>
				<p
					className={cn(
						discount && "discount-original-price text-sm",
						block && (discount ? "text-xxs" : "text-xs"),
					)}
				>
					{renderPrice(price)}
				</p>
				<p className={cn("hidden", discount && "block", block && "text-xs")}>
					{renderPrice(discountedPrice)}
				</p>
			</div>
		</div>
	);
}
