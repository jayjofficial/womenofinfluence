"use client";

import { useState, useRef, Suspense } from "react";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import AnimatedSection from "@/components/AnimatedSection";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";
import { useCurrency } from "@/context/CurrencyContext";

// Simple HTML/XSS escape sanitizer helper
const sanitizeString = (val: string): string => {
  return val
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Zod Schema representing the application fields
const applicationSchema = z.object({
  packageName: z.enum(["The Foundation", "The Full Experience"], {
    message: "Please select a valid experience package.",
  }),
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be under 100 characters.")
    .transform((val) => sanitizeString(val)),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .transform((val) => sanitizeString(val)),
  phone: z
    .string()
    .min(8, "Phone number is too short.")
    .max(20, "Phone number is too long.")
    .transform((val) => sanitizeString(val)),
  country: z
    .string()
    .min(2, "Country is required.")
    .max(50, "Country name is too long.")
    .transform((val) => sanitizeString(val)),
  pillars: z
    .array(z.string())
    .min(1, "Please select at least one pillar that resonates with you."),
  whyJoin: z
    .string()
    .min(10, "Please share a bit more detail (minimum 10 characters).")
    .max(1000, "Please keep this under 1000 characters.")
    .transform((val) => sanitizeString(val)),
  vision: z
    .string()
    .min(10, "Please share a bit more detail (minimum 10 characters).")
    .max(1000, "Please keep this under 1000 characters.")
    .transform((val) => sanitizeString(val)),
  referral: z
    .string()
    .max(100, "Referral note is too long.")
    .optional()
    .transform((val) => (val ? sanitizeString(val) : "")),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const ApplyContent = () => {
  const settings = useQuery(api.globalSettings.getGlobalSettings);
  const submitApplication = useMutation(api.inbox.submitApplication);
  const { currency, formatPrice, convertPrice } = useCurrency();

  const isSettingsLoading = settings === undefined;

  const seatsAvailable = settings?.seatsAvailable ?? 5;
  const deadlineDate = settings?.deadlineDate || "July 18, 2026";
  const startDate = settings?.startDate || "July 27, 2026";
  const foundationTotal = settings?.foundationTotal ?? 800;
  const foundationSecure = settings?.foundationSecure ?? 400;
  const foundationInstallment1Amount = settings?.foundationInstallment1Amount ?? 200;
  const foundationInstallment1Month = settings?.foundationInstallment1Month || "August";
  const foundationInstallment2Amount = settings?.foundationInstallment2Amount ?? 200;
  const foundationInstallment2Month = settings?.foundationInstallment2Month || "September";
  const fullExpTotal = settings?.fullExpTotal ?? 3000;
  const fullExpSecure = settings?.fullExpSecure ?? 2000;
  const fullExpInstallment1Amount = settings?.fullExpInstallment1Amount ?? 500;
  const fullExpInstallment1Month = settings?.fullExpInstallment1Month || "August";
  const fullExpInstallment2Amount = settings?.fullExpInstallment2Amount ?? 500;
  const fullExpInstallment2Month = settings?.fullExpInstallment2Month || "September";

  const formRef = useRef<HTMLDivElement>(null);
  const [packageName, setPackageName] = useState<
    "The Foundation" | "The Full Experience"
  >("The Full Experience");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    pillars: [] as string[],
    whyJoin: "",
    vision: "",
    referral: "",
  });

  const handlePillarToggle = (pillar: string) => {
    setFormData((prev) => {
      const isSelected = prev.pillars.includes(pillar);
      let newPillars: string[];
      if (pillar === "I'm not sure yet") {
        newPillars = isSelected ? [] : ["I'm not sure yet"];
      } else {
        const filtered = prev.pillars.filter((p) => p !== "I'm not sure yet");
        newPillars = isSelected
          ? filtered.filter((p) => p !== pillar)
          : [...filtered, pillar];
      }
      return { ...prev, pillars: newPillars };
    });
    if (errors.pillars) {
      setErrors((prev) => ({ ...prev, pillars: undefined }));
    }
  };
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectPackage = (
    pkg: "The Foundation" | "The Full Experience",
  ) => {
    setPackageName(pkg);
    // Smooth scroll to the form element
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ApplicationFormData]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      packageName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      pillars: formData.pillars,
      whyJoin: formData.whyJoin,
      vision: formData.vision,
      referral: formData.referral,
    };

    // Run zod verification
    const result = applicationSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormData, string>> =
        {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ApplicationFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      // Scroll to the first error
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Success payload ready for DB
    const validatedData = result.data;
    const baseAmount = packageName === "The Foundation" ? foundationTotal : fullExpTotal;
    const amount = Number(convertPrice(baseAmount).toFixed(2));
    const currencyCode = currency.code;

    try {
      await submitApplication({
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        country: validatedData.country,
        packageName: validatedData.packageName,
        pillars: validatedData.pillars,
        whyJoin: validatedData.whyJoin,
        vision: validatedData.vision,
        referral: validatedData.referral,
        amount,
        currency: currencyCode,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen font-body text-foreground selection:bg-plum selection:text-white pt-32 pb-24">
      {/* Reservation Header */}
      <section className="px-6 lg:px-12 max-w-4xl mx-auto mb-20">
        <AnimatedSection className="text-center">
          <span className="text-plum font-body text-xs tracking-[0.3em] uppercase mb-6 block font-semibold">
            Cohort Pearl · {isSettingsLoading ? <Skeleton className="h-4 w-24 inline-block" /> : startDate}
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-medium text-foreground leading-[1.1] tracking-tight mb-8">
            Your Seat Is{" "}
            <span className="italic text-soft-gold">Reserved.</span> <br />
            Will You Take It?
          </h1>
          <p className="text-lg text-muted-foreground font-light mb-12">
            Application deadline:{" "}
            <strong className="text-soft-gold font-semibold">
              {isSettingsLoading ? <Skeleton className="h-4 w-24 inline-block bg-soft-gold/20" /> : deadlineDate}
            </strong>
            . You are not here by accident.
          </p>

          <div className="bg-plum text-ivory border border-plum/10 rounded-2xl p-8 max-w-3xl mx-auto text-left shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-wine to-plum opacity-50"></div>
            <div className="relative z-10 space-y-3">
              <span className="text-champagne text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                🔒 Exclusive & Limited
              </span>
              <p className="text-base sm:text-lg font-light leading-relaxed text-ivory/90">
                Only{" "}
                <strong className="font-semibold text-champagne">
                  {isSettingsLoading ? <Skeleton className="h-4 w-8 inline-block bg-champagne/20" /> : seatsAvailable} women
                </strong>{" "}
                will be accepted into Cohort Pearl. This program is
                intentionally small, private, and premium — because every woman
                deserves one-on-one attention and a sisterhood that truly knows
                her.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Pricing Paths */}
      <section className="py-16 px-6 lg:px-12 bg-white border-y border-border/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-soft-gold font-body text-xs tracking-[0.2em] uppercase mb-4 block font-bold">
              Choose Your Experience
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-foreground leading-tight italic">
              Two Paths. One Destination.
            </h2>
            <div className="w-16 h-0.5 bg-soft-gold mx-auto mt-6 mb-8"></div>
            <p className="text-muted-foreground font-light text-lg max-w-2xl mx-auto leading-relaxed">
              Payments are split to make your journey easy. Secure your seat
              with an admission fee, then pay monthly as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* The Foundation Card */}
            <div className="border border-border/40 p-8 lg:p-12 flex flex-col justify-between h-full bg-ivory rounded-2xl hover:border-plum/30 transition-colors duration-300">
              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-semibold text-3xl text-plum mb-1">
                    The Foundation
                  </h3>
                  <p className="text-[14px] tracking-widest uppercase font-semibold text-muted-foreground">
                    Without Trip · Total {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block" /> : formatPrice(foundationTotal)}
                  </p>
                </div>

                <div className="border-y border-border/40 py-4">
                  <div className="text-2xl font-display font-medium text-foreground">
                    {isSettingsLoading ? (
                      <Skeleton className="h-8 w-24 inline-block" />
                    ) : (
                      <>
                        <span className="text-xl font-medium">{currency.symbol}</span>{" "}
                        <span className="text-4xl text-plum font-semibold">
                          {convertPrice(foundationSecure).toLocaleString("en-US", {
                            minimumFractionDigits: ["USD", "GBP", "EUR", "CAD"].includes(currency.code) ? 2 : 0,
                            maximumFractionDigits: ["USD", "GBP", "EUR", "CAD"].includes(currency.code) ? 2 : 0,
                          })}
                        </span>
                      </>
                    )}{" "}
                    <span className="text-sm font-body font-light text-muted-foreground">
                      to secure seat
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-white/80 p-6 border border-border/20 space-y-3 rounded-lg">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                    Payment Schedule
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-foreground/80">
                      🔐 Before Admission
                    </span>
                    <span className="font-medium text-foreground">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block" /> : formatPrice(foundationSecure)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-foreground/80">
                      📅 {isSettingsLoading ? <Skeleton className="h-4 w-16 inline-block" /> : foundationInstallment1Month}
                    </span>
                    <span className="font-medium text-foreground">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block" /> : formatPrice(foundationInstallment1Amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-foreground/80">
                      📅 {isSettingsLoading ? <Skeleton className="h-4 w-16 inline-block" /> : foundationInstallment2Month}
                    </span>
                    <span className="font-medium text-foreground">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block" /> : formatPrice(foundationInstallment2Amount)}
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground font-light text-base leading-relaxed">
                  Everything begins here. Over 6 transformative months, you will
                  be equipped, sharpened, and positioned for influence. You will
                  not leave the same woman who walked in.
                </p>

                <ul className="space-y-3 border-t border-border/40 pt-6">
                  {[
                    "Full 6-month deep leadership programme",
                    "Daily morning talks & evening Bible study",
                    "Weekly courses with assignments & challenges",
                    "Bi-weekly Q&A sessions",
                    "Game nights & sister bonding sessions",
                    "Presentations & communication training",
                    "Certificate of completion",
                    "Lifetime sisterhood & network",
                  ].map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-foreground/80 font-light items-start"
                    >
                      <span className="text-soft-gold font-bold">✦</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10">
                <button
                  onClick={() => handleSelectPackage("The Foundation")}
                  className="w-full py-4 text-center border border-plum text-plum font-semibold text-xs tracking-wider uppercase rounded-full hover:bg-plum hover:text-white transition-all duration-300"
                >
                  Choose Foundation
                </button>
              </div>
            </div>

            {/* The Full Experience Card */}
            <div className="border-2 border-plum p-8 lg:p-12 flex flex-col justify-between h-full bg-plum text-ivory rounded-2xl relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 bg-soft-gold text-foreground text-[10px] tracking-wider uppercase font-bold py-1 px-4 rounded-bl-xl z-10">
                Best Experience
              </div>

              <div className="space-y-8 z-10">
                <div>
                  <h3 className="font-display font-semibold text-3xl text-champagne mb-1">
                    The Full Experience
                  </h3>
                  <p className="text-[14px] tracking-widest uppercase font-semibold text-ivory/60">
                    With 4-Day Accra Trip · Total {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block bg-white/10" /> : formatPrice(fullExpTotal)}
                  </p>
                </div>

                <div className="border-y border-ivory/20 py-4">
                  <div className="text-2xl font-display font-medium text-ivory">
                    {isSettingsLoading ? (
                      <Skeleton className="h-8 w-24 inline-block bg-white/10" />
                    ) : (
                      <>
                        <span className="text-xl font-medium">{currency.symbol}</span>{" "}
                        <span className="text-4xl text-champagne font-semibold">
                          {convertPrice(fullExpSecure).toLocaleString("en-US", {
                            minimumFractionDigits: ["USD", "GBP", "EUR", "CAD"].includes(currency.code) ? 2 : 0,
                            maximumFractionDigits: ["USD", "GBP", "EUR", "CAD"].includes(currency.code) ? 2 : 0,
                          })}
                        </span>
                      </>
                    )}{" "}
                    <span className="text-sm font-body font-light text-ivory/60">
                      to secure seat
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-wine/60 p-6 border border-white/10 space-y-3 rounded-lg">
                  <div className="text-xs font-bold tracking-widest uppercase text-champagne mb-2">
                    Payment Schedule
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-ivory/80">
                      🔐 Before Admission
                    </span>
                    <span className="font-medium text-ivory">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block bg-white/10" /> : formatPrice(fullExpSecure)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-ivory/80">📅 {isSettingsLoading ? <Skeleton className="h-4 w-16 inline-block bg-white/10" /> : fullExpInstallment1Month}</span>
                    <span className="font-medium text-ivory">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block bg-white/10" /> : formatPrice(fullExpInstallment1Amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-ivory/80">
                      📅 {isSettingsLoading ? <Skeleton className="h-4 w-16 inline-block bg-white/10" /> : fullExpInstallment2Month}
                    </span>
                    <span className="font-medium text-ivory">
                      {isSettingsLoading ? <Skeleton className="h-4 w-12 inline-block bg-white/10" /> : formatPrice(fullExpInstallment2Amount)}
                    </span>
                  </div>
                </div>

                <p className="text-ivory/80 font-light text-base leading-relaxed">
                  Everything in Foundation, plus a 4-day immersive retreat in
                  Accra where you will seek God together, dine, explore, and
                  plan your influence alongside your sisters. The women you meet
                  on this trip will become your lifelong circle.
                </p>

                <ul className="space-y-3 border-t border-white/10 pt-6">
                  {[
                    "Everything in The Foundation",
                    "4-day bonding retreat in Accra",
                    "Corporate dinner date together",
                    "Several curated outings & experiences",
                    "Intentional networking & mind-rubbing sessions",
                    "Collective planning for effective leadership",
                    "Seeking God together as a sisterhood",
                    "Memories and connections that last a lifetime",
                  ].map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-ivory/90 font-light items-start"
                    >
                      <span className="text-champagne font-bold">✦</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10 z-10">
                <button
                  onClick={() => handleSelectPackage("The Full Experience")}
                  className="w-full py-4 text-center bg-soft-gold text-foreground font-semibold text-xs tracking-wider uppercase rounded-full hover:bg-champagne transition-all duration-300"
                >
                  Choose Full Experience
                </button>
              </div>
            </div>
          </div>

          {/* Deadline Strip */}
          <div className="bg-ivory border border-border/40 py-6 px-6 text-center rounded-xl mt-12 text-sm text-muted-foreground flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-border/40">
            <div className="flex flex-col items-center pt-2 md:pt-0">
              <span className="mb-1 text-xs uppercase tracking-widest font-bold">Application deadline</span>
              <strong className="text-foreground text-base">{isSettingsLoading ? <Skeleton className="h-5 w-24 inline-block" /> : deadlineDate}</strong>
            </div>
            <div className="flex flex-col items-center pt-4 md:pt-0 md:pl-12">
              <span className="mb-1 text-xs uppercase tracking-widest font-bold">Programme starts</span>
              <strong className="text-foreground text-base">{isSettingsLoading ? <Skeleton className="h-5 w-24 inline-block" /> : startDate}</strong>
            </div>
            <div className="flex flex-col items-center pt-4 md:pt-0 md:pl-12">
              <span className="text-xs uppercase tracking-widest font-bold text-foreground">All currencies accepted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Container */}
      <div ref={formRef} className="max-w-xl mx-auto px-6 pt-24">
        {isSuccess ? (
          <AnimatedSection className="text-center bg-white border border-border/40 p-8 lg:p-12 shadow-lg rounded-2xl py-16 space-y-6">
            <div className="flex justify-center text-soft-gold">
              <CheckCircle2 size={64} strokeWidth={1.5} />
            </div>
            <h3 className="font-display font-medium text-3xl text-plum italic">
              Seat Reserved Tentatively
            </h3>
            <p className="text-muted-foreground font-light text-base leading-relaxed max-w-sm mx-auto">
              Thank you for applying to{" "}
              <strong className="text-foreground">{packageName}</strong>. Kindly check your email for our update regarding your application.
            </p>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <div className="mb-12">
              <span className="text-plum font-body text-xs tracking-[0.3em] uppercase mb-4 block font-semibold">
                The Application
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-foreground leading-[1.1] mb-4">
                Tell Us About <br />
                <span className="italic text-soft-gold">You</span>
              </h2>
              <div className="w-12 h-0.5 bg-soft-gold mb-6"></div>
              <p className="text-muted-foreground font-light text-base leading-relaxed">
                Take your time with this. These questions are not just
                administrative — they are the beginning of your WIA journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-white border border-border/30 p-8 lg:p-10 rounded-2xl shadow-sm"
            >
              {/* Preset Package Selector */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Chosen Package *
                </label>
                <div className="relative">
                  <select
                    value={packageName}
                    onChange={(e) =>
                      setPackageName(
                        e.target.value as
                        | "The Foundation"
                        | "The Full Experience",
                      )
                    }
                    className="w-full bg-ivory border border-border/30 px-4 py-3 rounded-lg text-sm text-foreground focus:outline-none focus:border-plum cursor-pointer appearance-none"
                  >
                    <option value="The Foundation">
                      The Foundation (Without Trip) — {isSettingsLoading ? "Loading..." : formatPrice(foundationTotal)}
                    </option>
                    <option value="The Full Experience">
                      The Full Experience (With Accra Trip) — {isSettingsLoading ? "Loading..." : formatPrice(fullExpTotal)}
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-plum">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.packageName && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.packageName}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleFieldChange("fullName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all"
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+233 or your country code"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Country *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Where are you based?"
                  value={formData.country}
                  onChange={(e) => handleFieldChange("country", e.target.value)}
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all"
                />
                {errors.country && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.country}
                  </p>
                )}
              </div>

              {/* Pillar of Influence Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                  Your Pillars of Influence *{" "}
                  <span className="text-muted-foreground/60 font-light normal-case">
                    (Select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Spiritual Leadership & Ministry",
                    "Family & Relationships",
                    "Education & Academia",
                    "Business & Finance",
                    "Government & Politics",
                    "Media & Communication",
                    "Arts, Entertainment & Innovation",
                    "I'm not sure yet",
                  ].map((pillar) => {
                    const isSelected = formData.pillars.includes(pillar);
                    return (
                      <button
                        key={pillar}
                        type="button"
                        onClick={() => handlePillarToggle(pillar)}
                        className={`text-left px-4 py-3 rounded-lg border text-sm font-normal transition-all flex items-center justify-between ${isSelected
                            ? "border-plum bg-plum/5 text-plum font-normal"
                            : "border-border/40 hover:border-plum/30 bg-transparent text-foreground"
                          }`}
                      >
                        <span>{pillar}</span>
                        {isSelected && (
                          <span className="text-plum text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.pillars && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.pillars}
                  </p>
                )}
              </div>

              {/* Why Do You Want To Join WIA? */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Why Do You Want To Join WIA? *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what is drawing you to this program. What led you here? What are you hoping to step into?"
                  value={formData.whyJoin}
                  onChange={(e) => handleFieldChange("whyJoin", e.target.value)}
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all resize-none font-light leading-relaxed"
                />
                {errors.whyJoin && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.whyJoin}
                  </p>
                )}
              </div>

              {/* Your Vision For Your Future */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  Your Vision For Your Future *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the woman you see yourself becoming. Where do you see yourself in 2–5 years? What mark do you want to leave on the world?"
                  value={formData.vision}
                  onChange={(e) => handleFieldChange("vision", e.target.value)}
                  className="w-full px-4 py-3 border border-border/30 rounded-lg text-sm bg-transparent focus:outline-none focus:border-plum transition-all resize-none font-light leading-relaxed"
                />
                {errors.vision && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.vision}
                  </p>
                )}
              </div>

              {/* Referral / How did you hear about WIA */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                  How Did You Hear About WIA?
                </label>
                <div className="relative">
                  <select
                    value={formData.referral}
                    onChange={(e) =>
                      handleFieldChange("referral", e.target.value)
                    }
                    className="w-full bg-transparent border border-border/30 px-4 py-3 rounded-lg text-sm text-foreground focus:outline-none focus:border-plum cursor-pointer appearance-none"
                  >
                    <option value="">— Select —</option>
                    <option value="Social Media">Social Media</option>
                    <option value="A Friend or Family Member">
                      A Friend or Family Member
                    </option>
                    <option value="Church / Ministry">Church / Ministry</option>
                    <option value="Google / Online Search">
                      Google / Online Search
                    </option>
                    <option value="WhatsApp / Telegram">
                      WhatsApp / Telegram
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-plum">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.referral && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.referral}
                  </p>
                )}
              </div>

              <div className="pt-6 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-plum text-white font-body font-medium px-12 py-4 tracking-widest uppercase text-sm hover:bg-wine transition-all duration-300 flex items-center justify-center gap-4 w-full sm:w-auto shadow-md hover-lift disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Processing Application..."
                    : "Submit Application"}{" "}
                  <ArrowRight size={18} />
                </button>

                <div className="flex items-center gap-2 mt-6 text-muted-foreground font-light text-xs">
                  <ShieldCheck size={14} className="text-plum" />
                  Your entry is validated and encrypted for database security
                </div>
              </div>
            </form>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-12 min-h-screen text-center">Loading...</div>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
