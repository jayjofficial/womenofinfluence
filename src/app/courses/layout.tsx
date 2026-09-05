import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.womeninfluencial.com").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "The Program & Curriculum",
  description:
    "Explore the 6-month intensive training program at Women of Influence Academy. Structured across 7 foundational pillars for holistic leadership, mentorship, and business mastery.",
  alternates: {
    canonical: `${siteUrl}/courses`,
  },
  openGraph: {
    title: "The Training Program | Women of Influence Academy",
    description:
      "A 6-month transformative journey across 7 foundational pillars designed for ambitious women leaders and entrepreneurs.",
    url: `${siteUrl}/courses`,
    images: [{ url: "/logo.png", width: 800, height: 600, alt: "WIA Program" }],
  },
  twitter: {
    title: "The Training Program | Women of Influence Academy",
    description:
      "A 6-month transformative journey across 7 foundational pillars designed for ambitious women leaders and entrepreneurs.",
    images: ["/logo.png"],
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Women of Influence Academy 6-Month Cohort Program",
  description:
    "A 6-month intensive leadership and empowerment program structured across 7 foundational pillars including leadership, mentorship, finance, and career transformation.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Women of Influence Academy",
    sameAs: siteUrl,
  },
  timeRequired: "P6M",
  educationalCredentialAwarded: "Certificate of Completion",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Blended",
    courseWorkload: "PT6M",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={courseSchema} />
      {children}
    </>
  );
}
