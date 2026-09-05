import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Accreditation & Compliance",
  description:
    "View official institutional accreditations, certifications, and compliance licenses governing Women of Influence Academy internationally.",
  alternates: {
    canonical: `${siteUrl}/licenses`,
  },
  openGraph: {
    title: "Accreditation & Compliance | Women of Influence Academy",
    description:
      "Review our international compliance, institutional licenses, and regulatory recognitions.",
    url: `${siteUrl}/licenses`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Accreditation" }],
  },
  twitter: {
    title: "Accreditation & Compliance | Women of Influence Academy",
    description:
      "Review our international compliance, institutional licenses, and regulatory recognitions.",
    images: ["/logo.png"],
  },
};

export default function LicensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
