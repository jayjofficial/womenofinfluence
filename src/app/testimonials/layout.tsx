import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Alumni Stories & Testimonials",
  description:
    "Hear inspiring firsthand stories and video testimonials from alumni of Women of Influence Academy whose lives, careers, and businesses have been transformed.",
  alternates: {
    canonical: `${siteUrl}/testimonials`,
  },
  openGraph: {
    title: "Alumni Stories & Testimonials | Women of Influence Academy",
    description:
      "Real stories of transformation, growth, and empowerment from women who walked through the Women of Influence Academy.",
    url: `${siteUrl}/testimonials`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Alumni Testimonials" }],
  },
  twitter: {
    title: "Alumni Stories & Testimonials | Women of Influence Academy",
    description:
      "Real stories of transformation, growth, and empowerment from women who walked through the Women of Influence Academy.",
    images: ["/logo.png"],
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
