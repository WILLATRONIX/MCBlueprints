import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UploadPage() {
	return (
		<div className="flex flex-row h-full justify-center items-center">
			<div className="items-center justify-center flex flex-col bg-cyan-950 border p-4 max-w-2xl w-[50vw] min-w-84 text-start md:text-center mb-[24vh]">
				<p className="text-2xl">What would you like to upload?</p>
				<p className="text-md text-muted-foreground">
					Assets are reusable and can be repurposed. Assemblies are unable be
					reused for any other application. For a full guide,&nbsp;
					<a href="#" className="underline">
						click here to read more
					</a>
					.
				</p>
				<div className="flex gap-4 pt-6">
					<Button size="lg" className="w-36" asChild>
						<Link href="/upload/asset">Asset</Link>
					</Button>
					<Button size="lg" className="w-36" asChild>
						<Link href="/upload/assembly">Assembly</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
