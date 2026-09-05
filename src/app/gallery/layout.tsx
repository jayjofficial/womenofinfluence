import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Media & Event Gallery",
  description:
    "Explore unforgettable moments, cohort graduations, masterclasses, networking events, and award galas at Women of Influence Academy.",
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
  openGraph: {
    title: "Media & Event Gallery | Women of Influence Academy",
    description:
      "A visual chronicle of sisterhood, achievement, and empowerment across Women of Influence Academy events and cohorts.",
    url: `${siteUrl}/gallery`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Gallery" }],
  },
  twitter: {
    title: "Media & Event Gallery | Women of Influence Academy",
    description:
      "A visual chronicle of sisterhood, achievement, and empowerment across Women of Influence Academy events and cohorts.",
    images: ["/logo.png"],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
