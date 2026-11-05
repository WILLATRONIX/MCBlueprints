import DiscoverGrid from "@/components/blocks/discover-grid";
import Asset from "@/lib/asset";

const assetCache: Map<string, Asset[]> | null = new Map();

export default async function DiscoverPage(
	props: PageProps<"/discover/[[...category]]">,
) {
	const { params, searchParams } = props;
	const { category: slug = [] } = await params;

	const query = await searchParams;

	let category = "";
	let sortBy = "popular";

	const sortByOptions = ["popular", "latest", "top"];

	if (sortByOptions.includes(slug[0])) {
		sortBy = slug[0];
	} else {
		category = slug[0];
	}

	const page = query.page;

	return (
		<div className="px-4 py-8 flex flex-col">
			{/*<BrowseGrid category={category} sortBy={sortBy} />*/}
			<DiscoverGrid assets={[]} />
		</div>
	);
}
