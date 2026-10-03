import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://static.mcbps.com/**")],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // prevent any iframe usage
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ]
  },
}

export default nextConfig
