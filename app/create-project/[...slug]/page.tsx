import { notFound } from "next/navigation";
import UploadFiles from "./components/uploadContent/uploadFiles";
import CreatePost from "./components/createPost";
import { GetParams } from "@/lib/utils/getParams";
import { ProjectContentType } from "@/lib/constants";
import UploadTextData from "./components/uploadContent/uploadTextData";

const validStepRoutes = ["upload", "create-post"] as const;

type ValidStepRoute = (typeof validStepRoutes)[number];

function isValidRoute(route: string): route is ValidStepRoute {
	return validStepRoutes.includes(route as ValidStepRoute);
}

export default async function UploadAssetOrAssembly(
	props: PageProps<"/create-project/[...slug]">,
) {
	const { params, searchParams } = props;
	const { slug = [] } = await params;

	const query = await searchParams;

	const step = slug[0] as ValidStepRoute;

	const searchParamValues = {
		publicContent: GetParams.boolean(query.publicContent),
		monetized: GetParams.boolean(query.monetized),
		contentType: GetParams.number(query.contentType),
		projectName: GetParams.string(query.projectName),
		projectId: GetParams.string(query.projectId),
	};

	if (!isValidRoute(step)) {
		notFound();
	}

	if (step === "upload") {
		if (
			searchParamValues.publicContent === undefined ||
			searchParamValues.monetized === undefined ||
			searchParamValues.contentType === undefined ||
			searchParamValues.projectName === undefined ||
			searchParamValues.projectId === undefined
		) {
			notFound();
		}

		if (searchParamValues.contentType === ProjectContentType.axiom_theme) {
			return (
				<div className="flex flex-1 flex-col h-full w-full">
					<UploadTextData
						publicContent={searchParamValues.publicContent}
						monetized={searchParamValues.monetized}
						contentType={searchParamValues.contentType}
						projectName={searchParamValues.projectName}
						projectId={searchParamValues.projectId}
					/>
				</div>
			);
		} else {
			return (
				<div className="flex flex-1 flex-col h-full w-full">
					<UploadFiles
						publicContent={searchParamValues.publicContent}
						monetized={searchParamValues.monetized}
						contentType={searchParamValues.contentType}
						projectName={searchParamValues.projectName}
						projectId={searchParamValues.projectId}
					/>
				</div>
			);
		}
	}

	if (step === "create-post") {
		return (
			<div className="flex flex-1 flex-col h-full w-full">
				<CreatePost searchParams={query} />
			</div>
		);
	}
}
