import { create } from "zustand";
import { createZstdClient } from "../compression/zstd/client";
import { createTar } from "../compression/tar/tar";
import { useNotificationZStore } from "./notification";
import { UploadItems } from "../types/upload";

const notificationState = useNotificationZStore.getState();

const compressToTarZstd = async (
	uploadItems: UploadItems,
	notificationId: string,
): Promise<Uint8Array<ArrayBufferLike>> => {
	const zstdClient = createZstdClient();

	const tarData = await createTar(uploadItems, (progress) => {
		notificationState.updateNotification({
			id: notificationId,
			data: { progress },
		});
	});

	notificationState.updateNotification({
		id: notificationId,
		type: "loading",
		title: "Compressing Zstd...",
		description: "Compressing upload content to reduce network usage.",
		showToast: true,
	});

	const compressed = await zstdClient.compress(tarData, 5);

	zstdClient.terminate();
	return compressed;
};

interface UploadTask {
	taskId: string;
	status: "compressing" | "uploading" | "completed" | "failed";
	error?: string;
}

interface UploadState {
	tasks: Record<string, UploadTask>;

	startCompression: (args: {
		taskId: string;
		uploadItems: UploadItems;
		notificationId: string;
	}) => void;
}

export const uploadStore = create<UploadState>((set) => ({
	tasks: {},

	startCompression: ({ taskId, uploadItems, notificationId }) => {
		set((state) => ({
			tasks: {
				...state.tasks,
				[taskId]: {
					taskId,
					status: "compressing",
				},
			},
		}));

		void (async () => {
			try {
				const compressed = await compressToTarZstd(uploadItems, notificationId);

				set((state) => ({
					tasks: {
						...state.tasks,
						[taskId]: {
							taskId,
							status: "uploading",
						},
					},
				}));

				// Perform size validation and API uploads here.

				set((state) => ({
					tasks: {
						...state.tasks,
						[taskId]: {
							taskId,
							status: "completed",
						},
					},
				}));
			} catch (error) {
				console.error("Upload task failed:", error);

				set((state) => ({
					tasks: {
						...state.tasks,
						[taskId]: {
							taskId,
							status: "failed",
							error: error instanceof Error ? error.message : "Upload failed",
						},
					},
				}));
			}
		})();
	},
}));
