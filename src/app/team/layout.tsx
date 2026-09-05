import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Executive Leadership & Mentors",
  description:
    "Meet the visionary executives, board members, and mentors leading Women of Influence Academy and empowering women worldwide.",
  alternates: {
    canonical: `${siteUrl}/team`,
  },
  openGraph: {
    title: "Executive Leadership & Mentors | Women of Influence Academy",
    description:
      "Meet the dedicated leadership team driving the mission and expanding the global impact of Women of Influence Academy.",
    url: `${siteUrl}/team`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Leadership Team" }],
  },
  twitter: {
    title: "Executive Leadership & Mentors | Women of Influence Academy",
    description:
      "Meet the dedicated leadership team driving the mission and expanding the global impact of Women of Influence Academy.",
    images: ["/logo.png"],
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
