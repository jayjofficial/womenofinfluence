import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "The 7 Core Pillars of Influence",
  description:
    "Explore the 7 core pillars of Women of Influence Academy: Spiritual Leadership, Family, Education, Business & Finance, Governance, Media & Arts, and Health.",
  alternates: {
    canonical: `${siteUrl}/pillars`,
  },
  openGraph: {
    title: "The 7 Core Pillars of Influence | Women of Influence Academy",
    description:
      "Explore the 7 foundational spheres where women are called to lead, innovate, and make an enduring global impact.",
    url: `${siteUrl}/pillars`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Pillars" }],
  },
  twitter: {
    title: "The 7 Core Pillars of Influence | Women of Influence Academy",
    description:
      "Explore the 7 foundational spheres where women are called to lead, innovate, and make an enduring global impact.",
    images: ["/logo.png"],
  },
};

export default function PillarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
