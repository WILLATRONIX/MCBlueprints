import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { Button } from "../ui/button";
import { Notification } from "@/lib/zustand/notification";
import { Progress } from "../ui/progress";
import {
	CircleCheckIcon,
	InfoIcon,
	TriangleAlertIcon,
	OctagonXIcon,
	Loader2Icon,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
	success: <CircleCheckIcon className="size-4 text-lime-600" />,
	info: <InfoIcon className="size-4" />,
	warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
	error: <OctagonXIcon className="size-4 text-red-600" />,
	loading: <Loader2Icon className="size-4 animate-spin" />,
	progress: <Loader2Icon className="size-4 animate-spin" />,
} as const;

const secondaryColours = {
	success: "-lime-900",
	info: "",
	warning: "-yellow-900",
	error: "-red-900",
	loading: "",
	progress: "",
} as const;

export default function NotificationEntry({
	notification,
	closeNotificationAction,
}: {
	notification: Notification;
	closeNotificationAction: (id: string) => void;
}) {
	const notificationData = notification.data;

	return (
		<Alert
			className={cn("w-full", "border" + secondaryColours[notification.type])}
		>
			<AlertTitle className="flex items-center justify-between">
				<div className="flex items-center gap-1">
					{icons[notification.type]}
					<p className="pt-0.5">{notification.title}</p>
				</div>
				<Button
					size="icon-xs"
					variant="secondary"
					onClick={() => {
						closeNotificationAction(notification.id);
					}}
				>
					<X />
				</Button>
			</AlertTitle>

			<AlertDescription>
				<p>{notification.description}</p>
				{typeof notificationData?.progress === "number" &&
					notificationData?.progress >= 0 && (
						<Progress value={notificationData?.progress} />
					)}
			</AlertDescription>

			{notification.actionHref && notification.actionTitle && (
				<AlertAction>
					<Button variant="outline">Enable</Button>
				</AlertAction>
			)}
		</Alert>
	);
}
