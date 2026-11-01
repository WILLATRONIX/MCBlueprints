"use client"

import { useRef, useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

declare global {
  interface Window {
    AwsWafIntegration: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    }
  }
}

export function WaitlistForm() {
  const captchaRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const body = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        body.append(key, value)
      }
    }

    const response = await window.AwsWafIntegration.fetch(form.action, {
      method: "POST",
      body,
    })

    if (response.redirected) {
      window.location.assign(response.url)
      return
    }

    if (!response.ok) {
      throw new Error("Unable to submit your registration.")
    }
  }

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_SCRIPT_URL}
        strategy="afterInteractive"
      />

      <form
        ref={formRef}
        method="POST"
        action="/api/notification/subscribe/email"
        onSubmit={handleSubmit}
      >
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

          <div ref={captchaRef} />

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
    </>
  )
}
