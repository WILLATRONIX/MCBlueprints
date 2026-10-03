import type { Metadata } from "next"
import { Geist, Geist_Mono, Oxanium } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import BackgroundDots from "@/components/blocks/background-dots"

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MCBlueprints",
  description: "Create, share and download Minecraft creations.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-screen",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        oxanium.variable
      )}
    >
      <head>
        <meta property="og:type" content="website" />
        <meta name="darkreader-lock" />
        <meta property="og:site_name" content="MCBlueprints" />
        <meta property="og:locale" content="en_US" />
        <meta name="application-name" content="MCBlueprints" />
        <meta
          name="keywords"
          content="Axiom, Assets, Assemblies, Resources, Minecraft, Mod, Builds, Building, Builders, Download, Upload, Share, Edit, WILLATRONIX, Blueprint, Blueprints, Preset, Theme, Pack, Schematic, Free, Paid, Premium, Library, MC, Litematics, Schem, Teams"
        />
        <meta name="robots" content="index, follow" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="content-language" content="en" />
        <link
          rel="icon"
          type="image/webp"
          href="https://static.mcbps.com/logo-15px.webp"
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-hidden">
        <ThemeProvider>
          <div className="relative flex min-h-full flex-1 flex-col bg-background">
            <BackgroundDots />
            <main className="relative z-10 flex min-h-full flex-1 flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
