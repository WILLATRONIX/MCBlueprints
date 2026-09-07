"use client";

import { useState } from "react";
import PanelEditor from "./panelEditor";
import UploadInput, { FileUpload, FolderUpload } from "./assetUploadInput";

export default function UploadContent() {
	const [selectedFile, setSelectedFile] = useState<
		FileUpload | FolderUpload | null
	>(null);

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

	return (
		<div className="flex flex-1 h-full w-full">
			<UploadInput
				onUploadItemClickAction={setSelectedFile}
				selectedFileState={selectedFile}
			/>

			<PanelEditor
				activeFile={selectedFile}
				saveChangesAction={performEditAction}
			/>
		</div>
	);
}
