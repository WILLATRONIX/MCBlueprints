import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PackOrIndividual() {
	return (
		<div className="flex flex-col h-full justify-center items-center">
			<div className="items-center justify-center flex gap-4 flex-col bg-card border p-4 max-w-96 w-[50vw] min-w-84 text-start md:text-center mb-8">
				<p className="text-2xl">Select asset upload type</p>
				<div className="flex gap-4">
					<Button size="lg" className="w-36" asChild>
						<Link href="/upload/asset-pack/premium-options">Asset Pack</Link>
					</Button>
					<Button size="lg" className="w-36" asChild>
						<Link href="/upload/asset/premium-options">Individual Assets</Link>
					</Button>
				</div>
				<a href="#info" className="underline text-sm text-muted-foreground">
					Click for information
				</a>
			</div>
			<div
				id="info"
				className="hidden target:flex flex-col items-center justify-center gap-4 bg-card border p-4 max-w-2xl w-[50vw] min-w-84 text-start md:text-center"
			>
				<p className="text-md text-muted-foreground">
					<b>Assets</b> are builds that can be used as a component to an
					existing build. Assets should be intended to be part of a build,
					rather than a completed build. <b>Trees</b> or <b>Houses</b> would be
					valid examples of assets.
				</p>
				<p className="text-md text-muted-foreground">
					<b>Assemblies</b> are builds that cannot be reasonably repurposed as a
					component of a different build. This includes <b>server spawns</b> or
					<b> adventure maps</b>.
				</p>
				<p className="text-md text-muted-foreground">
					<a href="#" className="underline">
						Click here
					</a>
					&nbsp;for a full guide.
				</p>
			</div>
		</div>
	);
}
