import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, BrushCleaning, Megaphone, MegaphoneOff } from "lucide-react";
import { Badge } from "../ui/badge";
import { useNotificationZStore } from "@/lib/zustand/notification";
import NotificationEntry from "./notification-entry";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function NotificationPopover() {
	const notificationState = useNotificationZStore();
	const notificationCount = notificationState.entries.filter((entry) => {
		return !entry.hidden;
	}).length;

	const [open, setOpen] = useState(false);
	const [toastsEnabled, setToastsEnabled] = useState(
		notificationState.toastsEnabled,
	);

	const entries = useNotificationZStore((state) => state.entries);

	const activeToasts = useMemo(
		() => entries.filter((entry) => entry.showToast),
		[entries],
	);

	const handleToastEnabledToggleClick = () => {
		const next = !toastsEnabled;

		setToastsEnabled(next);
		notificationState.setToastsEnabled(next);
	};

	useEffect(() => {
		const timeouts = activeToasts
			.filter((toast) => (toast.toastDuration ?? 5000) > 0)
			.map((toast) =>
				setTimeout(() => {
					useNotificationZStore.getState().dismissNotificationToast(toast.id);
				}, toast.toastDuration ?? 5000),
			);

		return () => {
			timeouts.forEach(clearTimeout);
		};
	}, [activeToasts]);

	return (
		<>
			<Popover open={open || activeToasts.length > 0} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						size="icon-lg"
						className={cn("relative", notificationCount > 0 && "mr-2")}
					>
						<Bell />
						{notificationCount > 0 && (
							<Badge
								variant="destructive"
								className="absolute -top-1.5 -right-2 px-1"
								aria-hidden="true"
							>
								{notificationCount}
							</Badge>
						)}
					</Button>
				</PopoverTrigger>

				<PopoverContent
					align="end"
					className="max-h-64 overflow-y-auto p-1 flex gap-2 bg-card"
					onOpenAutoFocus={(event) => event.preventDefault()}
				>
					<div className="pt-1 flex gap-1">
						<Tooltip disableHoverableContent>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									onClick={() => notificationState.hideAllNotifications()}
								>
									<BrushCleaning />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Clear All Notifications</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip disableHoverableContent>
							<TooltipTrigger asChild>
								<Button size="icon" onClick={handleToastEnabledToggleClick}>
									{toastsEnabled ? <Megaphone /> : <MegaphoneOff />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>{toastsEnabled ? "Disable" : "Enable"} Popup Toast</p>
							</TooltipContent>
						</Tooltip>
					</div>
					<Separator />
					{!open && activeToasts.length > 0 ? (
						activeToasts
							.toReversed()
							.map((toast) => (
								<NotificationEntry
									key={toast.id}
									notification={toast}
									closeNotificationAction={() =>
										notificationState.dismissNotificationToast
									}
								/>
							))
					) : notificationCount > 0 ? (
						notificationState.entries
							.toReversed()
							.map(
								(entry) =>
									!entry.hidden && (
										<NotificationEntry
											key={entry.id}
											notification={entry}
											closeNotificationAction={
												notificationState.hideNotification
											}
										/>
									),
							)
					) : (
						<p className="py-4 text-center">Nothing to show.</p>
					)}
				</PopoverContent>
			</Popover>
		</>
	);
}
