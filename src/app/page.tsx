"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../convex/_generated/api";

const Index = () => {
  const settings = useQuery(api.globalSettings.getGlobalSettings);

  const heroImage = settings?.imageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";
  const heroQuote = settings?.heroQuote || "We are women of excellence, wisdom and wealth.";
  const heroQuoteAuthor = settings?.heroQuoteAuthor || "Emanuella Ulamba, Founder";
  const seatsAvailable = settings?.seatsAvailable ?? 5;
  const deadlineDate = settings?.deadlineDate || "July 18";
  const startDate = settings?.startDate || "July 27";
  const stat1Value = settings?.stat1Value || "2";
  const stat1Label = settings?.stat1Label || "Cohorts";
  const stat2Value = settings?.stat2Value || "6";
  const stat2Label = settings?.stat2Label || "Months";
  const stat3Value = settings?.stat3Value || "7";
  const stat3Label = settings?.stat3Label || "Pillars";

  const isSettingsLoading = settings === undefined;

  return (
    <div className="bg-ivory min-h-screen font-body text-foreground overflow-hidden selection:bg-plum selection:text-white">
      {/* Editorial Hero */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-6 lg:px-12 bg-plum text-ivory">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 z-10 pt-12 lg:pt-0"
          >
            <span className="text-champagne font-body text-xs tracking-[0.3em] uppercase mb-6 block font-semibold">
              Women Of Influence Academy
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-medium leading-[1.05] tracking-tight mb-6 lg:mb-8">
              Lead with <br />
              <span className="italic text-champagne">Grace</span> & <br />
              Influence.
            </h1>
            <p className="text-lg sm:text-xl text-ivory/80 font-light leading-relaxed mb-12 max-w-lg">
              A transformative space where ambitious women cultivate the
              confidence, network, and expertise to command their industries.
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="/courses"
                className="group flex items-center gap-4 text-sm tracking-widest uppercase border-b border-champagne/50 pb-1 text-champagne hover:text-ivory hover:border-ivory transition-all duration-300"
              >
                Explore The Program{" "}
                <ArrowRight
                  size={16}
                  className="transform group-hover:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative h-[60vh] lg:h-[80vh] w-full"
          >
            {isSettingsLoading ? (
              <Skeleton className="absolute inset-0 w-full h-full rounded-t-[10rem]" />
            ) : (
              <Image
                src={heroImage}
                alt="Elegant portrait of a woman leader"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                className="absolute inset-0 w-full h-full object-cover rounded-t-[10rem] shadow-2xl"
              />
            )}
            <div className="absolute -bottom-6 -left-6 bg-ivory text-foreground p-8 shadow-xl max-w-xs w-72">
              {isSettingsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-1/2 mt-4" />
                </div>
              ) : (
                <>
                  <p className="font-display italic text-plum text-xl mb-3 leading-snug">
                    &ldquo;{heroQuote}&rdquo;
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    &mdash; {heroQuoteAuthor}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deadline Strip - Minimal Typography */}
      <section className="bg-soft-gold py-10 px-6 text-center shadow-sm relative z-20 flex justify-center items-center">
        {isSettingsLoading ? (
          <Skeleton className="h-4 w-96 bg-foreground/10" />
        ) : (
          <p className="text-foreground font-body text-sm sm:text-base tracking-[0.2em] uppercase font-semibold">
            Cohort Pearl &nbsp;&middot;&nbsp; Only {seatsAvailable} {' '} seats available
            &nbsp;&middot;&nbsp; Deadline: {deadlineDate} &nbsp;&middot;&nbsp; Starts {' '}
            {startDate}
          </p>
        )}
      </section>

      {/* Who We Are Section - Editorial */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-plum font-body text-xs tracking-[0.3em] uppercase mb-6 block">
              Who We Are
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-medium leading-tight mb-8 lg:mb-10 text-foreground">
              A Movement, <br className="lg:hidden" />
              <span className="italic text-champagne">Not Just a Program.</span>
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Women of Influence Academy exists to equip, empower, and elevate
              women into positions of influence. Through spiritual and
              intellectual growth, we build a generation of women who lead with
              wisdom, integrity, and impact.
            </p>
            <p className="text-muted-foreground text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-12">
              { "This is more than training — it is a calling to rise, occupy strategic positions, and extend God's kingdom in every sphere of society." }
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-4 text-sm tracking-widest uppercase border-b border-plum pb-1 text-plum hover:text-plum-dark transition-colors"
            >
              Learn More About WIA{" "}
              <ArrowRight
                size={16}
                className="transform group-hover:translate-x-2 transition-transform duration-300"
              />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* The 7 Pillars Section - Typographic Grid */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-plum text-ivory">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <AnimatedSection>
                <span className="text-champagne font-body text-xs tracking-[0.3em] uppercase mb-6 block">
                  The 7 Pillars
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6 lg:mb-8">
                  Every Sphere.
                  <br />
                  <span className="italic text-champagne">Every Woman.</span>
                </h2>
                <p className="text-ivory/70 text-lg font-light leading-relaxed max-w-md mb-12">
                  God raises women to occupy strategic positions across every
                  pillar of society. Which one is yours?
                </p>
                <Link
                  href="/pillars"
                  className="group inline-flex items-center gap-4 text-sm tracking-widest uppercase border-b border-champagne/50 pb-1 text-champagne hover:text-ivory transition-all"
                >
                  Explore The Pillars{" "}
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-2 transition-transform duration-300"
                  />
                </Link>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-7">
              <AnimatedSection delay={0.2}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 lg:gap-y-8">
                  {[
                    "Spiritual Leadership",
                    "Family & Relationships",
                    "Education & Academia",
                    "Business & Finance",
                    "Government & Politics",
                    "Media & Communication",
                    "Arts & Innovation",
                  ].map((pillar, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-2 border-t border-ivory/10 pt-6"
                    >
                      <span className="text-champagne font-display italic text-lg opacity-80">
                        0{idx + 1}
                      </span>
                      <span className="font-body tracking-wide text-lg text-ivory/90">
                        {pillar}
                      </span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Is this you? Section - Editorial List, No Slop */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-ivory">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-24">
              <span className="text-plum font-body text-xs tracking-[0.3em] uppercase mb-6 block">
                Is This You?
              </span>
              <h2 className="text-4xl lg:text-6xl font-display font-medium leading-tight text-foreground">
                WIA Was Built{" "}
                <span className="italic text-champagne">For You</span> If...
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {[
                {
                  highlight: "You know you were born for more",
                  rest: "but haven't fully stepped into it yet.",
                },
                {
                  highlight: "You believe you were born to lead",
                  rest: "— in your home, your workplace, your community, or the world.",
                },
                {
                  highlight: "You want to dominate your field",
                  rest: "with excellence, integrity, and divine purpose.",
                },
                {
                  highlight: "You want to be influential",
                  rest: "but aren't sure where to start or how to take that first bold step.",
                },
                {
                  highlight: "There is a call of greatness over your life",
                  rest: "— in ministry, business, politics, education, media, family, or the arts — and you feel it.",
                },
              ].map((item, idx) => (
                <div key={idx} className="border-t border-border/60 pt-8">
                  <p className="text-lg lg:text-xl leading-relaxed text-muted-foreground font-light">
                    <strong className="font-display font-medium text-xl lg:text-2xl text-foreground block mb-2">
                      {item.highlight}
                    </strong>
                    {item.rest}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>



      {/* Quotation - Typographic Emphasis */}
      <section className="py-20 lg:py-32 px-6 lg:px-12 bg-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h3 className="font-display italic text-3xl lg:text-5xl text-plum leading-normal mb-8">
              &ldquo;You did not choose me, but I chose you and appointed you so
              that you might go and bear fruit &mdash; fruit that will
              last.&rdquo;
            </h3>
            <p className="text-xs tracking-[0.3em] uppercase text-champagne font-bold">
              John 15:16
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats - Elegant Dark Card */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 bg-ivory pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="bg-plum text-ivory rounded-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-24 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-wine to-plum opacity-50"></div>

              <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 lg:gap-16 text-center divide-x divide-champagne/20">
                {isSettingsLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center space-y-2 px-2">
                      <Skeleton className="h-10 w-12 sm:h-16 sm:w-24 bg-ivory/10 animate-pulse" />
                      <Skeleton className="h-3 w-16 sm:w-32 bg-ivory/10 animate-pulse" />
                    </div>
                  ))
                ) : (
                  [
                    { value: stat1Value, label: stat1Label },
                    { value: stat2Value, label: stat2Label },
                    { value: stat3Value, label: stat3Label },
                  ].map((stat) => (
                    <div key={stat.label} className="px-1 sm:px-4">
                      <div className="text-4xl sm:text-6xl lg:text-8xl font-display text-champagne mb-2 lg:mb-4 font-light">
                        {stat.value}
                      </div>
                      <div className="text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.3em] uppercase text-ivory/80 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>


    </div>
  );
};

export default Index;
