export async function POST(req: Request) {
  const formData = await req.formData()

  const name = formData.get("name")
  const email = formData.get("email")

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    !name.trim() ||
    !email.trim()
  ) {
    return Response.redirect(
      new URL("/subscription-updated?state=failed", req.url),
      303
    )
  }

  try {
    const response = await fetch(
      `${process.env.MCBPS_API_ENDPOINT}/notification/email/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subscriptionCategory: 3,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error(data)

      return Response.redirect(
        new URL(`/subscription-updated?state=${data.event}`, req.url),
        303
      )
    }

    return Response.redirect(
      new URL("/subscription-updated?state=added", req.url),
      303
    )
  } catch (error) {
    console.error("API request failed:", error)

    return Response.redirect(
      new URL("/subscription-updated?state=failed", req.url),
      303
    )
  }
}
