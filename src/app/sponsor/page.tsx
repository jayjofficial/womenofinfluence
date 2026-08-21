"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrency, isAfricanCurrency } from "@/context/CurrencyContext";

const sponsorTiers = {
  "Custom Contribution": { price: 0, desc: "Enter a custom amount to support our general scholarship fund." }
};

const SponsorContent = () => {
  const searchParams = useSearchParams();
  const paymentSuccessParam = searchParams.get("payment") === "success" || searchParams.get("status") === "success";

  const [tier, setTier] = useState<keyof typeof sponsorTiers>("Custom Contribution");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currency } = useCurrency();
  const submitSponsorship = useMutation(api.inbox.submitSponsorship);
  const triggerBackupBankDetails = useMutation(api.inbox.triggerSponsorshipBackupBankDetails);
  const initiatePayment = useAction(api.accrue.initiateAccruePayment);
  const [sponsorDetails, setSponsorDetails] = useState({
    name: "",
    email: "",
    org: ""
  });

  const isAfrican = isAfricanCurrency(currency.code);

  const getPriceDisplay = () => {
    return customAmount ? `${currency.symbol} ${customAmount}` : "Custom Amount";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmount || isNaN(Number(customAmount))) return;
    
    setIsSubmitting(true);
    let createdSponsorshipId: any = null;

    try {
      if (!isAfrican) {
        // Non-African currency: Trigger automatic bank details email and show confirmation
        await submitSponsorship({
          name: sponsorDetails.name,
          email: sponsorDetails.email,
          organization: sponsorDetails.org || undefined,
          amount: Number(customAmount),
          currency: currency.code,
          sendBankDetailsEmail: true,
        });

        setIsSubmitted(true);
        return;
      }

      // African currency: Record sponsorship without sending initial bank email
      const sponsorshipId = await submitSponsorship({
        name: sponsorDetails.name,
        email: sponsorDetails.email,
        organization: sponsorDetails.org || undefined,
        amount: Number(customAmount),
        currency: currency.code,
        sendBankDetailsEmail: false,
      });
      createdSponsorshipId = sponsorshipId;

      // Split name into first and last name
      const names = sponsorDetails.name.trim().split(" ");
      const firstName = names[0] || "Sponsor";
      const lastName = names.slice(1).join(" ") || "Partner";

      // Map countryCode dynamically from currency
      let countryCode = "GH";
      if (currency.code === "NGN") countryCode = "NG";
      else if (currency.code === "KES") countryCode = "KE";
      else if (currency.code === "ZAR") countryCode = "ZA";
      else if (currency.code === "EGP") countryCode = "EG";
      else if (currency.code === "RWF") countryCode = "RW";
      else if (currency.code === "UGX") countryCode = "UG";
      else if (currency.code === "TZS") countryCode = "TZ";
      else if (currency.code === "ZMW") countryCode = "ZM";
      else if (currency.code === "BWP") countryCode = "BW";

      const paymentInfo = await initiatePayment({
        amount: Number(customAmount),
        currency: currency.code,
        countryCode,
        reference: sponsorshipId,
        email: sponsorDetails.email,
        firstName,
        lastName,
      });

      if (paymentInfo?.hostedLink) {
        window.location.href = paymentInfo.hostedLink;
      } else {
        // Fallback: Send backup bank details email
        if (createdSponsorshipId) {
          await triggerBackupBankDetails({ id: createdSponsorshipId });
        }
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Sponsorship submission or online payment failed:", error);
      if (isAfrican && createdSponsorshipId) {
        try {
          await triggerBackupBankDetails({ id: createdSponsorshipId });
        } catch (backupError) {
          console.error("Failed to trigger backup bank details:", backupError);
        }
      }
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen font-body text-foreground overflow-hidden selection:bg-plum selection:text-white pt-32 pb-12">
      <section className="px-6 lg:px-12 max-w-4xl mx-auto mb-16 text-center">
        <AnimatedSection>
          <span className="text-plum font-body text-xs tracking-[0.3em] uppercase mb-8 block">
            Sponsorship
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium text-foreground leading-[1.1] tracking-tight mb-6">
            Invest in a <span className="italic text-soft-gold">Leader.</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            Your sponsorship directly enables qualified women to receive high-level leadership training, mentorship, and career acceleration.
          </p>
        </AnimatedSection>
      </section>

      <section className="px-6 lg:px-12 max-w-3xl mx-auto pb-32">
        <AnimatedSection>
          <div className="bg-white border border-border/40 p-8 lg:p-12 shadow-sm rounded-xl">
            
            {paymentSuccessParam ? (
              <div className="text-center py-12 space-y-6">
                <div className="flex justify-center text-soft-gold">
                  <CheckCircle2 size={64} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-medium text-3xl text-plum italic">Thank You for Your Support!</h3>
                <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-md mx-auto mb-4">
                  Sponsorship of <strong className="text-foreground">{getPriceDisplay()}</strong> initiated. We have sent an email with the bank account details for your transfer.
                </p>
                <div className="pt-6">
                  <Link href="/" className="group inline-flex items-center gap-4 text-sm tracking-widest uppercase border-b border-plum pb-1 text-plum hover:text-plum-dark transition-colors">
                    Back to Home <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ) : isSubmitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="flex justify-center text-soft-gold">
                  <CheckCircle2 size={64} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-medium text-3xl text-plum italic">Thank You for Your Support!</h3>
                <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-md mx-auto mb-4">
                  Sponsorship of <strong className="text-foreground">{getPriceDisplay()}</strong> initiated. We have sent an email with the bank account details for your transfer.
                </p>
                
                <div className="pt-6">
                  <Link href="/" className="group inline-flex items-center gap-4 text-sm tracking-widest uppercase border-b border-plum pb-1 text-plum hover:text-plum-dark transition-colors">
                    Back to Home <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Select Tier */}
                <div className="border-b border-border/40 pb-10">
                  <div className="relative">
                    <select 
                      value={tier}
                      onChange={(e) => setTier(e.target.value as keyof typeof sponsorTiers)}
                      className="w-full appearance-none bg-ivory border border-plum/20 px-6 py-5 text-xl font-display font-medium text-plum italic focus:outline-none focus:border-plum transition-colors cursor-pointer"
                    >
                      {Object.entries(sponsorTiers).map(([name]) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-plum">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground font-light italic">
                    {sponsorTiers[tier].desc}
                  </p>
                </div>

                {/* Custom Amount Field */}
                {tier === "Custom Contribution" && (
                  <AnimatedSection>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                          Sponsorship Amount *
                        </label>
                        <span className="text-[10px] font-semibold tracking-wider text-plum uppercase">
                          Sponsoring in {currency.label}
                        </span>
                      </div>
                      <div className="flex items-end gap-3 pb-4 border-b border-border/40">
                        <span className="text-foreground/80 font-medium text-lg shrink-0 select-none pb-0.5">
                          {currency.symbol}
                        </span>
                        <input 
                          required 
                          type="number" 
                          min="1"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="0" 
                          className="w-full bg-transparent text-foreground font-light text-lg focus:outline-none placeholder:text-muted-foreground/30" 
                        />
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {/* Sponsor Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground/80 mb-2 uppercase tracking-wider">
                      Sponsor / Organization Name *
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={sponsorDetails.name}
                      onChange={(e) => setSponsorDetails({...sponsorDetails, name: e.target.value})}
                      placeholder="e.g. Ama Serwaa or Enterprise Ltd." 
                      className="w-full pb-4 border-b border-border/40 bg-transparent text-foreground font-light text-lg focus:outline-none focus:border-plum placeholder:text-muted-foreground/30 transition-colors" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 mb-2 uppercase tracking-wider">
                        Contact Email *
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={sponsorDetails.email}
                        onChange={(e) => setSponsorDetails({...sponsorDetails, email: e.target.value})}
                        placeholder="sponsor@example.com" 
                        className="w-full pb-4 border-b border-border/40 bg-transparent text-foreground font-light text-lg focus:outline-none focus:border-plum placeholder:text-muted-foreground/30 transition-colors" 
                    />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground/80 mb-2 uppercase tracking-wider">
                        Organization (Optional)
                      </label>
                      <input 
                        type="text" 
                        value={sponsorDetails.org}
                        onChange={(e) => setSponsorDetails({...sponsorDetails, org: e.target.value})}
                        placeholder="Company name" 
                        className="w-full pb-4 border-b border-border/40 bg-transparent text-foreground font-light text-lg focus:outline-none focus:border-plum placeholder:text-muted-foreground/30 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col items-center">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-plum text-white font-body font-medium px-12 py-5 tracking-widest uppercase text-sm hover:bg-wine transition-all duration-300 flex items-center justify-center gap-4 w-full sm:w-auto shadow-md hover-lift disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Processing..."
                      : isAfrican
                        ? `Proceed to Payment (${getPriceDisplay()})`
                        : `Complete Sponsorship (${getPriceDisplay()})`}
                    <ArrowRight size={18} />
                  </button>
                  
                  <div className="flex items-center gap-2 mt-6 text-muted-foreground font-light text-sm">
                    {isAfrican ? (
                      <>
                        <ShieldCheck size={16} className="text-plum" />
                        <span>Payments securely processed via Accrue / Mobile Money & Card</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} className="text-plum" />
                        <span>Transfer instructions will be delivered securely to your email</span>
                      </>
                    )}
                  </div>
                </div>
              </form>
            )}

          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default function SponsorPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-12 min-h-screen text-center">Loading...</div>}>
      <SponsorContent />
    </Suspense>
  );
}
