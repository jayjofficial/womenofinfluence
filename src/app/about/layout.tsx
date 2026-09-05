import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "About Us & Mission",
  description:
    "Discover the mission and vision of Women of Influence Academy. We cultivate bold, decisive female leaders through mentorship, community, and values of excellence and integrity.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Us & Mission | Women of Influence Academy",
    description:
      "Empowering every woman to lead, create, and influence. Learn about our story, foundational values, and global impact.",
    url: `${siteUrl}/about`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "About WIA" }],
  },
  twitter: {
    title: "About Us & Mission | Women of Influence Academy",
    description:
      "Empowering every woman to lead, create, and influence. Learn about our story, foundational values, and global impact.",
    images: ["/logo.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
