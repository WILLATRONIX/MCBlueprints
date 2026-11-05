export type SaleCategory =
	"creator" | "team" | "bundle" | "summer" | "winter" | "other";

export type SaleCategoryData<T extends SaleCategory = SaleCategory> = Record<
	T,
	Record<"className" | "title", string>
>;

export type Thumbmail = {
	href: string;
	display: "fit" | "fill";
	alt?: string;
};

export type Asset = {
	title: string;
	description: string;
	tags: string[];
	price: number;
	publisher: "null";
	created_at: Date;
	updated_at: Date;
	onSale: boolean;
	saleData?: {
		category: SaleCategory;
		saleStart: Date;
		saleEnd: Date;
		saleDiscount: string;
		discountedPrice: number;
		otherCategoryData?: Record<"className" | "title", string>;
	};
	thumbnails: Thumbmail[];
};
