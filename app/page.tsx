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

export default function Home() {
	return (
		<>
			<Navbar />
			<div className="w-full flex items-center justify-center flex-col gap-4 pt-8">
				<p className="text-6xl font-semibold">MCBlueprints</p>
				<p className="text-2xl text-center">
					Create, share and download Minecraft creations.
				</p>
				{/*<Input placeholder="search assets..." className="max-w-96 px-4" />*/}
				{/*<ChamferedCardDiv title="Build Teams">
						<p className="p-2">
							Build teams can take your creations to the next level.
						</p>
						<div className="ml-auto mt-auto flex gap-2">
							<Button variant="ghost">Learn More...</Button>
							<Button>Register Team</Button>
						</div>
					</ChamferedCardDiv>*/}
				<div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
					{featureCardsContent.map((feature) => (
						<Card key={feature.title} className="mx-auto w-full max-w-sm">
							<CardHeader>
								<CardTitle>{feature.title}</CardTitle>
								<CardDescription>{feature.shortDesc}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{feature.longDesc}</p>
							</CardContent>
							<CardFooter className="gap-4">
								{feature.actions.map((act, idx) => (
									<Button
										key={feature.title + idx}
										variant="outline"
										className="w-full"
										asChild
									>
										<Link href={act.href}>{act.title}</Link>
									</Button>
								))}
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</>
	);
}
