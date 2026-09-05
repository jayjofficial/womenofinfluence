import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Corporate Partnerships & Collaborations",
  description:
    "Partner with Women of Influence Academy to empower female leaders, sponsor training initiatives, and drive sustainable gender equity.",
  alternates: {
    canonical: `${siteUrl}/partnerships`,
  },
  openGraph: {
    title: "Corporate Partnerships & Collaborations | Women of Influence Academy",
    description:
      "Collaborate with WIA to foster female talent, sponsor cohorts, and build inclusive leadership across industries.",
    url: `${siteUrl}/partnerships`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Partnerships" }],
  },
  twitter: {
    title: "Corporate Partnerships & Collaborations | Women of Influence Academy",
    description:
      "Collaborate with WIA to foster female talent, sponsor cohorts, and build inclusive leadership across industries.",
    images: ["/logo.png"],
  },
};

export default function PartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
