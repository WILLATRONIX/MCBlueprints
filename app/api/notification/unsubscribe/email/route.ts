export async function POST(req: Request) {
  const formData = await req.formData()

  const email = formData.get("email")

  if (typeof email !== "string" || !email.trim()) {
    return Response.redirect(
      new URL(
        `${process.env.MCBPS_FRONTEND}/subscription-updated?state=failed`,
        req.url
      ),
      303
    )
  }

  try {
    const response = await fetch(
      `${process.env.MCBPS_API_ENDPOINT}/notification/email/unsubscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          subscriptionCategory: 3,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(response)
      return Response.redirect(
        new URL(`/subscription-updated?state=${data.event}`, req.url),
        303
      )
    }

    return Response.redirect(
      new URL(
        `${process.env.MCBPS_FRONTEND}/subscription-updated?state=removed`,
        req.url
      ),
      303
    )
  } catch (error) {
    console.error("API request failed:", error)

    return Response.redirect(
      new URL(
        `${process.env.MCBPS_FRONTEND}/subscription-updated?state=failed`,
        req.url
      ),
      303
    )
  }
}
