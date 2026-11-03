"use client"

import { useEffect, useRef, useState } from "react"
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
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    AwsWafIntegration: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    }
    AwsWafCaptcha: {
      renderCaptcha: (
        container: HTMLElement,
        options: {
          apiKey: string
          disableLanguageSelector: boolean
          onSuccess: () => void
          onError?: (error: unknown) => void
        }
      ) => void
    }
  }
}

export function WaitlistForm() {
  const captchaRef = useRef<HTMLDivElement>(null)
  const [captchaComplete, setCaptchaComplete] = useState(false)
  const [captchaLoaded, setCaptchaLoaded] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)

  const captchaRendered = useRef(false)

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!showCaptcha) {
      setShowCaptcha(true)
      return
    }

    if (!captchaComplete) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        body.append(key, value)
      }
    }

    try {
      const response = await window.AwsWafIntegration.fetch(form.action, {
        method: "POST",
        body,
        credentials: "include",
      })

      if (response.redirected) {
        window.location.assign(response.url)
        return
      }

      if (!response.ok) {
        throw new Error("Unable to submit your registration.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (
      !captchaLoaded ||
      !showCaptcha ||
      !captchaRef.current ||
      !window.AwsWafCaptcha ||
      captchaRendered.current
    ) {
      return
    }

    captchaRendered.current = true

    try {
      window.AwsWafCaptcha.renderCaptcha(captchaRef.current, {
        apiKey: process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_API_KEY!,
        disableLanguageSelector: true,
        onSuccess: () => setCaptchaComplete(true),
        onError: (error) => {
          console.error("AWS CAPTCHA error:", error)
          setCaptchaComplete(false)
          captchaRendered.current = false
        },
      })
    } catch (error) {
      console.error("AWS CAPTCHA initialisation failed:", error)
      captchaRendered.current = false
    }
  }, [captchaLoaded, showCaptcha])

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("AWS WAF script loaded")
          console.log(process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_SCRIPT_URL)
          console.log(process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_API_KEY)
          console.log(window.AwsWafCaptcha)
          console.log(window.AwsWafIntegration)
          setCaptchaLoaded(true)
        }}
        onError={(error) => {
          console.error("AWS WAF script failed:", error)
        }}
      />

      <form
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

          <div className="flex w-full items-center justify-center">
            <p>test</p>
            <p className="text-destructive">
              {process.env.NEXT_PUBLIC_AWS_WAF_CAPTCHA_API_KEY}
            </p>
            <div
              ref={captchaRef}
              className={cn("hidden bg-mist-200 p-2", showCaptcha && "flex")}
            />
          </div>

          <Field orientation="horizontal" className="justify-between">
            <Link href="/unsubscribe">Click here to unsubscribe</Link>
            <div className="flex gap-2">
              <Button type="reset" variant="outline">
                Reset
              </Button>
              <Button type="submit" disabled={!captchaComplete && showCaptcha}>
                Submit
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}
