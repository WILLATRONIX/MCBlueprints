import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/blocks/navbar";
import Footer from "@/components/blocks/footer";
import LargeImageAssetCard from "@/components/blocks/asset-cards/large-image";
import { getTranslations } from "next-intl/server";

const featureCardsContent = [
	{
		title: "Collections",
		shortDesc: "Curate a list of your favourite assets.",
		longDesc: "Curate a list of your favourite assets.",
		actions: [
			{ title: "Discover Collections", href: "/discover" },
			{ title: "Create Collection", href: "/collections/new" },
		],
	},
	{
		title: "Build Teams",
		shortDesc: "Work together to create something great.",
		longDesc: "Work together to create something great.",
		actions: [{ title: "View Build Teams", href: "/teams" }],
	},
	{
		title: "Download any format",
		shortDesc: "",
		longDesc: "",
		actions: [{ title: "Discover Assets", href: "/" }],
	},
	{
		title: "Minecraft Plugin",
		shortDesc: "",
		longDesc: "",
		actions: [
			{ title: "Download", href: "/" },
			{ title: "Connect", href: "/" },
		],
	},
	{
		title: "Title",
		shortDesc: "",
		longDesc: "",
		actions: [{ title: "Discover Title", href: "/" }],
	},
	{
		title: "Discord Integration",
		shortDesc: "",
		longDesc: "",
		actions: [{ title: "Connect Discord Bot", href: "/" }],
	},
];

export default async function Home() {
	const t = await getTranslations("mcbps");

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="w-full flex items-center justify-center flex-col gap-4 min-h-64 mt-24">
				<p className="text-6xl font-semibold">MCBlueprints</p>
				<p className="text-2xl text-center">{t("slogan")}</p>
			</div>
			<div className="w-full flex items-center justify-center gap-4 min-h-12">
				<Button className="w-32 h-12 text-lg" asChild>
					<Link href="/discover">{t("pages.landing.discover_button")}</Link>
				</Button>
				<Button className="w-32 h-12 text-lg" variant="outline" asChild>
					<Link href="/signup">{t("pages.landing.sign_up_button")}</Link>
				</Button>
			</div>
			{/*<div>
				<div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-13">
					{featureCardsContent.map((feature) => (
						<Card key={feature.title} className="div-frame h-44">
							<CardHeader>
								<CardTitle>{feature.title}</CardTitle>
								<CardDescription>{feature.shortDesc}</CardDescription>
							</CardHeader>
							<CardContent className="mt-auto">
								<p>{feature.longDesc}</p>
							</CardContent>
							<CardFooter className="gap-4">
								{feature.actions.map((action, idx) => (
									<Button
										key={feature.title + idx}
										variant="outline"
										className="flex flex-1"
										asChild
									>
										<Link href={action.href}>{action.title}</Link>
									</Button>
								))}
							</CardFooter>
						</Card>
					))}
				</div>
			</div>*/}
			<div className="flex items-center h-96 justify-center gap-2">
				<div className="flex items-start flex-col gap-3">
					<p className="text-xl">Sales and Events</p>
					<div className="flex flex-wrap gap-8 max-w-408">
						<LargeImageAssetCard
							asset={{
								title: "Tree Pack",
								description:
									"This is a pretty cool tree pack and im going to keep typing so i can test how long the tooltip will go",
								price: 14,
								publisher: "null",
								tags: ["tree", "nature"],
								onSale: true,
								saleData: {
									category: "other",
									discountedPrice: 7,
									saleDiscount: "50%",
									saleStart: new Date("10/10/2026"),
									saleEnd: new Date("10/10/2026"),
									otherCategoryData: {
										className: "gradient-bg-1",
										title: "Launch Sale",
									},
								},
								thumbnails: [
									{ href: "", display: "fit" },
									{ href: "", display: "fit" },
									{ href: "", display: "fit" },
								],
								created_at: new Date("10/9/2026"),
								updated_at: new Date(),
							}}
						/>
					</div>
				</div>
			</div>
			<div className="mt-auto">
				<Footer />
			</div>
		</div>
	);
}
