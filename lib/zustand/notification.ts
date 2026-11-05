import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Notification = {
	id: string;
	hidden: boolean;
	showToast: boolean;
	toastDuration?: number;
	sender: "client" | "server";
	type: "info" | "warning" | "error" | "success" | "loading" | "progress";
	title: string;
	description: string;
	actionTitle?: string;
	actionHref?: string;
	data?: Record<string, string | number>;
	timestamp: number;
};

export type CreateNotification = {
	showToast: boolean;
	toastDuration?: number;
	type: "info" | "warning" | "error" | "success" | "loading" | "progress";
	title: string;
	description: string;
	actionTitle?: string;
	actionHref?: string;
	data?: Record<string, string | number>;
};

type NotificationsState = {
	entries: Notification[];
	hasHydrated: boolean;
	lastUpdated: number;
	toastsEnabled: boolean;
	dismissNotificationToast: (id: string) => void;
	updateNotification: (
		notification: Partial<Notification> & { id: string },
	) => void;
	pushClientNotification: (notification: CreateNotification) => string;
	hideNotification: (id: string) => void;
	hideAllNotifications: () => void;
	setToastsEnabled: (newValue: boolean) => void;
};

export const useNotificationZStore = create<NotificationsState>()(
	persist(
		(set) => ({
			entries: [],
			lastUpdated: Date.now(),
			hasHydrated: false,
			toastsEnabled: true,

			updateNotification: (
				notification: Partial<Notification> & { id: string },
			) =>
				set((state) => ({
					entries: state.entries.map((entry) =>
						entry.id === notification.id
							? { ...entry, ...notification }
							: entry,
					),
				})),

			pushClientNotification: (newNotification: CreateNotification) => {
				const id = crypto.randomUUID();

				set((state) => {
					const notification: Notification = {
						id,
						hidden: false,
						sender: "client",
						timestamp: Date.now(),
						...newNotification,
						showToast: newNotification.showToast && state.toastsEnabled,
					};

					return {
						entries: [...state.entries, notification],
					};
				});

				return id;
			},

			hideNotification: (id: string) =>
				set((state) => ({
					entries: state.entries.map((entry) =>
						entry.id === id ? { ...entry, hidden: true } : entry,
					),
				})),

			hideAllNotifications: () =>
				set((state) => ({
					entries: state.entries.map((entry) => {
						return { ...entry, hidden: true };
					}),
				})),

			dismissNotificationToast: (id: string) =>
				set((state) => ({
					entries: state.entries.map((entry) =>
						entry.id === id ? { ...entry, showToast: false } : entry,
					),
				})),

			setToastsEnabled: (newValue: boolean) =>
				set(() => ({
					toastsEnabled: newValue,
				})),
		}),
		{
			name: "notification-store",
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.hasHydrated = true;
				}
			},
		},
	),
);
