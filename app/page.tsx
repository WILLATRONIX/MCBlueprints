import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
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
        Create, share and download Minecraft creations.
      </p>
      <div className="flex w-full max-w-2xl flex-col gap-4 pt-12">
        <p className="text-center">
          This site is currently under development. Please check again later.
          Enter your email below to join the waitlist for further information on
          when the site is ready to use.
        </p>
        <Card className="mt-12 p-4">
          <CardTitle className="text-center">Sign up for waitlist</CardTitle>
          <form method="POST" action="/api/notification/subscribe/email">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                <Input
                  id="fieldgroup-name"
                  name="name"
                  placeholder="Your Name"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                <Input
                  id="fieldgroup-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
                <FieldDescription>
                  This address will be added to the waiting list.
                </FieldDescription>
              </Field>

              <Field orientation="horizontal" className="justify-between">
                <Link href="/unsubscribe">Click here to unsubscribe</Link>
                <div className="flex gap-2">
                  <Button type="reset" variant="outline">
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </Card>
      </div>
    </div>
  )
}
