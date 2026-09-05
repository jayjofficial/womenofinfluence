import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Alumni Businesses Directory",
  description:
    "Explore successful enterprises, nonprofits, and ventures founded and led by alumni of the Women of Influence Academy.",
  alternates: {
    canonical: `${siteUrl}/businesses`,
  },
  openGraph: {
    title: "Alumni Businesses Directory | Women of Influence Academy",
    description:
      "Empires built by women. Discover businesses, nonprofits, and movements launched by WIA alumni.",
    url: `${siteUrl}/businesses`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Alumni Businesses" }],
  },
  twitter: {
    title: "Alumni Businesses Directory | Women of Influence Academy",
    description:
      "Empires built by women. Discover businesses, nonprofits, and movements launched by WIA alumni.",
    images: ["/logo.png"],
  },
};

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
