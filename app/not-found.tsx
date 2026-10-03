import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex h-42 w-full flex-col items-center justify-center">
      <p className="pb-2 text-4xl">404 Page not found.</p>
      <Button asChild>
        <Link href={"/"}>Back</Link>
      </Button>
    </div>
  )
}
