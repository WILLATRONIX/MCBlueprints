import { ProjectContentType } from "@/lib/constants";

interface UploadTextDataProps {
	publicContent: boolean;
	monetized: boolean;
	contentType: ProjectContentType;
	projectName: string;
	projectId: string;
}

export default function UploadTextData({
	publicContent,
	monetized,
	contentType,
	projectName,
	projectId,
}: UploadTextDataProps) {
	return <div>hi</div>;
}
