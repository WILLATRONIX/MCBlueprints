import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "static.mcbps.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				pathname: "/**",
			},
		],
	},
	devIndicators: false,
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						// discourage iframe usage
						key: "X-Frame-Options",
						value: "DENY",
					},
				],
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/@:username",
				destination: "/user/:username",
			},
		];
	},
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
