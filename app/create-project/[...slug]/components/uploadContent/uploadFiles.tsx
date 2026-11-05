"use client";

import { Dispatch, SetStateAction, useState } from "react";
import PanelEditor from "./panelEditor";
import UploadManager, { TagRepository } from "./uploadManager";
import { FileUpload, FolderUpload, UploadItems } from "@/lib/types/upload";
import { useNotificationZStore } from "@/lib/zustand/notification";
import { useAuthZStore } from "@/lib/zustand/auth";
import { convertBytes } from "@/lib/utils/bytes";
import { Fault } from "@/lib/fault/fault";
import { pluralize } from "@/lib/utils/string";
import { ProjectContentType } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { uploadStore } from "@/lib/zustand/upload";

export default function UploadFiles({
	publicContent,
	monetized,
	contentType,
	projectName,
	projectId,
}: {
	publicContent: boolean;
	monetized: boolean;
	contentType: ProjectContentType;
	projectName: string;
	projectId: string;
}) {
	const [selectedFile, setSelectedFile] = useState<
		FileUpload | FolderUpload | null
	>(null);
	const [tagRepository, setTagRepository] = useState<TagRepository>();
	const [uploadContent, setUploadContent] = useState<UploadItems>({});

	const notificationState = useNotificationZStore();
	const authenticationState = useAuthZStore();
	const router = useRouter();

	const onUploadItems = (newContent: UploadItems) => {
		if (contentType === ProjectContentType.minecraft_world) {
			if (Object.keys(newContent).length === 1) {
				continueToNextStep(newContent);
			} else {
				throw new Fault(
					"Could not continute to next step. Incorrect content length",
					"project_upload_file_incorrect_content_length",
				);
			}
		}
	};

	const setUploadContentAction: Dispatch<SetStateAction<UploadItems>> = (
		action,
	) => {
		const next = typeof action === "function" ? action(uploadContent) : action;

		setUploadContent(next);
		onUploadItems(next);
	};

	const performEditAction = (name: string, tags: string[]) => {
		setSelectedFile((prev) => {
			if (!prev) {
				return prev;
			}

			if (prev.type === "folder") {
				return {
					...prev,
					folderName: name,
				};
			} else {
				return {
					...prev,
					parsedData: {
						...prev.parsedData,
						name,
						tags,
					},
				};
			}
		});
	};

	const continueToNextStep = (uploadItems: UploadItems) => {
		const taskId = crypto.randomUUID();

		const notificationId = notificationState.pushClientNotification({
			title: "Preparing Content...",
			description: "Compressing upload content to reduce network usage.",
			type: "info",
			showToast: true,
			data: { progress: 0 },
		});

		uploadStore.getState().startCompression({
			taskId,
			uploadItems,
			notificationId,
		});

		router.push("/create-project/create-post");
	};

	const handleItemClick = (
		newValue: FileUpload | FolderUpload | null,
		tagRepository: TagRepository,
	) => {
		setSelectedFile(newValue);
		setTagRepository(tagRepository);
	};

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-1 h-full w-full">
				<UploadManager
					onUploadItemClickAction={handleItemClick}
					selectedFileState={selectedFile}
					uploadContent={uploadContent}
					setUploadContentAction={setUploadContentAction}
					publicContent={publicContent}
					monetized={monetized}
					contentType={contentType}
					projectName={projectName}
					projectId={projectId}
				/>

				{selectedFile && (
					<PanelEditor
						activeFile={selectedFile}
						tagRepository={tagRepository}
						saveChangesAction={performEditAction}
					/>
				)}
			</div>
		</div>
	);
}
