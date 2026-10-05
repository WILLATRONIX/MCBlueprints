import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface Props {
  searchParams: Promise<{
    state?: string
  }>
}

const stateMessages: Record<string, string> = {
  failed: "Failed to update waitlist subscription. Please try again later",
  removed: "Successfully unsubscribed from the waitlist.",
  added:
    "Successfully subscribed to the waitlist. You'll receive a conformation email shortly.",
  notification_email_subscription_already_enabled:
    "This email is already subscribed. If you'd like to unsubscribe",
}

export default async function SubscriptionUpdatedPage({ searchParams }: Props) {
  const { state } = await searchParams

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 pt-8">
      <div className="flex items-center gap-2">
        <Image
          src="https://static.mcbps.com/logo-15px.webp"
          alt="MCBlueprints Logo"
          width={60}
          height={60}
          loading="eager"
          className="h-10 w-10 invert md:h-15 md:w-15 dark:invert-0"
          style={{
            imageRendering: "pixelated",
          }}
        />
        <p className="text-4xl font-semibold md:text-6xl">MCBlueprints</p>
      </div>
      <p className="text-center text-2xl">
        {stateMessages[state ? state : "failed"]}
      </p>
      <Button asChild>
        <Link href={"/"}>Go Back</Link>
      </Button>
    </div>
  )
}
