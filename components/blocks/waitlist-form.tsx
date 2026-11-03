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

  const renderCaptcha = () => {
    if (!captchaRef.current || !window.AwsWafCaptcha) return

    window.AwsWafCaptcha.renderCaptcha(captchaRef.current, {
      apiKey:
        "KggvqRhnYYhYtSG/D66pdrIUnobbqt0TqNq6KTW8GkJcBX8dDcRnhQhY4PFnrbD7KEesKEvRX0nhMldYxBxLnO62PUNvllCvjfIlSMeqXx3A+fbw8Ink6qYf/2Vk6G7BfCzhNPXyAsTQYiEeQhNX/DFjnenjVurCm4yShJevvzmqCnCOGJgk8bvAFkzL/hiuWLG+IolzRq9oYz5sSqegCQlbvkbPot0SqLtGJFjNATodzGxr0dzOGing7MBKsN/oIpizin4tAi/1ih7vjLgc9ZpE31VwOkbrZX2QfgSD+Fy4eudoQRBHoHOO3jAer52EcXk/7jFv0cOG6CEOoWqZg7dPwIrEFjuUsRMIjsUlRk+EFr9h2MNBwyl9oUehqI2ppxTQs+SDTnu2bx8AQM1iX0W3Tv2G8+FR3CXV2jfn3WzzgsvH0teUjLI85ghwnnziXfaoU3I/zVdpFhmVkkJsQ3xaj3jYFQEXYMpl9uffhRPkdK5ZAXeuLg1Eu64+LJOcTP50340MN3VlMRDvrWRHZwoXSwxTREIeSWz5GtOHD9pG951x4M8f3zLLIuqRtpC/1sCHeMrfB4OdMlU1qgJUw5BjY2LJZvQyyjGA5aQFZ10+/egZmgUntJEXKBRoeEy7gvdxrEdpcTs5pxXLddx1Rk5y6paSaJlSNJHIdrWFUfM=_1_1",
      disableLanguageSelector: true,
      onSuccess: () => setCaptchaComplete(true),
      onError: () => setCaptchaComplete(false),
    })
  }

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
    if (captchaLoaded) renderCaptcha()
  }, [captchaLoaded])

  return (
    <>
      <Script
        src={
          "https://ff34dae1aaa4.edge.captcha-sdk.awswaf.com/ff34dae1aaa4/jsapi.js"
        }
        strategy="afterInteractive"
        onLoad={() => setCaptchaLoaded(true)}
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
