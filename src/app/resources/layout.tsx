import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Curated Learning Resources & Guides",
  description:
    "Access curated reading lists, podcasts, leadership blueprints, and strategic toolkits curated by the Women of Influence Academy.",
  alternates: {
    canonical: `${siteUrl}/resources`,
  },
  openGraph: {
    title: "Curated Learning Resources & Guides | Women of Influence Academy",
    description:
      "Empower your mind with curated books, podcasts, and strategic resources for female leaders and entrepreneurs.",
    url: `${siteUrl}/resources`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Resources" }],
  },
  twitter: {
    title: "Curated Learning Resources & Guides | Women of Influence Academy",
    description:
      "Empower your mind with curated books, podcasts, and strategic resources for female leaders and entrepreneurs.",
    images: ["/logo.png"],
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
