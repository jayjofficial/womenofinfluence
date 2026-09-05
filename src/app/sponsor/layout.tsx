import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Sponsor a Woman Leader | Scholarships & Giving",
  description:
    "Sponsor a woman leader through the Women of Influence Academy scholarship fund. Your contribution funds transformative education and leadership development.",
  alternates: {
    canonical: `${siteUrl}/sponsor`,
  },
  openGraph: {
    title: "Sponsor a Woman Leader | Women of Influence Academy",
    description:
      "Invest in the next generation of female leaders. Fund scholarships and empower women to transform their communities.",
    url: `${siteUrl}/sponsor`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "Sponsor WIA" }],
  },
  twitter: {
    title: "Sponsor a Woman Leader | Women of Influence Academy",
    description:
      "Invest in the next generation of female leaders. Fund scholarships and empower women to transform their communities.",
    images: ["/logo.png"],
  },
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
