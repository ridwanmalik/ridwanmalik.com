import Navbar from "@/components/layouts/Navbar"
import FixedSocialMenu from "@/components/shared/FixedSocialMenu"
import { PERSONAL_INFO } from "@/lib/constants"
import "@/styles/globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { ReactNode } from "react"

// Google Analytics only loads once NEXT_PUBLIC_GA_ID is set (the G-XXXXXXX
// measurement ID from the GA4 property). Vercel Analytics needs no ID.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: {
    default: PERSONAL_INFO.metaTitle,
    template: `%s | ${PERSONAL_INFO.name}`,
  },
  description: PERSONAL_INFO.metaDescription,
  keywords: [
    "Sk. Ridwanul Malik",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Laravel",
    "PHP",
    "Node.js",
    "Vue.js",
    "JavaScript",
    "TypeScript",
    "Web Development",
    "Frontend",
    "Backend",
    "Portfolio",
  ],
  authors: [{ name: PERSONAL_INFO.name, url: PERSONAL_INFO.website }],
  creator: PERSONAL_INFO.name,
  publisher: PERSONAL_INFO.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PERSONAL_INFO.website,
    siteName: PERSONAL_INFO.name,
    title: PERSONAL_INFO.metaTitle,
    description: PERSONAL_INFO.metaDescription,
    // The card image comes from app/opengraph-image.tsx — Next adds the tags.
  },
  twitter: {
    card: "summary_large_image",
    title: PERSONAL_INFO.metaTitle,
    description: PERSONAL_INFO.metaDescription,
  },
  alternates: {
    canonical: PERSONAL_INFO.website,
  },
  metadataBase: new URL(PERSONAL_INFO.website),
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    // data-scroll-behavior keeps Next.js 16 jumping straight to the top on route
    // changes, despite the global `scroll-behavior: smooth` in globals.css.
    // suppressHydrationWarning: browsers/extensions inject attributes on <html>
    // (e.g. mobile Chrome's __gcrremoteframetoken) before React hydrates.
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className="h-screen w-screen bg-slate-900 text-slate-400 bg-glowing-blue font-sans tracking-wide"
        style={{
          fontFamily: "var(--font-sans)",
        }}>
        <div className="h-screen w-screen relative">
          <Navbar />
          <FixedSocialMenu />
          <div className="section-wrapper">{children}</div>
        </div>
        <Analytics />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  )
}

export default RootLayout
