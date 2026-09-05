import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { CachePreloader } from "@/components/CachePreloader";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  title: "Women of Influence Academy",
  description: "Empowering women through mentorship, education, and community.",
  verification: {
    google: "8Sd10_DKAR22hODbkQ2WFjf3ZcFjuzcQjYd9rbu6wdc",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full overscroll-y-none antialiased selection:bg-plum selection:text-white">
      <body className="min-h-full flex flex-col font-body bg-background text-foreground">
        <ConvexClientProvider>
          <ConvexQueryCacheProvider expiration={300000}>
            <CurrencyProvider>
              <CachePreloader />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CurrencyProvider>
          </ConvexQueryCacheProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
