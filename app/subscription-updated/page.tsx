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
  failed_generic: "Failed process request. Please try again later",
  removed: "Successfully unsubscribed from the waitlist.",
  added:
    "Please verify your email address by clicking the verification link sent to your inbox.",
  verified: "Successfully subscribed to the waitlist.",
  verify_failed: "Failed to verify email. Please try again later",
  notification_email_subscription_already_enabled:
    "This email is already subscribed.",
}

export default async function SubscriptionUpdatedPage({ searchParams }: Props) {
  const { state } = await searchParams

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 pt-8">
      <div className="flex items-center gap-2">
        <Image
          src="https://static.mcbps.com/logo.webp"
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
        {stateMessages[state ? state : "failed"] ??
          stateMessages["failed_generic"]}
      </p>
      <Button asChild>
        <Link href={"/"}>Go Back</Link>
      </Button>
    </div>
  )
}
