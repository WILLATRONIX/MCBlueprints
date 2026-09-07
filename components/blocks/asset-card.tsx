import Image from "next/image";
import { Card, CardDescription, CardFooter, CardTitle } from "../ui/card";
import Link from "next/link";
import Asset from "@/lib/asset";

export default function AssetCard({ asset }: { asset: Asset }) {
	return (
		<div className="relative w-fit">
			<Link
				href="/RebirthBuilds/medieval-asset-pack"
				className="absolute inset-0 z-0 hover:ring-2 hover:ring-cyan-600"
				aria-label="View Medieval Asset Pack"
			/>
			<Card className="p-0 w-fit gap-0 hover:cursor-pointer max-w-[256px]">
				<Image src={asset.imageUrl} width={256} height={256} alt="" />
				<CardTitle className="text-base pt-1 px-1 text-nowrap text-ellipsis overflow-hidden whitespace-nowrap">
					{asset.title}
				</CardTitle>
				<CardDescription className="px-1 text-nowrap text-ellipsis overflow-hidden whitespace-nowrap">
					<Link
						className="relative z-20 hover:underline"
						href={`/RebirthBuilds`}
					>
						{asset.username}
					</Link>
				</CardDescription>
				<CardFooter className="p-2 text-sm font-semibold flex justify-between">
					<p>{asset.assetType}</p>
					<p>{asset.price}</p>
				</CardFooter>
			</Card>
		</div>
	);
}
