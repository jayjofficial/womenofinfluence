import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { CachePreloader } from "@/components/CachePreloader";
import { CurrencyProvider } from "@/context/CurrencyContext";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const viewport: Viewport = {
  themeColor: "#4A1525",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Women of Influence Academy | Empowering Women Leaders",
    template: "%s | Women of Influence Academy",
  },
  description:
    "Women of Influence Academy (WIA) empowers women through executive mentorship, transformative education, and a global community to build impactful careers and businesses.",
  applicationName: "Women of Influence Academy",
  keywords: [
    "Women of Influence Academy",
    "WIA",
    "women leadership academy",
    "female executive mentorship",
    "women empowerment Ghana",
    "female entrepreneurs network",
    "women in leadership",
    "business leadership academy",
    "executive training for women",
  ],
  authors: [{ name: "Women of Influence Academy", url: siteUrl }],
  creator: "Women of Influence Academy",
  publisher: "Women of Influence Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Women of Influence Academy",
    title: "Women of Influence Academy | Empowering Women Leaders",
    description:
      "Empowering women through mentorship, education, and community to build impactful careers and businesses.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Women of Influence Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Women of Influence Academy | Empowering Women Leaders",
    description:
      "Empowering women through mentorship, education, and community to build impactful careers and businesses.",
    images: ["/logo.png"],
  },
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "8Sd10_DKAR22hODbkQ2WFjf3ZcFjuzcQjYd9rbu6wdc",
    other: {
      "google-site-verification": "8Sd10_DKAR22hODbkQ2WFjf3ZcFjuzcQjYd9rbu6wdc",
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "Organization"],
      "@id": `${siteUrl}/#organization`,
      name: "Women of Influence Academy",
      alternateName: "WIA",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
      description:
        "Women of Influence Academy empowers women through mentorship, education, and community to build impactful careers and businesses.",
      sameAs: [
        "https://www.instagram.com/women_of_influence_academy",
        "https://youtube.com/@women_of_influence",
        "https://www.tiktok.com/@womenofinfluence.wia",
      ],
      areaServed: "Worldwide",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Women of Influence Academy",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full overscroll-y-none antialiased selection:bg-plum selection:text-white">
      <head>
        <JsonLd schema={organizationSchema} />
      </head>
      <body className="min-h-full flex flex-col font-body bg-background text-foreground">
        <ConvexClientProvider>
          <ConvexQueryCacheProvider expiration={300000}>
            <CurrencyProvider>
              <CachePreloader />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CurrencyProvider>
          </ConvexQueryCacheProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
