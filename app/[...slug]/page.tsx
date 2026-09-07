import { notFound } from "next/navigation";

export default async function PriorityCatchAllPage(
	props: PageProps<"/[...slug]">,
) {
	const { params, searchParams } = props;
	const { slug = [] } = await params;

	const query = await searchParams;

	if (true) {
		notFound();
	}

	// show teams
	// For example /RebirthBuilds
	//
	// show short urls
	// For example /a-XXXXXX
}
