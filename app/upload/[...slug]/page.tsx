import { notFound } from "next/navigation";
import StepList from "./components/stepList";
import UploadContent from "./components/uploadContent";

const ValidRoutes = ["asset", "assembly"] as const;

type ValidRoute = (typeof ValidRoutes)[number];

function isValidRoute(route: string): route is ValidRoute {
	return ValidRoutes.includes(route as ValidRoute);
}

export default async function UploadAssetOrAssembly(
	props: PageProps<"/upload/[...slug]">,
) {
	const { params, searchParams } = props;
	const { slug = [] } = await params;

	// const query = await searchParams;

	const rootSlug = slug[0] as ValidRoute;

	if (!isValidRoute(rootSlug)) {
		notFound();
	}

	return (
		<div className="flex flex-1 h-full w-full gap-4 pt-1 pb-4">
			<StepList uploadType={rootSlug} />
			<UploadContent />
		</div>
	);
}
