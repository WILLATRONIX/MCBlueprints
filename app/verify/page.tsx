import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

interface Props {
  searchParams: Promise<{
    token?: string
  }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (token) {
    const formData = new FormData()
    formData.append("token", token)

    const response = await fetch(
      `${process.env.MCBPS_FRONTEND}/api/notification/verify/email`,
      {
        method: "POST",
        body: formData,
        redirect: "manual",
        cache: "no-store",
      }
    )

    if (response.status === 303) {
      redirect(response.headers.get("location")!)
    }
  }

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
        {!token && "Verification token is missing."}
      </p>
      <Button asChild>
        <Link href={"/"}>Go Back</Link>
      </Button>
    </div>
  )
}
