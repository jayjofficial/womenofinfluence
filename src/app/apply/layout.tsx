import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Apply for the Upcoming Cohort",
  description:
    "Apply now to join the next Women of Influence Academy cohort. Secure your place for transformative mentorship, executive training, and visionary sisterhood.",
  alternates: {
    canonical: `${siteUrl}/apply`,
  },
  openGraph: {
    title: "Apply for the Upcoming Cohort | Women of Influence Academy",
    description:
      "Take the defining step in your leadership journey. Applications are now open for the next Women of Influence Academy cohort.",
    url: `${siteUrl}/apply`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "Apply to WIA" }],
  },
  twitter: {
    title: "Apply for the Upcoming Cohort | Women of Influence Academy",
    description:
      "Take the defining step in your leadership journey. Applications are now open for the next Women of Influence Academy cohort.",
    images: ["/logo.png"],
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
